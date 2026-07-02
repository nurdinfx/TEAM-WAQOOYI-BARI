import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveContent } from "@/lib/store";
import type { ContentData } from "@/lib/types";

function revalidateSite() {
  revalidatePath("/", "layout");
  [
    "/",
    "/about",
    "/leadership",
    "/members",
    "/books",
    "/events",
    "/gallery",
    "/news",
    "/support",
    "/contact",
  ].forEach((path) => revalidatePath(path));
}

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as ContentData;
    const saved = await saveContent(body);
    revalidateSite();
    return NextResponse.json({ success: true, content: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const partial = (await request.json()) as Partial<ContentData>;
    const current = await getContent();
    const { deepMergeContent } = await import("@/lib/content-utils");
    const updated = await saveContent(deepMergeContent(current, partial));
    revalidateSite();
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
