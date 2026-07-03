import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
]);

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file");
  const section = String(formData.get("section") || "site").replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  if (!(file instanceof File) || !allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Envie uma imagem JPG, PNG, WebP, AVIF ou um vídeo MP4/WebM." }, { status: 400 });
  }

  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "O arquivo deve ter no máximo 15 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "bin";
  const path = `${section}/${Date.now()}-${randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return NextResponse.json({ path, url: data.publicUrl });
}
