import Link from "next/link";
import { readDB } from "@/lib/db";
import { addMissionAction, deleteMissionAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function MissionsAdminPage() {
  const db = await readDB();
  const missions = [...db.missions].sort((a, b) => a.sortOrder - b.sortOrder);
  const missionGame = db.games.find((g) => g.gameType === "mission");

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">기상미션 관리</h1>
          <p className="mt-1 text-sm text-white/50">
            참가자별 미션을 등록하면 기상미션 게임을 진행할 수 있습니다
          </p>
        </div>
        {missionGame && missions.length > 0 && (
          <Link href={`/game/${missionGame.gameId}/play`} className="ctrl-btn ctrl-btn-gold">
            미션 화면 열기 →
          </Link>
        )}
      </div>

      <div className="glass mb-6 rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">미션 추가</h2>
        <form action={addMissionAction} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input name="participantName" required placeholder="참가자 이름" className="admin-input" />
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" name="isPublic" defaultChecked className="h-5 w-5 accent-[#fbbf24]" />
              전체 공개 (체크 해제 시 본인만 확인)
            </label>
          </div>
          <textarea name="missionText" required rows={2} placeholder="미션 내용 (예: 아침에 제일 먼저 단체사진 찍기)" className="admin-input" />
          <button className="ctrl-btn ctrl-btn-gold self-start">+ 미션 추가</button>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        {missions.map((m) => (
          <div key={m.missionId} className="glass flex items-center gap-4 rounded-xl p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-warn/20 text-warn">🌅</div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white">
                {m.participantName}
                {!m.isPublic && <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">비공개</span>}
              </p>
              <p className="truncate text-sm text-white/50">{m.missionText}</p>
            </div>
            <form action={deleteMissionAction}>
              <input type="hidden" name="missionId" value={m.missionId} />
              <button className="text-sm text-danger/70 hover:text-danger">삭제</button>
            </form>
          </div>
        ))}
        {missions.length === 0 && (
          <p className="glass rounded-2xl p-8 text-center text-white/40">등록된 미션이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
