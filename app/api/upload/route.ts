import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // Try Supabase Storage first
    const db = getSupabase();
    if (db) {
      // Create bucket if it doesn't exist
      await db.storage.createBucket("media", { public: true }).catch(() => {});

      const { error } = await db.storage
        .from("media")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (!error) {
        const { data } = db.storage.from("media").getPublicUrl(filename);
        return NextResponse.json({ url: data.publicUrl });
      }
    }

    // Fallback: save locally (dev only)
    if (process.env.NODE_ENV !== "production") {
      const { promises: fs } = await import("fs");
      const path = await import("path");
      const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
      const localFilename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      await fs.writeFile(path.join(UPLOAD_DIR, localFilename), buffer);
      return NextResponse.json({ url: `/uploads/${localFilename}` });
    }

    return NextResponse.json({ error: "Upload failed - storage not configured" }, { status: 500 });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
