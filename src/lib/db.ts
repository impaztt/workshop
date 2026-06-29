import { promises as fs } from "fs";
import path from "path";
import type { DB } from "./types";
import { createSeedDB } from "./seed";
import { dataDir } from "./paths";

const dbPath = () => path.join(dataDir(), "db.json");

// 동시 쓰기 직렬화용 단순 뮤텍스 (단일 프로세스 기준)
let writeChain: Promise<unknown> = Promise.resolve();
// 메모리 캐시 — 매 요청마다 디스크를 다시 읽지 않도록
let cache: DB | null = null;

// 디스크에 쓰되, 읽기 전용 환경(서버리스 등)에서는 조용히 무시하고 메모리만 갱신
async function persist(db: DB): Promise<void> {
  try {
    await fs.mkdir(dataDir(), { recursive: true });
    await fs.writeFile(dbPath(), JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.warn(
      "[db] 디스크 저장 실패 — 메모리에만 반영됩니다 (읽기 전용 환경일 수 있음):",
      (err as Error).message,
    );
  }
}

async function ensureFile(): Promise<DB> {
  try {
    const raw = await fs.readFile(dbPath(), "utf-8");
    return JSON.parse(raw) as DB;
  } catch {
    const seed = createSeedDB();
    await persist(seed);
    return seed;
  }
}

export async function readDB(): Promise<DB> {
  if (cache) return cache;
  cache = await ensureFile();
  return cache;
}

// 콜백 안에서 DB를 직접 변형하면 디스크에 저장된다.
export async function mutateDB<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    const db = await readDB();
    const result = await fn(db);
    cache = db;
    await persist(db);
    return result;
  };
  // 이전 쓰기가 끝난 뒤 실행되도록 체인에 연결
  const next = writeChain.then(run, run);
  writeChain = next.catch(() => undefined);
  return next;
}

// 게임 진행 상태 초기화 등에서 시드로 되돌릴 때 사용
export async function resetDB(): Promise<DB> {
  return mutateDB((db) => {
    const seed = createSeedDB();
    db.meta = seed.meta;
    db.games = seed.games;
    db.contents = seed.contents;
    db.gifts = seed.gifts;
    db.giftParticipants = seed.giftParticipants;
    return db;
  });
}

export function uid(prefix = ""): string {
  return (
    prefix +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8)
  );
}
