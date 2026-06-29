import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { uploadsDir } from "./paths";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const AUDIO_EXT = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac"]);

// FormData의 File을 저장하고 공개 URL을 반환.
// - Vercel Blob 토큰(BLOB_READ_WRITE_TOKEN)이 있으면 Blob에 업로드 → 영구 보존 + CDN URL
// - 없으면 로컬 업로드 폴더에 저장 → /media/<file> 동적 라우트로 서빙 (개발 환경)
// 파일이 없거나 비어 있으면 null.
export async function saveUpload(
  file: FormDataEntryValue | null,
  kind: "image" | "audio",
): Promise<string | null> {
  if (!file || typeof file === "string") return null;
  const f = file as File;
  if (!f.size || !f.name) return null;

  const ext = path.extname(f.name).toLowerCase();
  const allowed = kind === "image" ? IMAGE_EXT : AUDIO_EXT;
  if (!allowed.has(ext)) {
    throw new Error(
      `허용되지 않은 파일 형식입니다 (${kind === "image" ? "이미지" : "오디오"}): ${ext}`,
    );
  }

  const filename =
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + ext;
  const buffer = Buffer.from(await f.arrayBuffer());

  // 클라우드(Vercel Blob) 영구 저장
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${filename}`, buffer, {
      access: "public",
      contentType: f.type || undefined,
      addRandomSuffix: false,
    });
    return blob.url;
  }

  // 로컬 파일 저장 (개발 환경)
  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/media/${filename}`;
}
