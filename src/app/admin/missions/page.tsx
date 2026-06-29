import Link from "next/link";
import { readDB } from "@/lib/db";
import {
  addMissionAction,
  updateMissionAction,
  deleteMissionAction,
} from "../actions";

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

      <div className="flex flex-col gap-3">
        {missions.map((m, i) => (
          <div key={m.missionId} className="glass rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-warn/20 text-warn">🌅</div>
              <span className="text-sm font-bold text-violet">{i + 1}번 미션</span>
            </div>

            <form action={updateMissionAction} className="flex flex-col gap-3">
              <input type="hidden" name="missionId" value={m.missionId} />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="admin-label">참가자 이름</label>
                  <input name="participantName" defaultValue={m.participantName} className="admin-input" />
                </div>
                <label className="flex items-center gap-2 self-end pb-2 text-sm text-white/70">
                  <input type="checkbox" name="isPublic" defaultChecked={m.isPublic} className="h-5 w-5 accent-[#fbbf24]" />
                  전체 공개 (체크 해제 시 본인만 확인)
                </label>
              </div>
              <div>
                <label className="admin-label">미션 내용</label>
                <textarea name="missionText" defaultValue={m.missionText} rows={2} className="admin-input" />
              </div>
              <div className="flex items-center gap-3 border-t border-white/10 pt-3">
                <button type="submit" className="ctrl-btn ctrl-btn-success">저장</button>
              </div>
            </form>

            <form action={deleteMissionAction} className="mt-2">
              <input type="hidden" name="missionId" value={m.missionId} />
              <button className="text-sm text-danger/70 hover:text-danger">이 미션 삭제</button>
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
