import { promises as fs } from "fs";
import path from "path";
import { uploadsDir } from "@/lib/paths";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".m4a": "audio/mp4",
  ".aac": "audio/aac",
};

// 업로드된 미디어 파일을 서빙 (정적 폴더 대신 사용 → 서버리스 호환)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const safe = path.basename(file); // 경로 탈출 방지
  const ext = path.extname(safe).toLowerCase();
  const contentType = MIME[ext];
  if (!contentType) {
    return new Response("Unsupported media type", { status: 415 });
  }
  try {
    const buf = await fs.readFile(path.join(uploadsDir(), safe));
    return new Response(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
