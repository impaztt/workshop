"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#5eead4";

export function DrawGame({
  title,
  defaultTimeLimit,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(1);
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const people = current.count > 0 ? current.count : 4;
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit || 5;

  const cd = useCountdown(seconds);
  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setTurn(1);
      setReveal(false);
      cd.setTotal(seconds);
    }
  }, [current.contentId, seconds, cd]);

  const nextPerson = () => {
    setTurn((t) => Math.min(t + 1, people));
    cd.reset(seconds);
    cd.start();
  };
  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1100);
  };
  const nextRound = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };
  const prevRound = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd
          title="이어그리기 종료!"
          subtitle={`총 ${contents.length}개의 제시어를 진행했습니다`}
          onRestart={() => {
            setIndex(0);
            setTurn(1);
            setEnded(false);
          }}
        />
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
          <button className="ctrl-btn ctrl-btn-gold" onClick={cd.start} disabled={cd.running}>
            ▶ 시작
          </button>
          <button className="ctrl-btn" onClick={cd.pause} disabled={!cd.running}>
            ⏸ 정지
          </button>
          <button className="ctrl-btn" onClick={nextPerson} disabled={turn >= people}>
            다음 사람 ({turn}/{people})
          </button>
          <button className="ctrl-btn" onClick={() => setReveal((r) => !r)}>
            {reveal ? "제시어 가리기" : "👁 제시어"}
          </button>
          <button className="ctrl-btn ctrl-btn-success" onClick={() => { flash("success"); }}>
            ○ 정답
          </button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={() => flash("fail")}>
            ✕ 실패
          </button>
          <button className="ctrl-btn" onClick={prevRound} disabled={index === 0}>
            ← 이전
          </button>
          <button className="ctrl-btn" onClick={nextRound}>
            {index + 1 >= contents.length ? "결과 →" : "다음 제시어 →"}
          </button>
        </>
      }
    >
      <Feedback status={status} successText="정답!" failText="아쉬워요!" />
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        {/* 주제 (힌트) — 카운트다운 위 제목 */}
        {current.hint && (
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-white/40">주제</p>
            <h2 className="text-5xl font-black gold-text md:text-6xl">{current.hint}</h2>
          </div>
        )}

        {/* 현재 차례 */}
        <div className="flex items-center gap-3">
          {Array.from({ length: people }).map((_, i) => (
            <div
              key={i}
              className={`grid h-12 w-12 place-items-center rounded-full text-lg font-black transition ${
                i + 1 === turn
                  ? "scale-110 text-ink"
                  : i + 1 < turn
                    ? "text-white/30"
                    : "text-white/50"
              }`}
              style={{
                background: i + 1 === turn ? ACCENT : "rgba(255,255,255,0.06)",
                boxShadow: i + 1 === turn ? `0 0 24px ${ACCENT}` : undefined,
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <p className="text-xl text-white/60">
          <b style={{ color: ACCENT }}>{turn}번째</b> 참가자 차례
        </p>

        {/* 타이머 */}
        <TimerRing cd={cd} size={200} />

        {/* 제시어 (진행자 전용) */}
        <div className="min-h-[88px]">
          <AnimatePresence>
            {reveal ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-strong rounded-2xl px-10 py-5 text-center"
                style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}55` }}
              >
                <p className="text-sm font-bold" style={{ color: ACCENT }}>
                  제시어 (진행자 전용)
                </p>
                <p className="text-4xl font-black text-white">{current.keyword}</p>
              </motion.div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/15 px-10 py-5 text-center text-white/40">
                제시어는 진행자만 확인 (👁 제시어 버튼)
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PlayShell>
  );
}
