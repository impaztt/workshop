"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#a78bfa";

export function TruthGame({
  title,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const isTruth = current.answer.trim() === "진실" || current.answer.trim().toUpperCase() === "O";

  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setReveal(false);
    }
  }, [current.contentId]);

  const next = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd title="진실게임 종료!" subtitle={`총 ${contents.length}문제 진행`} onRestart={() => { setIndex(0); setEnded(false); }} />
      </PlayShell>
    );
  }

  return (
    <PlayShell
      title={title}
      accent={ACCENT}
      progress={{ current: index + 1, total: contents.length }}
      controls={
        <>
          <button className="ctrl-btn ctrl-btn-gold" onClick={() => setReveal(true)} disabled={reveal}>
            🎭 정답 공개
          </button>
          <button className="ctrl-btn" onClick={() => setReveal(false)} disabled={!reveal}>
            다시 가리기
          </button>
          <button className="ctrl-btn ctrl-btn-success" onClick={next}>
            {index + 1 >= contents.length ? "결과 →" : "다음 →"}
          </button>
        </>
      }
    >
      {/* 정답 공개 전체화면 연출 */}
      <AnimatePresence>
        {reveal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            style={{
              background: isTruth
                ? "radial-gradient(circle, rgba(52,211,153,0.32), rgba(0,0,0,0.6))"
                : "radial-gradient(circle, rgba(248,113,113,0.32), rgba(0,0,0,0.6))",
            }}
          >
            <motion.div
              initial={{ scale: 0.3, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 14 }}
              className="text-center"
            >
              <div
                className="text-[11rem] font-black leading-none"
                style={{ color: isTruth ? "#34d399" : "#f87171", textShadow: `0 0 70px ${isTruth ? "#34d399" : "#f87171"}` }}
              >
                {isTruth ? "진실" : "거짓"}
              </div>
              {current.hint && <p className="mt-4 text-2xl text-white/85">{current.hint}</p>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full max-w-4xl flex-col items-center gap-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.contentId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="glass rounded-3xl px-12 py-10 text-center"
          >
            <p className="text-sm font-bold tracking-widest" style={{ color: ACCENT }}>이것은 진실일까 거짓일까?</p>
            <p className="mt-4 text-4xl font-black leading-snug text-white md:text-5xl">“{current.question}”</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-8">
          <div className="glass-strong grid h-32 w-48 place-items-center rounded-3xl text-4xl font-black text-success">진실</div>
          <div className="glass-strong grid h-32 w-48 place-items-center rounded-3xl text-4xl font-black text-danger">거짓</div>
        </div>
      </div>
    </PlayShell>
  );
}
