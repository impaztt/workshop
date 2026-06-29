import Link from "next/link";
import { readDB } from "@/lib/db";
import { GAME_TYPE_LABELS } from "@/lib/seed";
import { GAME_VISUAL } from "@/lib/visual";
import { moveGameAction, toggleGameAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function GamesListPage() {
  const db = await readDB();
  const games = [...db.games].sort((a, b) => a.sortOrder - b.sortOrder);
  const count = (id: string) => db.contents.filter((c) => c.gameId === id).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">게임 목록 관리</h1>
          <p className="mt-1 text-sm text-white/50">
            순서 변경, 노출/숨김, 게임별 콘텐츠를 관리합니다
          </p>
        </div>
        <Link href="/admin/games/new" className="ctrl-btn ctrl-btn-gold">
          + 새 게임 추가
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {games.map((g, i) => {
          const visual = GAME_VISUAL[g.gameType];
          return (
            <div
              key={g.gameId}
              className="glass flex items-center gap-4 rounded-2xl p-4"
            >
              {/* 순서 이동 */}
              <div className="flex flex-col gap-1">
                <form action={moveGameAction}>
                  <input type="hidden" name="gameId" value={g.gameId} />
                  <input type="hidden" name="dir" value="up" />
                  <button
                    className="grid h-6 w-6 place-items-center rounded bg-white/5 text-white/60 hover:bg-white/15 disabled:opacity-30"
                    disabled={i === 0}
                  >
                    ▲
                  </button>
                </form>
                <form action={moveGameAction}>
                  <input type="hidden" name="gameId" value={g.gameId} />
                  <input type="hidden" name="dir" value="down" />
                  <button
                    className="grid h-6 w-6 place-items-center rounded bg-white/5 text-white/60 hover:bg-white/15 disabled:opacity-30"
                    disabled={i === games.length - 1}
                  >
                    ▼
                  </button>
                </form>
              </div>

              {/* 썸네일 */}
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                {g.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={g.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div
                    className={`grid h-full w-full place-items-center bg-gradient-to-br ${visual.gradient} text-2xl`}
                  >
                    {visual.icon}
                  </div>
                )}
              </div>

              {/* 정보 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white/30">{i + 1}.</span>
                  <h3 className="truncate text-lg font-bold">{g.title}</h3>
                  {!g.isActive && (
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                      숨김
                    </span>
                  )}
                </div>
                <p className="truncate text-sm text-white/45">
                  {GAME_TYPE_LABELS[g.gameType]} ·{" "}
                  {g.gameType === "gift"
                    ? `${db.gifts.length}선물 / ${db.giftParticipants.length}명`
                    : `콘텐츠 ${count(g.gameId)}개`}
                </p>
              </div>

              {/* 액션 */}
              <div className="flex shrink-0 items-center gap-2">
                <form action={toggleGameAction}>
                  <input type="hidden" name="gameId" value={g.gameId} />
                  <button
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      g.isActive
                        ? "bg-success/15 text-success hover:bg-success/25"
                        : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                  >
                    {g.isActive ? "노출 중" : "숨김"}
                  </button>
                </form>
                {g.gameType === "gift" ? (
                  <Link href="/admin/gifts" className="rounded-lg bg-violet/20 px-3 py-2 text-sm font-medium text-violet hover:bg-violet/30">
                    선물 관리
                  </Link>
                ) : (
                  <Link
                    href={`/admin/games/${g.gameId}`}
                    className="rounded-lg bg-violet/20 px-3 py-2 text-sm font-medium text-violet hover:bg-violet/30"
                  >
                    콘텐츠 관리
                  </Link>
                )}
                <Link
                  href={`/admin/games/${g.gameId}/edit`}
                  className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/70 hover:bg-white/15"
                >
                  수정
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
