"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#f0a6d8";

export function ChainGame({
  title,
  defaultTimeLimit,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit || 3;

  const cd = useCountdown(seconds);
  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setPassCount(0);
      setReveal(false);
      cd.setTotal(seconds);
    }
  }, [current.contentId, seconds, cd]);

  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1000);
  };
  const success = () => {
    setPassCount((c) => c + 1);
    flash("success");
    cd.reset(seconds);
    cd.start();
  };
  const fail = () => {
    flash("fail");
    cd.pause();
  };
  const nextRound = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd title="줄줄이 말해요 종료!" subtitle={`총 ${contents.length}라운드 진행`} onRestart={() => { setIndex(0); setEnded(false); }} />
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
          <button className="ctrl-btn ctrl-btn-gold" onClick={cd.start} disabled={cd.running}>▶ 시작</button>
          <button className="ctrl-btn" onClick={cd.pause} disabled={!cd.running}>⏸ 정지</button>
          <button className="ctrl-btn" onClick={() => cd.reset(seconds)}>⟳ 초기화</button>
          <button className="ctrl-btn ctrl-btn-success" onClick={success}>○ 성공 (다음 사람)</button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={fail}>✕ 탈락</button>
          <button className="ctrl-btn" onClick={nextRound}>{index + 1 >= contents.length ? "결과 →" : "다음 라운드 →"}</button>
        </>
      }
    >
      <Feedback status={status} successText="통과!" failText="탈락!" />
      <div className="flex w-full max-w-5xl flex-col items-center gap-6">
        {/* 주제 */}
        <div className="glass rounded-2xl px-8 py-3 text-center">
          <span className="text-sm font-bold tracking-widest text-white/40">주제</span>
          <p className="text-3xl font-extrabold text-white">{current.keyword || "주제 미등록"}</p>
        </div>

        {/* 초성 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.contentId}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="font-black leading-none"
            style={{ fontSize: "12rem", color: ACCENT, textShadow: `0 0 60px ${ACCENT}88` }}
          >
            {current.initialSound || "?"}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-10">
          <TimerRing cd={cd} size={150} />
          <div className="text-center">
            <p className="text-sm text-white/40">통과한 사람</p>
            <p className="text-6xl font-black tabular-nums" style={{ color: ACCENT }}>{passCount}</p>
          </div>
        </div>

        {/* 예시 정답 (진행자 참고) */}
        <div className="min-h-[44px]">
          {current.hint && (
            reveal ? (
              <button onClick={() => setReveal(false)} className="text-sm text-white/60 underline">
                예시: {current.hint} (가리기)
              </button>
            ) : (
              <button onClick={() => setReveal(true)} className="text-sm text-white/40 underline">
                예시 정답 보기 (진행자)
              </button>
            )
          )}
        </div>
      </div>
    </PlayShell>
  );
}
