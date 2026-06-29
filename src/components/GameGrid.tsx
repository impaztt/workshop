"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { GameType } from "@/lib/types";
import { GAME_VISUAL } from "@/lib/visual";

export interface GameCardData {
  gameId: string;
  no: number;
  title: string;
  shortDescription: string;
  mood: string;
  gameType: GameType;
  thumbnailUrl: string;
  playable: boolean;
  contentCount: number;
}

export function GameGrid({ cards }: { cards: GameCardData[] }) {
  return (
    <div className="grid flex-1 grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.gameId}
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.45, ease: "easeOut" }}
        >
          <GameCard card={card} />
        </motion.div>
      ))}
    </div>
  );
}

function GameCard({ card }: { card: GameCardData }) {
  const visual = GAME_VISUAL[card.gameType];

  const inner = (
    <motion.div
      whileHover={card.playable ? { y: -8, scale: 1.03 } : {}}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`glass group relative flex h-full flex-col overflow-hidden rounded-3xl ${
        card.playable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
      }`}
    >
      {/* 대표 이미지 영역 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {card.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.thumbnailUrl}
            alt={card.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${visual.gradient}`}
          >
            <span className="text-6xl drop-shadow-lg transition duration-500 group-hover:scale-110">
              {visual.icon}
            </span>
          </div>
        )}
        {/* 게임 번호 배지 */}
        <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-xl bg-black/45 text-sm font-bold text-white backdrop-blur">
          {String(card.no).padStart(2, "0")}
        </div>
        {/* 상태 배지 */}
        {!card.playable && (
          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
            준비중
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-extrabold tracking-tight text-white">
            {card.title}
          </h3>
        </div>
        <p className="line-clamp-2 text-sm text-white/55">
          {card.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `${visual.accent}22`,
              color: visual.accent,
            }}
          >
            {card.mood}
          </span>
          {card.playable ? (
            <span className="text-sm font-bold text-gold opacity-0 transition group-hover:opacity-100">
              선택 →
            </span>
          ) : (
            <span className="text-xs text-white/35">콘텐츠 0개</span>
          )}
        </div>
      </div>

      {/* 선택 가능 카드 테두리 글로우 */}
      {card.playable && (
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 2px ${visual.accent}, 0 0 40px -6px ${visual.accent}` }}
        />
      )}
    </motion.div>
  );

  if (!card.playable) return inner;
  return (
    <Link href={`/game/${card.gameId}`} className="block h-full">
      {inner}
    </Link>
  );
}
