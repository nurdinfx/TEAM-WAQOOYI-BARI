import { promises as fs } from "fs";
import path from "path";
import type { ContentData } from "./types";
import { getDefaultContent } from "./defaults";
import { deepMergeContent, enrichContent, validateContent } from "./content-utils";

const DATA_FILE = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<ContentData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ContentData>;
    const merged = deepMergeContent(getDefaultContent(), parsed);
    return enrichContent(merged);
  } catch {
    const defaults = enrichContent(getDefaultContent());
    await saveContent(defaults);
    return defaults;
  }
}

export async function saveContent(content: ContentData): Promise<ContentData> {
  const error = validateContent(content);
  if (error) throw new Error(error);

  const enriched = enrichContent(content);
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(enriched, null, 2), "utf-8");
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
