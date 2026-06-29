import { getMeta } from "@/lib/data";
import { updateMetaAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const meta = await getMeta();

  return (
    <div>
      <h1 className="text-3xl font-black">행사 설정</h1>
      <p className="mb-6 mt-1 text-sm text-white/50">
        메인 화면 상단과 타이틀에 표시되는 행사 정보를 설정합니다
      </p>

      <div className="glass max-w-2xl rounded-2xl p-6">
        <form action={updateMetaAction} className="flex flex-col gap-5">
          <div>
            <label className="admin-label">행사명 (상단 헤더)</label>
            <input name="eventName" defaultValue={meta.eventName} className="admin-input" placeholder="예: 2026 Workshop" />
          </div>
          <div>
            <label className="admin-label">행사 날짜</label>
            <input name="eventDate" defaultValue={meta.eventDate} className="admin-input" placeholder="예: 2026.06.30" />
          </div>
          <div>
            <label className="admin-label">메인 타이틀 (중앙 대형 문구)</label>
            <input name="mainTitle" defaultValue={meta.mainTitle} className="admin-input" placeholder="예: 2026 Workshop Game Night" />
          </div>
          <button type="submit" className="ctrl-btn ctrl-btn-gold self-start">
            저장
          </button>
        </form>
      </div>
    </div>
  );
}
