"use server";

import { revalidatePath } from "next/cache";
import { mutateDB } from "@/lib/db";

// 메인 게임 선택 화면에서 '이미 진행함' 완료 상태를 껐다 켰다 한다.
// (행사 진행자용 토글 — 인증 없이 동작, 카드 위치는 그대로 두고 회색으로만 표시)
export async function toggleGameCompletedAction(fd: FormData) {
  const gameId = typeof fd.get("gameId") === "string" ? String(fd.get("gameId")) : "";
  if (!gameId) return;
  await mutateDB((db) => {
    const g = db.games.find((x) => x.gameId === gameId);
    if (g) g.isCompleted = !g.isCompleted;
  });
  revalidatePath("/");
}
