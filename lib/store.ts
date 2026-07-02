/**
 * Content Store
 *
 * Priority order:
 * 1. Supabase (if NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set)
 * 2. Local filesystem (dev only)
 * 3. In-memory + hardcoded defaults (fallback)
 */

import type { ContentData } from "./types";
import { getDefaultContent } from "./defaults";
import { deepMergeContent, enrichContent, validateContent } from "./content-utils";

// ─── Supabase ────────────────────────────────────────────────────────────────
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || key.includes("placeholder") || key.includes("your_service")) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@supabase/supabase-js");
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: {
        headers: {
          // Support both legacy eyJ keys and new sb_ keys
          ...(key.startsWith("sb_") ? { "x-api-key": key } : {}),
        },
      },
    });
  } catch {
    return null;
  }
}

async function readFromSupabase(): Promise<ContentData | null> {
  const db = getSupabaseClient();
  if (!db) return null;
  try {
    const [
      { data: settingsRows, error: se },
      { data: leaders, error: le },
      { data: members },
      { data: books },
      { data: events },
      { data: gallery },
      { data: articles },
      { data: sponsors },
      { data: donations },
      { data: subscribers },
    ] = await Promise.all([
      db.from("site_settings").select("*"),
      db.from("leaders").select("*").order("display_order"),
      db.from("members").select("*").order("created_at"),
      db.from("books").select("*").order("created_at", { ascending: false }),
      db.from("events").select("*").order("event_date", { ascending: false }),
      db.from("gallery_items").select("*").order("created_at", { ascending: false }),
      db.from("articles").select("*").order("article_date", { ascending: false }),
      db.from("sponsors").select("*").order("created_at"),
      db.from("donations").select("*").order("created_at", { ascending: false }),
      db.from("newsletter_subscribers").select("*").order("created_at"),
    ]);

    // If leaders query errored (table doesn't exist), Supabase not set up yet
    if (le) return null;

    const defaults = getDefaultContent();
    const sm: Record<string, unknown> = {};
    (settingsRows || []).forEach((r: { key: string; value: unknown }) => { sm[r.key] = r.value; });

    const settings = {
      ...defaults.settings,
      ...(sm.hero_title           ? { heroTitle:            sm.hero_title as string }           : {}),
      ...(sm.hero_subtitle        ? { heroSubtitle:         sm.hero_subtitle as string }         : {}),
      ...(sm.hero_description     ? { heroDescription:      sm.hero_description as string }     : {}),
      ...(sm.hero_badge           ? { heroBadge:            sm.hero_badge as string }           : {}),
      ...(sm.about                ? { about:                sm.about as string }                : {}),
      ...(sm.fundraising_goal     ? { fundraisingGoal:      sm.fundraising_goal as number }     : {}),
      ...(sm.fundraising_progress ? { fundraisingProgress:  sm.fundraising_progress as number } : {}),
      ...(sm.stats                ? { stats:                sm.stats as typeof defaults.settings.stats }    : {}),
      ...(sm.contact              ? { contact:              sm.contact as typeof defaults.settings.contact }: {}),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data: any[] | null) => data || [];

    // NOTE: we use the Supabase data as-is (even if empty arrays)
    // This means admin deletes ARE reflected on the website
    return {
      settings,
      leaders: rows(leaders).map((r) => ({
        id: String(r.id), name: String(r.name), position: String(r.position),
        bio: String(r.bio || ""), image: String(r.image || ""), social: (r.social as Leader["social"]) || {},
      })),
      members: rows(members).map((r) => ({
        id: String(r.id), name: String(r.name), role: String(r.role || ""),
        level: String(r.level || "Xubin Firfircoon"), image: String(r.image || ""),
      })),
      books: rows(books).map((r) => ({
        id: String(r.id), title: String(r.title), author: String(r.author),
        cover: String(r.cover || ""), dateRead: String(r.date_read || ""),
        rating: Number(r.rating) || 5, summary: String(r.summary || ""), category: String(r.category || "Fiction"),
      })),
      events: rows(events).map((r) => ({
        id: String(r.id), title: String(r.title), date: String(r.event_date),
        time: String(r.time || ""), location: String(r.location || ""),
        description: String(r.description || ""), isUpcoming: Boolean(r.is_upcoming ?? true),
      })),
      galleryItems: rows(gallery).map((r) => ({
        id: String(r.id), type: (r.type === "video" ? "video" : "photo") as "photo" | "video",
        src: String(r.src || ""), thumbnail: String(r.thumbnail || ""),
        caption: String(r.caption || ""), date: String(r.item_date || ""),
      })),
      articles: rows(articles).map((r) => ({
        id: String(r.id), title: String(r.title), author: String(r.author),
        date: String(r.article_date), excerpt: String(r.excerpt || ""),
        content: String(r.content || ""), cover: String(r.cover || ""), published: Boolean(r.published ?? false),
      })),
      sponsors: rows(sponsors).map((r) => ({
        id: String(r.id), name: String(r.name), logo: String(r.logo || ""),
      })),
      donations: rows(donations).map((r) => ({
        id: String(r.id), donorName: String(r.donor_name || ""), amount: Number(r.amount) || 0,
        channel: String(r.channel || "evc"), date: String(r.donation_date), note: String(r.note || ""),
      })),
      subscribers: rows(subscribers).map((r) => ({
        id: String(r.id), email: String(r.email), date: String(r.sub_date),
      })),
      paymentChannels: defaults.paymentChannels,
      bookCategories:  defaults.bookCategories,
    };
  } catch (err) {
    console.error("[store] Supabase read error:", err);
    return null;
  }
}

async function writeToSupabase(content: ContentData): Promise<boolean> {
  const db = getSupabaseClient();
  if (!db) return false;
  try {
    const { settings: s } = content;
    await db.from("site_settings").upsert([
      { key: "hero_title",           value: s.heroTitle },
      { key: "hero_subtitle",        value: s.heroSubtitle },
      { key: "hero_description",     value: s.heroDescription },
      { key: "hero_badge",           value: s.heroBadge },
      { key: "about",                value: s.about },
      { key: "fundraising_goal",     value: s.fundraisingGoal },
      { key: "fundraising_progress", value: s.fundraisingProgress },
      { key: "stats",                value: s.stats },
      { key: "contact",              value: s.contact },
    ], { onConflict: "key" });

    await Promise.all([
      db.from("leaders").upsert(content.leaders.map((l) => ({ id: l.id, name: l.name, position: l.position, bio: l.bio, image: l.image, social: l.social || {} })), { onConflict: "id" }),
      db.from("members").upsert(content.members.map((m) => ({ id: m.id, name: m.name, role: m.role, level: m.level, image: m.image })), { onConflict: "id" }),
      db.from("books").upsert(content.books.map((b) => ({ id: b.id, title: b.title, author: b.author, cover: b.cover, date_read: b.dateRead, rating: b.rating, summary: b.summary, category: b.category })), { onConflict: "id" }),
      db.from("events").upsert(content.events.map((e) => ({ id: e.id, title: e.title, event_date: e.date, time: e.time, location: e.location, description: e.description, is_upcoming: e.isUpcoming })), { onConflict: "id" }),
      db.from("gallery_items").upsert(content.galleryItems.map((g) => ({ id: g.id, type: g.type, src: g.src, thumbnail: g.thumbnail || "", caption: g.caption, item_date: g.date })), { onConflict: "id" }),
      db.from("articles").upsert(content.articles.map((a) => ({ id: a.id, title: a.title, author: a.author, article_date: a.date, excerpt: a.excerpt, content: a.content, cover: a.cover, published: a.published })), { onConflict: "id" }),
      db.from("sponsors").upsert(content.sponsors.map((s) => ({ id: s.id, name: s.name, logo: s.logo || "" })), { onConflict: "id" }),
      db.from("donations").upsert(content.donations.map((d) => ({ id: d.id, donor_name: d.donorName, amount: d.amount, channel: d.channel, donation_date: d.date, note: d.note || "" })), { onConflict: "id" }),
      db.from("newsletter_subscribers").upsert(content.subscribers.map((s) => ({ id: s.id, email: s.email, sub_date: s.date })), { onConflict: "id" }),
    ]);
    return true;
  } catch (err) {
    console.error("[store] Supabase write error:", err);
    return false;
  }
}

// ─── Local filesystem (dev) ───────────────────────────────────────────────────
async function readFromFs(): Promise<ContentData | null> {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const raw = await fs.readFile(path.join(process.cwd(), "data", "content.json"), "utf-8");
    return JSON.parse(raw) as ContentData;
  } catch { return null; }
}

async function writeToFs(content: ContentData): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    const file = path.join(process.cwd(), "data", "content.json");
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(content, null, 2), "utf-8");
  } catch { /* ignore */ }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function getContent(): Promise<ContentData> {
  // 1. Supabase (production with keys) — trust its data even if empty
  const fromDb = await readFromSupabase();
  if (fromDb !== null) return fromDb;

  // 2. Filesystem (local dev)
  const fromFs = await readFromFs();
  if (fromFs) return enrichContent(deepMergeContent(getDefaultContent(), fromFs));

  // 3. Hardcoded defaults (no Supabase, no filesystem)
  return enrichContent(getDefaultContent());
}

export async function saveContent(content: ContentData): Promise<ContentData> {
  const error = validateContent(content);
  if (error) throw new Error(error);
  const enriched = enrichContent(content);

  // Save to Supabase first (production)
  const savedToDb = await writeToSupabase(enriched);

  // Save to filesystem in dev
  if (!savedToDb) await writeToFs(enriched);

  return enriched;
}

export async function updateContent(partial: Partial<ContentData>): Promise<ContentData> {
  const current = await getContent();
  return saveContent(deepMergeContent(current, partial));
}

export async function addSubscriber(email: string): Promise<ContentData> {
  const content = await getContent();
  if (content.subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
    return content;
  }
  return saveContent({
    ...content,
    subscribers: [
      ...content.subscribers,
      { id: Date.now().toString(36), email: email.toLowerCase().trim(), date: new Date().toISOString().split("T")[0] },
    ],
  });
}
