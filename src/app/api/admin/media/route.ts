import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { NextResponse } from "next/server";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";
import { requireAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";

const allowedTypes = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/quicktime",
  "video/mp4",
  "video/webm",
]);

type PreparedFile = {
  buffer: Buffer;
  contentType: string;
  extension: "webp" | "webm" | "mp4";
};

type AdminSupabase = NonNullable<ReturnType<typeof requireAdminRequest>["supabase"]>;

function isVideo(type: string) {
  return type.startsWith("video/");
}

function runFfmpeg(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("Conversor de vídeo não disponível."));
      return;
    }

    const child = spawn(ffmpegPath, args, { windowsHide: true });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr || "Não foi possível converter o vídeo."));
    });
  });
}

async function prepareImage(input: Buffer): Promise<PreparedFile> {
  const buffer = await sharp(input)
    .rotate()
    .resize({ fit: "inside", height: 1920, width: 1920, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  return { buffer, contentType: "image/webp", extension: "webp" };
}

async function prepareVideo(input: Buffer, originalExtension: string) {
  const workdir = join(tmpdir(), `dani-media-${randomUUID()}`);
  await mkdir(workdir, { recursive: true });

  const source = join(workdir, `source.${originalExtension || "mp4"}`);
  const webm = join(workdir, "optimized.webm");
  const mp4 = join(workdir, "optimized.mp4");

  try {
    await writeFile(source, input);
    await runFfmpeg([
      "-y",
      "-i",
      source,
      "-vf",
      "scale=1920:-2:force_original_aspect_ratio=decrease",
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "34",
      webm,
    ]);
    await runFfmpeg([
      "-y",
      "-i",
      source,
      "-vf",
      "scale=1920:-2:force_original_aspect_ratio=decrease",
      "-an",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-crf",
      "24",
      mp4,
    ]);

    return {
      fallback: {
        buffer: await readFile(mp4),
        contentType: "video/mp4",
        extension: "mp4",
      } satisfies PreparedFile,
      primary: {
        buffer: await readFile(webm),
        contentType: "video/webm",
        extension: "webm",
      } satisfies PreparedFile,
    };
  } finally {
    await rm(workdir, { force: true, recursive: true });
  }
}

async function uploadFile(supabase: AdminSupabase, path: string, prepared: PreparedFile) {
  const { error } = await supabase.storage.from("site-media").upload(path, prepared.buffer, {
    cacheControl: "31536000",
    contentType: prepared.contentType,
    upsert: false,
  });

  if (error) throw error;

  return supabase.storage.from("site-media").getPublicUrl(path).data.publicUrl;
}

export async function POST(request: Request) {
  const { error, supabase } = requireAdminRequest(request);
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file");
  const section = String(formData.get("section") || "site").replace(/[^a-z0-9-]/gi, "-").toLowerCase();

  if (!(file instanceof File) || !allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Envie uma imagem JPG, PNG, WebP, AVIF ou um vídeo MP4/WebM/MOV." }, { status: 400 });
  }

  if (file.size > 60 * 1024 * 1024) {
    return NextResponse.json({ error: "O arquivo deve ter no máximo 60 MB." }, { status: 400 });
  }

  const input = Buffer.from(await file.arrayBuffer());
  const originalExtension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "mp4";
  const basePath = `${section}/${Date.now()}-${randomUUID()}`;

  try {
    if (isVideo(file.type)) {
      const { fallback, primary } = await prepareVideo(input, originalExtension);
      const primaryPath = `${basePath}.${primary.extension}`;
      const fallbackPath = `${basePath}.${fallback.extension}`;
      const [url, fallbackUrl] = await Promise.all([
        uploadFile(supabase, primaryPath, primary),
        uploadFile(supabase, fallbackPath, fallback),
      ]);

      return NextResponse.json({
        fallbackPath,
        fallbackUrl,
        kind: "video",
        path: primaryPath,
        url,
      });
    }

    const prepared = await prepareImage(input);
    const path = `${basePath}.${prepared.extension}`;
    const url = await uploadFile(supabase, path, prepared);

    return NextResponse.json({ kind: "image", path, url });
  } catch (uploadError) {
    const message = uploadError instanceof Error ? uploadError.message : "Não foi possível otimizar e enviar o arquivo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
