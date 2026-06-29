"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Gift, GiftParticipant } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { GameEnd } from "@/components/common/GameEnd";

interface Result {
  giftName: string;
  receiver: string;
}

export function GiftDraw({
  title,
  gifts,
  participants,
}: {
  title: string;
  gifts: Gift[];
  participants: GiftParticipant[];
}) {
  const ordered = [...gifts].sort((a, b) => a.sortOrder - b.sortOrder);
  const [giftIndex, setGiftIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [pool, setPool] = useState<GiftParticipant[]>(participants);
  const [spinning, setSpinning] = useState(false);
  const [display, setDisplay] = useState<string>("???");
  const [winner, setWinner] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentGift = ordered[giftIndex];

  const spin = () => {
    if (spinning) return;
    // 풀이 비었으면(중복 허용 상황) 전체 참가자로 재충전
    const activePool = pool.length > 0 ? pool : participants;
    setWinner(null);
    setSpinning(true);
    let ticks = 0;
    const totalTicks = 28; // 약 2.8초
    intervalRef.current = setInterval(() => {
      const rnd = activePool[Math.floor(Math.random() * activePool.length)];
      setDisplay(rnd.name);
      ticks += 1;
      if (ticks >= totalTicks) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const chosen = activePool[Math.floor(Math.random() * activePool.length)];
        setDisplay(chosen.name);
        setWinner(chosen.name);
        setSpinning(false);
        // 다음 확정 시 사용하기 위해 풀 상태 보관
        setPool(activePool);
      }
    }, 100);
  };

  const confirm = () => {
    if (!winner) return;
    const newResults = [...results, { giftName: currentGift.giftName, receiver: winner }];
    setResults(newResults);
    setPool((p) => p.filter((x) => x.name !== winner));
    setWinner(null);
    setDisplay("???");
    if (giftIndex + 1 >= ordered.length) {
      setEnded(true);
    } else {
      setGiftIndex((i) => i + 1);
    }
  };

  // 이전 선물로 되돌리기 — 마지막 추첨 결과 취소하고 당첨자를 풀에 복구
  const prev = () => {
    if (giftIndex === 0 || spinning) return;
    const last = results[results.length - 1];
    setResults((r) => r.slice(0, -1));
    if (last) {
      const p = participants.find((x) => x.name === last.receiver);
      if (p) setPool((pool) => [...pool, p]);
    }
    setGiftIndex((i) => i - 1);
    setWinner(null);
    setDisplay("???");
  };

  if (ended) {
    return (
      <PlayShell title={title} accent="#fb7185" controls={null}>
        <div className="flex w-full max-w-3xl flex-col items-center">
          <GameEnd title="선물 추첨 완료!" subtitle={`총 ${results.length}개의 선물이 전달되었습니다`} />
          <div className="z-10 mt-8 max-h-[40vh] w-full overflow-auto glass rounded-2xl p-6">
            {results.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-white/10 py-3 last:border-0"
              >
                <span className="text-lg text-white/70">🎁 {r.giftName}</span>
                <span className="text-xl font-bold text-gold">{r.receiver}</span>
              </div>
            ))}
          </div>
        </div>
      </PlayShell>
    );
  }

  return (
    <PlayShell
      title={title}
      accent="#fb7185"
      progress={{ current: giftIndex + 1, total: ordered.length }}
      controls={
        <>
          <button className="ctrl-btn" onClick={prev} disabled={giftIndex === 0 || spinning}>
            ← 이전
          </button>
          <button className="ctrl-btn ctrl-btn-gold" onClick={spin} disabled={spinning}>
            🎰 {winner ? "다시 추첨" : "추첨 시작"}
          </button>
          <button
            className="ctrl-btn ctrl-btn-success"
            onClick={confirm}
            disabled={!winner || spinning}
          >
            {giftIndex + 1 >= ordered.length ? "확정 & 결과 →" : "확정 & 다음 →"}
          </button>
        </>
      }
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-10">
        {/* 현재 선물 */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-semibold tracking-widest text-white/40">
            현재 선물
          </span>
          <div className="glass-strong flex items-center gap-4 rounded-2xl px-8 py-4">
            {currentGift.giftImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentGift.giftImageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
            ) : (
              <span className="text-4xl">🎁</span>
            )}
            <span className="text-3xl font-black text-white">{currentGift.giftName}</span>
          </div>
          {currentGift.providerName && (
            <span className="text-sm text-white/40">제공: {currentGift.providerName}</span>
          )}
        </div>

        {/* 슬롯 디스플레이 */}
        <div
          className="glass-strong relative grid h-48 w-full max-w-2xl place-items-center overflow-hidden rounded-[2rem]"
          style={{ boxShadow: winner ? "inset 0 0 0 3px #f5c451, 0 0 60px -10px #f5c451" : undefined }}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={display + (spinning ? Math.random() : winner)}
              initial={{ y: spinning ? 40 : 0, opacity: spinning ? 0 : 1 }}
              animate={{ y: 0, opacity: 1, scale: winner ? [1, 1.15, 1] : 1 }}
              transition={{ duration: spinning ? 0.1 : 0.4 }}
              className={`text-7xl font-black ${winner ? "gold-text" : "text-white"}`}
            >
              {display}
            </motion.span>
          </AnimatePresence>
          {winner && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-4 text-lg font-bold text-mint"
            >
              🎉 당첨!
            </motion.span>
          )}
        </div>

        <p className="text-sm text-white/40">
          남은 참가자 {pool.length > 0 ? pool.length : participants.length}명 · 추첨 후 확정하면 다음 선물로 이동합니다
        </p>
      </div>
    </PlayShell>
  );
}
