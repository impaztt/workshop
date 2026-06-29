import Link from "next/link";
import type { Game } from "@/lib/types";
import { GAME_TYPE_LABELS } from "@/lib/seed";
import { PLAYABLE_TYPES } from "@/lib/types";

// 게임 기본정보 등록/수정 폼 (A-04). 서버 컴포넌트 — 서버 액션에 직접 제출.
export function GameForm({
  game,
  action,
}: {
  game?: Game;
  action: (fd: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {game && <input type="hidden" name="gameId" value={game.gameId} />}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="admin-label">게임명 *</label>
          <input
            name="title"
            required
            defaultValue={game?.title}
            className="admin-input"
            placeholder="예: 밸런스 게임"
          />
        </div>
        <div>
          <label className="admin-label">게임 유형 *</label>
          <select name="gameType" defaultValue={game?.gameType ?? "balance"} className="admin-input">
            {Object.entries(GAME_TYPE_LABELS).map(([type, label]) => (
              <option key={type} value={type}>
                {label}
                {PLAYABLE_TYPES.includes(type as Game["gameType"]) ? " (플레이 가능)" : " (설명만)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="admin-label">한 줄 설명 (카드 표시)</label>
        <input
          name="shortDescription"
          defaultValue={game?.shortDescription}
          className="admin-input"
          placeholder="예: 둘 중 하나만 골라야 한다면?"
        />
      </div>

      <div>
        <label className="admin-label">상세 설명 (설명 화면)</label>
        <textarea
          name="description"
          defaultValue={game?.description}
          rows={5}
          className="admin-input"
          placeholder="진행 방식, 제한시간, 승리 조건 등"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="admin-label">분위기 태그</label>
          <input
            name="mood"
            defaultValue={game?.mood}
            className="admin-input"
            placeholder="예: 순발력 · 웃음"
          />
        </div>
        <div>
          <label className="admin-label">기본 제한시간 (초, 0=미사용)</label>
          <input
            name="defaultTimeLimit"
            type="number"
            min={0}
            defaultValue={game?.defaultTimeLimit ?? 0}
            className="admin-input"
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-3 pb-2">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={game ? game.isActive : true}
              className="h-5 w-5 accent-[#a78bfa]"
            />
            <span className="text-sm font-medium text-white/80">메인 화면 노출</span>
          </label>
        </div>
      </div>

      {/* 대표 이미지 */}
      <div>
        <label className="admin-label">대표 이미지</label>
        {game?.thumbnailUrl && (
          <div className="mb-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={game.thumbnailUrl} alt="" className="h-16 w-24 rounded-lg object-cover" />
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input type="checkbox" name="removeThumbnail" className="accent-[#f87171]" />
              현재 이미지 삭제
            </label>
          </div>
        )}
        <input type="file" name="thumbnail" accept="image/*" className="admin-input" />
        <p className="mt-1 text-xs text-white/35">
          미등록 시 게임 유형별 기본 그라데이션이 표시됩니다. 고해상도 이미지를 권장합니다.
        </p>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button type="submit" className="ctrl-btn ctrl-btn-gold">
          {game ? "변경사항 저장" : "게임 추가"}
        </button>
        <Link href="/admin/games" className="ctrl-btn">
          취소
        </Link>
      </div>
    </form>
  );
}
