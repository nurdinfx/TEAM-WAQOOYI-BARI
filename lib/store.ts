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
  if (!url || !key || url.includes("placeholder")) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@supabase/supabase-js");
    return createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
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
      { data: leaders },
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

    if (se) return null;

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
    const m = (rows: any[] | null, fn: (r: any) => unknown) => (rows || []).map(fn);

    return enrichContent({
      settings,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      leaders:    m(leaders,     (r: any) => ({ id: r.id, name: r.name, position: r.position, bio: r.bio || "", image: r.image || "", social: r.social || {} })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      members:    m(members,     (r: any) => ({ id: r.id, name: r.name, role: r.role || "", level: r.level || "Xubin Firfircoon", image: r.image || "" })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      books:      m(books,       (r: any) => ({ id: r.id, title: r.title, author: r.author, cover: r.cover || "", dateRead: r.date_read || "", rating: r.rating || 5, summary: r.summary || "", category: r.category || "Fiction" })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events:     m(events,      (r: any) => ({ id: r.id, title: r.title, date: r.event_date, time: r.time || "", location: r.location || "", description: r.description || "", isUpcoming: r.is_upcoming ?? true })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      galleryItems: m(gallery,   (r: any) => ({ id: r.id, type: r.type || "photo", src: r.src || "", thumbnail: r.thumbnail || "", caption: r.caption || "", date: r.item_date || "" })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      articles:   m(articles,    (r: any) => ({ id: r.id, title: r.title, author: r.author, date: r.article_date, excerpt: r.excerpt || "", content: r.content || "", cover: r.cover || "", published: r.published ?? false })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sponsors:   m(sponsors,    (r: any) => ({ id: r.id, name: r.name, logo: r.logo || "" })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      donations:  m(donations,   (r: any) => ({ id: r.id, donorName: r.donor_name || "", amount: r.amount || 0, channel: r.channel || "evc", date: r.donation_date, note: r.note || "" })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      subscribers: m(subscribers,(r: any) => ({ id: r.id, email: r.email, date: r.sub_date })),
      paymentChannels: defaults.paymentChannels,
      bookCategories:  defaults.bookCategories,
    });
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
  // 1. Supabase (production with keys)
  const fromDb = await readFromSupabase();
  if (fromDb) return fromDb;

  // 2. Filesystem (local dev)
  const fromFs = await readFromFs();
  if (fromFs) return enrichContent(deepMergeContent(getDefaultContent(), fromFs));

  // 3. Hardcoded defaults
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
