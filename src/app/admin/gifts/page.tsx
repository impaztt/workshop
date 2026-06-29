import Link from "next/link";
import { readDB } from "@/lib/db";
import {
  addGiftAction,
  deleteGiftAction,
  addParticipantsAction,
  deleteParticipantAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function GiftsAdminPage() {
  const db = await readDB();
  const gifts = [...db.gifts].sort((a, b) => a.sortOrder - b.sortOrder);
  const participants = db.giftParticipants;
  const giftGame = db.games.find((g) => g.gameType === "gift");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">선물증정 관리</h1>
          <p className="mt-1 text-sm text-white/50">
            선물과 참가자를 등록하면 랜덤 추첨 게임을 진행할 수 있습니다
          </p>
        </div>
        {giftGame && gifts.length > 0 && participants.length > 0 && (
          <Link href={`/game/${giftGame.gameId}/play`} className="ctrl-btn ctrl-btn-gold">
            추첨 화면 열기 →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 선물 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-bold">🎁 선물 ({gifts.length})</h2>
          <form action={addGiftAction} className="mb-5 flex flex-col gap-3">
            <input name="giftName" required placeholder="선물명 (예: 블루투스 스피커)" className="admin-input" />
            <input name="providerName" placeholder="제공자 (선택)" className="admin-input" />
            <input type="file" name="image" accept="image/*" className="admin-input" />
            <button className="ctrl-btn ctrl-btn-gold self-start">+ 선물 추가</button>
          </form>
          <div className="flex flex-col gap-2">
            {gifts.map((g) => (
              <div key={g.giftId} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                {g.giftImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.giftImageUrl} alt="" className="h-10 w-10 rounded object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded bg-white/5">🎁</span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{g.giftName}</p>
                  {g.providerName && <p className="truncate text-xs text-white/40">제공: {g.providerName}</p>}
                </div>
                <form action={deleteGiftAction}>
                  <input type="hidden" name="giftId" value={g.giftId} />
                  <button className="text-sm text-danger/70 hover:text-danger">삭제</button>
                </form>
              </div>
            ))}
            {gifts.length === 0 && <p className="text-sm text-white/40">등록된 선물이 없습니다.</p>}
          </div>
        </div>

        {/* 참가자 */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-bold">🙋 참가자 ({participants.length})</h2>
          <form action={addParticipantsAction} className="mb-5 flex flex-col gap-3">
            <textarea
              name="names"
              rows={4}
              placeholder={"이름을 줄바꿈 또는 쉼표로 구분해 입력\n예)\n김철수\n이영희, 박민수"}
              className="admin-input"
            />
            <button className="ctrl-btn ctrl-btn-gold self-start">+ 참가자 추가</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {participants.map((p) => (
              <form action={deleteParticipantAction} key={p.id}>
                <input type="hidden" name="id" value={p.id} />
                <button className="group flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-sm hover:bg-danger/20">
                  {p.name}
                  <span className="text-white/30 group-hover:text-danger">✕</span>
                </button>
              </form>
            ))}
            {participants.length === 0 && <p className="text-sm text-white/40">등록된 참가자가 없습니다.</p>}
          </div>
          {participants.length > 0 && (
            <p className="mt-4 text-xs text-white/35">
              참가자 칩을 클릭하면 삭제됩니다.
            </p>
          )}
        </div>
      </div>

      {(gifts.length === 0 || participants.length === 0) && (
        <p className="mt-6 text-sm text-warn">
          ⚠ 추첨을 시작하려면 선물과 참가자가 각각 1개 이상 필요합니다.
        </p>
      )}
    </div>
  );
}
