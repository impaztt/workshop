import { promises as fs } from "fs";
import path from "path";
import { uploadsDir } from "./paths";

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const AUDIO_EXT = new Set([".mp3", ".wav", ".ogg", ".m4a", ".aac"]);

// FormData의 File을 업로드 폴더에 저장하고 /media/<file> URL을 반환.
// (정적 폴더가 아닌 동적 라우트로 서빙 → 서버리스 환경에서도 표시 가능)
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

  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });
  const filename =
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + ext;
  const buffer = Buffer.from(await f.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/media/${filename}`;
}
