"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mutateDB, resetDB, uid } from "@/lib/db";
import { saveUpload } from "@/lib/upload";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/auth";
import type { GameType } from "@/lib/types";

async function requireAuth() {
  if (!(await isAuthenticated())) {
    throw new Error("인증이 필요합니다.");
  }
}

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}
function num(fd: FormData, key: string): number {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? n : 0;
}
function bool(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/games");
}

/* ───────── 인증 ───────── */

export async function loginAction(_prev: string | null, fd: FormData) {
  const password = str(fd, "password");
  if (!verifyPassword(password)) {
    return "비밀번호가 올바르지 않습니다.";
  }
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin");
}

/* ───────── 메타 (행사 정보) ───────── */

export async function updateMetaAction(fd: FormData) {
  await requireAuth();
  await mutateDB((db) => {
    db.meta.eventName = str(fd, "eventName") || db.meta.eventName;
    db.meta.eventDate = str(fd, "eventDate");
    db.meta.mainTitle = str(fd, "mainTitle") || db.meta.mainTitle;
  });
  revalidateAll();
}

/* ───────── 게임 CRUD ───────── */

export async function createGameAction(fd: FormData) {
  await requireAuth();
  const thumb = await saveUpload(fd.get("thumbnail"), "image");
  const id = uid("g");
  await mutateDB((db) => {
    const maxOrder = db.games.reduce((m, g) => Math.max(m, g.sortOrder), 0);
    const ts = new Date().toISOString();
    db.games.push({
      gameId: id,
      gameType: (str(fd, "gameType") || "balance") as GameType,
      title: str(fd, "title") || "새 게임",
      shortDescription: str(fd, "shortDescription"),
      description: str(fd, "description"),
      thumbnailUrl: thumb || "",
      mood: str(fd, "mood"),
      sortOrder: maxOrder + 1,
      defaultTimeLimit: num(fd, "defaultTimeLimit"),
      isActive: bool(fd, "isActive"),
      createdAt: ts,
      updatedAt: ts,
    });
  });
  revalidateAll();
  redirect(`/admin/games/${id}`);
}

export async function updateGameAction(fd: FormData) {
  await requireAuth();
  const gameId = str(fd, "gameId");
  const thumb = await saveUpload(fd.get("thumbnail"), "image");
  await mutateDB((db) => {
    const g = db.games.find((x) => x.gameId === gameId);
    if (!g) return;
    g.title = str(fd, "title") || g.title;
    g.gameType = (str(fd, "gameType") || g.gameType) as GameType;
    g.shortDescription = str(fd, "shortDescription");
    g.description = str(fd, "description");
    g.mood = str(fd, "mood");
    g.defaultTimeLimit = num(fd, "defaultTimeLimit");
    g.isActive = bool(fd, "isActive");
    if (thumb) g.thumbnailUrl = thumb;
    if (bool(fd, "removeThumbnail")) g.thumbnailUrl = "";
    g.updatedAt = new Date().toISOString();
  });
  revalidateAll();
  revalidatePath(`/admin/games/${gameId}`);
}

export async function deleteGameAction(fd: FormData) {
  await requireAuth();
  const gameId = str(fd, "gameId");
  await mutateDB((db) => {
    db.games = db.games.filter((g) => g.gameId !== gameId);
    db.contents = db.contents.filter((c) => c.gameId !== gameId);
  });
  revalidateAll();
  redirect("/admin/games");
}

export async function toggleGameAction(fd: FormData) {
  await requireAuth();
  const gameId = str(fd, "gameId");
  await mutateDB((db) => {
    const g = db.games.find((x) => x.gameId === gameId);
    if (g) g.isActive = !g.isActive;
  });
  revalidateAll();
}

// 정렬 순서 위/아래 이동
export async function moveGameAction(fd: FormData) {
  await requireAuth();
  const gameId = str(fd, "gameId");
  const dir = str(fd, "dir"); // "up" | "down"
  await mutateDB((db) => {
    const sorted = [...db.games].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((g) => g.gameId === gameId);
    if (idx < 0) return;
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapWith];
    const tmp = a.sortOrder;
    a.sortOrder = b.sortOrder;
    b.sortOrder = tmp;
  });
  revalidateAll();
}

/* ───────── 콘텐츠 CRUD ───────── */

export async function createContentAction(fd: FormData) {
  await requireAuth();
  const gameId = str(fd, "gameId");
  await mutateDB((db) => {
    const maxOrder = db.contents
      .filter((c) => c.gameId === gameId)
      .reduce((m, c) => Math.max(m, c.sortOrder), 0);
    db.contents.push({
      contentId: uid("c"),
      gameId,
      question: "",
      optionO: "",
      optionX: "",
      keyword: "",
      initialSound: "",
      answer: "",
      artist: "",
      hint: "",
      options: "",
      questionType: "주관식",
      count: 0,
      imageUrl: "",
      imageUrl2: "",
      imageUrl3: "",
      audioUrl: "",
      timeLimit: 0,
      sortOrder: maxOrder + 1,
      isActive: true,
    });
  });
  revalidatePath(`/admin/games/${gameId}`);
}

export async function updateContentAction(fd: FormData) {
  await requireAuth();
  const contentId = str(fd, "contentId");
  const gameId = str(fd, "gameId");
  const image = await saveUpload(fd.get("image"), "image");
  const audio = await saveUpload(fd.get("audio"), "audio");
  await mutateDB((db) => {
    const c = db.contents.find((x) => x.contentId === contentId);
    if (!c) return;
    c.question = str(fd, "question");
    c.optionO = str(fd, "optionO");
    c.optionX = str(fd, "optionX");
    c.keyword = str(fd, "keyword");
    c.initialSound = str(fd, "initialSound");
    c.answer = str(fd, "answer");
    c.artist = str(fd, "artist");
    c.hint = str(fd, "hint");
    c.options = str(fd, "options");
    c.questionType = str(fd, "questionType") || "주관식";
    c.count = num(fd, "count");
    c.timeLimit = num(fd, "timeLimit");
    c.isActive = bool(fd, "isActive");
    // 이미지 URL 직접 입력 (이미지퀴즈 · 기억하니?) — 폼에 필드가 있을 때만 반영
    if (fd.has("imageUrl")) c.imageUrl = str(fd, "imageUrl");
    if (fd.has("imageUrl2")) c.imageUrl2 = str(fd, "imageUrl2");
    if (fd.has("imageUrl3")) c.imageUrl3 = str(fd, "imageUrl3");
    // 파일 업로드(흑백요리사 등)가 있으면 우선 적용
    if (image) c.imageUrl = image;
    if (audio) c.audioUrl = audio;
    if (bool(fd, "removeImage")) c.imageUrl = "";
    if (bool(fd, "removeAudio")) c.audioUrl = "";
  });
  revalidatePath(`/admin/games/${gameId}`);
}

export async function deleteContentAction(fd: FormData) {
  await requireAuth();
  const contentId = str(fd, "contentId");
  const gameId = str(fd, "gameId");
  await mutateDB((db) => {
    db.contents = db.contents.filter((c) => c.contentId !== contentId);
  });
  revalidatePath(`/admin/games/${gameId}`);
}

/* ───────── 선물증정 ───────── */

export async function addGiftAction(fd: FormData) {
  await requireAuth();
  const image = await saveUpload(fd.get("image"), "image");
  await mutateDB((db) => {
    const maxOrder = db.gifts.reduce((m, g) => Math.max(m, g.sortOrder), 0);
    db.gifts.push({
      giftId: uid("gift"),
      giftName: str(fd, "giftName") || "선물",
      giftImageUrl: image || "",
      providerName: str(fd, "providerName"),
      receiverName: "",
      isAssigned: false,
      sortOrder: maxOrder + 1,
    });
  });
  revalidatePath("/admin/gifts");
}

export async function updateGiftAction(fd: FormData) {
  await requireAuth();
  const giftId = str(fd, "giftId");
  const image = await saveUpload(fd.get("image"), "image");
  await mutateDB((db) => {
    const g = db.gifts.find((x) => x.giftId === giftId);
    if (!g) return;
    g.giftName = str(fd, "giftName") || g.giftName;
    g.providerName = str(fd, "providerName");
    if (image) g.giftImageUrl = image;
    if (bool(fd, "removeImage")) g.giftImageUrl = "";
  });
  revalidatePath("/admin/gifts");
  revalidatePath("/");
}

export async function deleteGiftAction(fd: FormData) {
  await requireAuth();
  const giftId = str(fd, "giftId");
  await mutateDB((db) => {
    db.gifts = db.gifts.filter((g) => g.giftId !== giftId);
  });
  revalidatePath("/admin/gifts");
}

export async function addParticipantsAction(fd: FormData) {
  await requireAuth();
  const raw = str(fd, "names");
  const names = raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  await mutateDB((db) => {
    for (const name of names) {
      db.giftParticipants.push({ id: uid("p"), name });
    }
  });
  revalidatePath("/admin/gifts");
}

export async function deleteParticipantAction(fd: FormData) {
  await requireAuth();
  const id = str(fd, "id");
  await mutateDB((db) => {
    db.giftParticipants = db.giftParticipants.filter((p) => p.id !== id);
  });
  revalidatePath("/admin/gifts");
}

/* ───────── 기상미션 ───────── */

export async function addMissionAction(fd: FormData) {
  await requireAuth();
  await mutateDB((db) => {
    const maxOrder = db.missions.reduce((m, x) => Math.max(m, x.sortOrder), 0);
    db.missions.push({
      missionId: uid("m"),
      participantName: str(fd, "participantName") || "참가자",
      missionText: str(fd, "missionText"),
      isPublic: bool(fd, "isPublic"),
      isCompleted: false,
      sortOrder: maxOrder + 1,
    });
  });
  revalidatePath("/admin/missions");
}

export async function updateMissionAction(fd: FormData) {
  await requireAuth();
  const missionId = str(fd, "missionId");
  await mutateDB((db) => {
    const m = db.missions.find((x) => x.missionId === missionId);
    if (!m) return;
    m.participantName = str(fd, "participantName") || m.participantName;
    m.missionText = str(fd, "missionText");
    m.isPublic = bool(fd, "isPublic");
  });
  revalidatePath("/admin/missions");
  revalidatePath("/");
}

export async function deleteMissionAction(fd: FormData) {
  await requireAuth();
  const missionId = str(fd, "missionId");
  await mutateDB((db) => {
    db.missions = db.missions.filter((m) => m.missionId !== missionId);
  });
  revalidatePath("/admin/missions");
}

/* ───────── 오늘의 상품 ───────── */

export async function addProductAction(fd: FormData) {
  await requireAuth();
  const image = await saveUpload(fd.get("image"), "image");
  await mutateDB((db) => {
    const maxOrder = db.products.reduce((m, p) => Math.max(m, p.sortOrder), 0);
    db.products.push({
      productId: uid("pr"),
      name: str(fd, "name") || "상품",
      imageUrl: image || "",
      sortOrder: maxOrder + 1,
    });
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function deleteProductAction(fd: FormData) {
  await requireAuth();
  const productId = str(fd, "productId");
  await mutateDB((db) => {
    db.products = db.products.filter((p) => p.productId !== productId);
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

export async function moveProductAction(fd: FormData) {
  await requireAuth();
  const productId = str(fd, "productId");
  const dir = str(fd, "dir");
  await mutateDB((db) => {
    const sorted = [...db.products].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((p) => p.productId === productId);
    if (idx < 0) return;
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const tmp = sorted[idx].sortOrder;
    sorted[idx].sortOrder = sorted[swapWith].sortOrder;
    sorted[swapWith].sortOrder = tmp;
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

/* ───────── 초기화 ───────── */

export async function resetAllAction() {
  await requireAuth();
  await resetDB();
  revalidateAll();
  redirect("/admin");
}
