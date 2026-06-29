import Link from "next/link";
import { readDB } from "@/lib/db";
import { GAME_TYPE_LABELS } from "@/lib/seed";
import { ConfirmResetButton } from "@/components/admin/ConfirmButton";
import { resetAllAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const db = await readDB();
  const games = [...db.games].sort((a, b) => a.sortOrder - b.sortOrder);
  const active = games.filter((g) => g.isActive).length;
  const inactive = games.length - active;

  const contentCount = (gameId: string) =>
    db.contents.filter((c) => c.gameId === gameId).length;

  const imageCount =
    db.contents.filter((c) => c.imageUrl).length +
    db.games.filter((g) => g.thumbnailUrl).length +
    db.gifts.filter((g) => g.giftImageUrl).length;
  const audioCount = db.contents.filter((c) => c.audioUrl).length;

  const lastUpdated = games
    .map((g) => g.updatedAt)
    .sort()
    .reverse()[0];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">대시보드</h1>
          <p className="mt-1 text-sm text-white/50">{db.meta.mainTitle}</p>
        </div>
        <Link href="/admin/games" className="ctrl-btn ctrl-btn-gold">
          게임 목록 관리 →
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="전체 게임" value={games.length} accent="#a78bfa" />
        <Stat label="활성 게임" value={active} accent="#34d399" />
        <Stat label="비활성 게임" value={inactive} accent="#fbbf24" />
        <Stat label="미디어 파일" value={imageCount + audioCount} accent="#7dd3fc" />
      </div>

      {/* 콘텐츠 현황 */}
      <div className="mt-8 glass rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">게임별 콘텐츠 현황</h2>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">게임명</th>
                <th className="px-4 py-3 text-left font-medium">유형</th>
                <th className="px-4 py-3 text-center font-medium">콘텐츠</th>
                <th className="px-4 py-3 text-center font-medium">상태</th>
                <th className="px-4 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {games.map((g, i) => (
                <tr key={g.gameId} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white/40">{i + 1}</td>
                  <td className="px-4 py-3 font-semibold">{g.title}</td>
                  <td className="px-4 py-3 text-white/60">
                    {GAME_TYPE_LABELS[g.gameType]}
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">
                    {g.gameType === "gift"
                      ? `${db.gifts.length}선물/${db.giftParticipants.length}명`
                      : `${contentCount(g.gameId)}개`}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {g.isActive ? (
                      <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs text-success">
                        활성
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/50">
                        숨김
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/games/${g.gameId}`}
                      className="text-violet hover:underline"
                    >
                      관리
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-white/35">
          최근 수정일: {lastUpdated ? new Date(lastUpdated).toLocaleString("ko-KR") : "-"} ·
          이미지 {imageCount}개 · 오디오 {audioCount}개
        </p>
      </div>

      {/* 초기화 */}
      <div className="mt-8 glass rounded-2xl border border-danger/20 p-6">
        <h2 className="text-lg font-bold text-danger">진행 상태 초기화</h2>
        <p className="mt-1 text-sm text-white/50">
          모든 게임·콘텐츠·선물 데이터를 기본 12종 시드 상태로 되돌립니다. 등록한 콘텐츠는 사라집니다.
        </p>
        <form action={resetAllAction} className="mt-4">
          <ConfirmResetButton />
        </form>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-white/50">{label}</p>
      <p className="mt-2 text-4xl font-black tabular-nums" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
