import path from "path";
import os from "os";

// 데이터/업로드 저장 위치를 환경에 맞게 해석한다.
// - 로컬 개발: 프로젝트 ./data (영구)
// - 서버리스(Vercel 등): 프로젝트 폴더는 읽기 전용이므로 OS 임시 폴더(쓰기 가능, 인스턴스 한정)
// - 명시적으로 DATA_DIR 환경변수가 있으면 그것을 우선 (영구 디스크 마운트 시)
export function dataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  const serverless =
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY;
  if (serverless) return path.join(os.tmpdir(), "workshop-data");
  return path.join(process.cwd(), "data");
}

export function uploadsDir(): string {
  return path.join(dataDir(), "uploads");
}
