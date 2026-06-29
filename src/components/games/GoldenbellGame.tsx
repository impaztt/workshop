"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#f5c451";

export function GoldenbellGame({
  title,
  defaultTimeLimit,
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
  const useTimer = defaultTimeLimit > 0 || current.timeLimit > 0;
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit;
  const options = current.options
    ? current.options.split(/\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const cd = useCountdown(seconds || 0);
  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setReveal(false);
      if (useTimer) cd.setTotal(seconds);
    }
  }, [current.contentId, useTimer, seconds, cd]);

  const next = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd title="도전골든벨 종료!" subtitle={`총 ${contents.length}문제 · 최후의 1인은?`} onRestart={() => { setIndex(0); setEnded(false); }} />
      </PlayShell>
    );
  }

  const isOX = current.questionType === "ox";

  return (
    <PlayShell
      title={title}
      accent={ACCENT}
      progress={{ current: index + 1, total: contents.length }}
      controls={
        <>
          {useTimer && (
            <>
              <button className="ctrl-btn ctrl-btn-gold" onClick={cd.start} disabled={cd.running}>▶ 시작</button>
              <button className="ctrl-btn" onClick={cd.pause} disabled={!cd.running}>⏸ 정지</button>
              <button className="ctrl-btn" onClick={() => cd.reset(seconds)}>⟳ 초기화</button>
            </>
          )}
          <button className="ctrl-btn ctrl-btn-success" onClick={() => setReveal((r) => !r)}>
            {reveal ? "정답 가리기" : "정답 공개"}
          </button>
          <button className="ctrl-btn" onClick={next}>{index + 1 >= contents.length ? "결과 →" : "다음 문제 →"}</button>
        </>
      }
    >
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        {/* 문제 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.contentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-3xl px-12 py-8 text-center"
          >
            <span className="text-lg font-bold" style={{ color: ACCENT }}>Q{index + 1}</span>
            <p className="mt-2 text-4xl font-black leading-snug text-white md:text-5xl">{current.question}</p>
          </motion.div>
        </AnimatePresence>

        {useTimer && <TimerRing cd={cd} size={160} />}

        {/* 보기 */}
        {isOX ? (
          <div className="flex gap-8">
            {["O", "X"].map((sym) => {
              const correct = reveal && current.answer.toUpperCase() === sym;
              return (
                <div
                  key={sym}
                  className="glass-strong grid h-40 w-40 place-items-center rounded-[2rem] text-7xl font-black transition"
                  style={{
                    color: sym === "O" ? "#5eead4" : "#fb7185",
                    boxShadow: correct ? `inset 0 0 0 3px ${ACCENT}, 0 0 40px ${ACCENT}` : undefined,
                  }}
                >
                  {sym}
                </div>
              );
            })}
          </div>
        ) : options.length > 0 ? (
          <div className="grid w-full max-w-3xl grid-cols-2 gap-4">
            {options.map((opt, i) => {
              const correct = reveal && opt === current.answer;
              return (
                <div
                  key={i}
                  className="glass-strong flex items-center gap-4 rounded-2xl px-6 py-5 text-2xl font-bold text-white transition"
                  style={{ boxShadow: correct ? `inset 0 0 0 2px ${ACCENT}, 0 0 30px ${ACCENT}66` : undefined }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-lg" style={{ color: correct ? ACCENT : "#fff" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* 정답 (주관식) */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-strong rounded-2xl px-10 py-5 text-center"
              style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}55` }}
            >
              <p className="text-sm font-bold" style={{ color: ACCENT }}>정답</p>
              <p className="text-4xl font-black text-white">{current.answer}</p>
              {current.hint && <p className="mt-1 text-base text-white/55">{current.hint}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PlayShell>
  );
}
