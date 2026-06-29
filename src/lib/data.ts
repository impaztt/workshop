import { readDB } from "./db";
import type { Game, GameContent } from "./types";

export async function getMeta() {
  const db = await readDB();
  return db.meta;
}

export async function getAllGames(): Promise<Game[]> {
  const db = await readDB();
  return [...db.games].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getActiveGames(): Promise<Game[]> {
  const games = await getAllGames();
  return games.filter((g) => g.isActive);
}

export async function getGame(gameId: string): Promise<Game | undefined> {
  const db = await readDB();
  return db.games.find((g) => g.gameId === gameId);
}

export async function getContents(gameId: string): Promise<GameContent[]> {
  const db = await readDB();
  return db.contents
    .filter((c) => c.gameId === gameId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getActiveContents(gameId: string): Promise<GameContent[]> {
  const contents = await getContents(gameId);
  return contents.filter((c) => c.isActive);
}

// 콘텐츠가 1개 이상 등록되어 있어야 시작 가능. 선물증정은 선물/참가자 기준.
export async function isGamePlayable(game: Game): Promise<boolean> {
  const db = await readDB();
  if (game.gameType === "gift") {
    return db.gifts.length > 0 && db.giftParticipants.length > 0;
  }
  if (game.gameType === "mission") {
    return db.missions.length > 0;
  }
  return db.contents.some((c) => c.gameId === game.gameId && c.isActive);
}

export async function getContentCount(gameId: string): Promise<number> {
  const db = await readDB();
  return db.contents.filter((c) => c.gameId === gameId && c.isActive).length;
}
