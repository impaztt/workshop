import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame, getContentCount, isGamePlayable } from "@/lib/data";
import { GAME_VISUAL } from "@/lib/visual";
import { PLAYABLE_TYPES } from "@/lib/types";
import { DescriptionEnter } from "@/components/DescriptionEnter";

export const dynamic = "force-dynamic";

export default async function GameDescriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();

  const [count, playable] = await Promise.all([
    getContentCount(id),
    isGamePlayable(game),
  ]);
  const visual = GAME_VISUAL[game.gameType];
  const implemented = PLAYABLE_TYPES.includes(game.gameType);

  return (
    <main className="stage-bg">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] flex-col px-8 py-10">
        <Link
          href="/"
          className="self-start rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          ← 메인으로
        </Link>

        <DescriptionEnter>
          <div className="mt-8 grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* 대표 이미지 */}
            <div className="glass overflow-hidden rounded-[2rem]">
              <div className="relative aspect-[4/3] w-full">
                {game.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.thumbnailUrl}
                    alt={game.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${visual.gradient}`}
                  >
                    <span className="text-[9rem] drop-shadow-2xl">{visual.icon}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 설명 */}
            <div>
              <span
                className="inline-block rounded-full px-4 py-1.5 text-sm font-semibold"
                style={{ backgroundColor: `${visual.accent}22`, color: visual.accent }}
              >
                {game.mood}
              </span>
              <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight md:text-6xl">
                {game.title}
              </h1>
              <p className="mt-4 text-2xl font-medium text-gold-soft">
                {game.shortDescription}
              </p>

              <div className="mt-6 glass rounded-2xl p-6">
                <p className="mb-2 text-sm font-bold tracking-wider text-violet">
                  진행 방식
                </p>
                <p className="whitespace-pre-line text-lg leading-relaxed text-white/80">
                  {game.description}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/60">
                {game.gameType !== "gift" && game.gameType !== "mission" && (
                  <span className="rounded-lg bg-white/5 px-3 py-2">
                    등록 콘텐츠 <b className="text-white">{count}</b>개
                  </span>
                )}
                {game.defaultTimeLimit > 0 && (
                  <span className="rounded-lg bg-white/5 px-3 py-2">
                    제한시간 <b className="text-white">{game.defaultTimeLimit}</b>초
                  </span>
                )}
              </div>

              {/* 시작 버튼 */}
              <div className="mt-8 flex items-center gap-4">
                {playable && implemented ? (
                  <Link href={`/game/${game.gameId}/play`} className="ctrl-btn ctrl-btn-gold text-xl">
                    게임 시작 →
                  </Link>
                ) : (
                  <button className="ctrl-btn cursor-not-allowed opacity-50" disabled>
                    {implemented ? "콘텐츠 등록 필요" : "준비중 (2차 개발 예정)"}
                  </button>
                )}
                <Link href="/" className="ctrl-btn">
                  뒤로
                </Link>
              </div>
              {!implemented && (
                <p className="mt-3 text-sm text-white/40">
                  이 게임은 현재 설명 화면까지 제공되며, 본게임 화면은 다음 개발 단계에서 추가됩니다.
                </p>
              )}
            </div>
          </div>
        </DescriptionEnter>
      </div>
    </main>
  );
}
