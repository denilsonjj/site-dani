import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

const mediaExtensions: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const section = String(formData.get("section") || "site").replace(/[^a-z0-9-]/gi, "-").toLowerCase();

    if (!(file instanceof File) || !mediaExtensions[file.type]) {
      return NextResponse.json({ error: "Envie uma imagem JPG, PNG, WebP, AVIF ou um vídeo MP4/WebM." }, { status: 400 });
    }

    if (file.size > 60 * 1024 * 1024) {
      return NextResponse.json({ error: "O arquivo deve ter no máximo 60 MB." }, { status: 400 });
    }

    const path = `${section}/${Date.now()}-${randomUUID()}.${mediaExtensions[file.type]}`;
    const { error: uploadError } = await supabase!.storage.from("site-media").upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw uploadError;

    const url = supabase!.storage.from("site-media").getPublicUrl(path).data.publicUrl;
    return NextResponse.json({ kind: file.type.startsWith("video/") ? "video" : "image", path, url });
  } catch (uploadError) {
    const message = uploadError instanceof Error ? uploadError.message : "Não foi possível enviar o arquivo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
