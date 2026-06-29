import Link from "next/link";
import { getActiveGames, getMeta, isGamePlayable, getContentCount } from "@/lib/data";
import { readDB } from "@/lib/db";
import { GameGrid } from "@/components/GameGrid";
import { ProductMenu } from "@/components/ProductMenu";
import type { GameCardData } from "@/components/GameGrid";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  const [meta, games, db] = await Promise.all([getMeta(), getActiveGames(), readDB()]);
  const products = [...db.products].sort((a, b) => a.sortOrder - b.sortOrder);

  const cards: GameCardData[] = await Promise.all(
    games.map(async (g, idx) => ({
      gameId: g.gameId,
      no: idx + 1,
      title: g.title,
      shortDescription: g.shortDescription,
      mood: g.mood,
      gameType: g.gameType,
      thumbnailUrl: g.thumbnailUrl,
      playable: await isGamePlayable(g),
      contentCount: await getContentCount(g.gameId),
    })),
  );

  return (
    <main className="stage-bg">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-8 py-8">
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet to-mint text-2xl font-black text-ink shadow-lg">
              W
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-violet">
                {meta.eventName.toUpperCase()}
              </p>
              <p className="text-xs text-white/50">{meta.eventDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ProductMenu products={products} />
            <Link
              href="/admin"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              관리자
            </Link>
          </div>
        </header>

        {/* 메인 타이틀 */}
        <div className="mt-8 mb-10 text-center">
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            <span className="gold-text">{meta.mainTitle}</span>
          </h1>
          <p className="mt-3 text-lg text-white/55">
            진행할 게임을 선택하세요
          </p>
        </div>

        {/* 4×3 카드 그리드 */}
        <GameGrid cards={cards} />

        {/* 하단 안내 */}
        <footer className="mt-10 text-center text-sm text-white/35">
          카드를 클릭하면 게임 설명 화면으로 이동합니다 · 비활성 카드는 콘텐츠 등록이 필요합니다
        </footer>
      </div>
    </main>
  );
}
