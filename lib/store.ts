import type { ContentData } from "./types";
import { getDefaultContent } from "./defaults";
import { deepMergeContent, enrichContent, validateContent } from "./content-utils";

// In-memory store for serverless environments (Vercel)
// On local dev, we use the filesystem for persistence
let memoryStore: ContentData | null = null;

async function getFs() {
  if (process.env.NODE_ENV === "production") return null;
  try {
    const { promises: fs } = await import("fs");
    const path = await import("path");
    return { fs, DATA_FILE: path.join(process.cwd(), "data", "content.json") };
  } catch {
    return null;
  }
}

export async function getContent(): Promise<ContentData> {
  // Return memory store if available (serverless)
  if (memoryStore) return memoryStore;

  // Try filesystem (local dev)
  const io = await getFs();
  if (io) {
    try {
      const raw = await io.fs.readFile(io.DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw) as Partial<ContentData>;
      const merged = deepMergeContent(getDefaultContent(), parsed);
      return enrichContent(merged);
    } catch {
      // File doesn't exist yet, use defaults
    }
  }

  // Fall back to defaults (Vercel / first run)
  const defaults = enrichContent(getDefaultContent());
  memoryStore = defaults;
  return defaults;
}

export async function saveContent(content: ContentData): Promise<ContentData> {
  const error = validateContent(content);
  if (error) throw new Error(error);

  const enriched = enrichContent(content);

  // Always update memory store
  memoryStore = enriched;

  // Also persist to filesystem in local dev
  const io = await getFs();
  if (io) {
    try {
      const path = await import("path");
      await io.fs.mkdir(path.dirname(io.DATA_FILE), { recursive: true });
      await io.fs.writeFile(io.DATA_FILE, JSON.stringify(enriched, null, 2), "utf-8");
    } catch {
      // Filesystem write failed — memory store is still updated
    }
  }

  return enriched;
}

export async function updateContent(
  partial: Partial<ContentData>
): Promise<ContentData> {
  const current = await getContent();
  const updated = deepMergeContent(current, partial);
  return saveContent(updated);
}

export async function addSubscriber(email: string): Promise<ContentData> {
  const content = await getContent();
  const exists = content.subscribers.some(
    (s) => s.email.toLowerCase() === email.toLowerCase()
  );
  if (exists) return content;

  const subscribers = [
    ...content.subscribers,
    {
      id: Date.now().toString(36),
      email: email.toLowerCase().trim(),
      date: new Date().toISOString().split("T")[0],
    },
  ];
  return saveContent({ ...content, subscribers });
}
