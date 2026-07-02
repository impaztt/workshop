"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

export function ImageQuiz({
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
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const useTimer = defaultTimeLimit > 0 || current.timeLimit > 0;
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit;

  const cd = useCountdown(seconds || 0);
  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setReveal(false);
      setStatus(null);
      if (useTimer) cd.setTotal(seconds);
    }
  }, [current.contentId, useTimer, seconds, cd]);

  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1100);
  };

  const next = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };
  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent="#7dd3fc" controls={null}>
        <GameEnd
          title="이미지퀴즈 종료!"
          subtitle={`총 ${contents.length}문제를 진행했습니다`}
          onRestart={() => {
            setIndex(0);
            setEnded(false);
            setReveal(false);
          }}
        />
      </PlayShell>
    );
  }

  return (
    <PlayShell
      title={title}
      accent="#7dd3fc"
      progress={{ current: index + 1, total: contents.length }}
      controls={
        <>
          {useTimer && (
            <>
              <button className="ctrl-btn ctrl-btn-gold" onClick={cd.start} disabled={cd.running}>
                ▶ 시작
              </button>
              <button className="ctrl-btn" onClick={cd.pause} disabled={!cd.running}>
                ⏸ 정지
              </button>
              <button className="ctrl-btn" onClick={() => cd.reset(seconds)}>
                ⟳ 초기화
              </button>
            </>
          )}
          <button className="ctrl-btn" onClick={() => setReveal((r) => !r)}>
            {reveal ? "정답 가리기" : "👁 정답 보기"}
          </button>
          <button className="ctrl-btn ctrl-btn-success" onClick={() => flash("success")}>
            ○ 정답
          </button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={() => flash("fail")}>
            ✕ 오답
          </button>
          <button className="ctrl-btn" onClick={prev} disabled={index === 0}>
            ← 이전
          </button>
          <button className="ctrl-btn" onClick={next}>
            {index + 1 >= contents.length ? "결과 →" : "다음 →"}
          </button>
        </>
      }
    >
      <Feedback status={status} />
      <div className="flex w-full max-w-6xl items-center justify-center gap-10">
        {/* 이미지 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.contentId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35 }}
            className="glass flex aspect-square w-[min(52vh,560px)] items-center justify-center overflow-hidden rounded-[2rem] bg-white/5 p-6"
          >
            {current.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.imageUrl}
                alt="quiz"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-center text-xl text-white/40">
                이미지 미등록
                <br />
                (관리자페이지에서 등록)
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 우측 정보 */}
        <div className="flex w-[360px] flex-col items-center gap-6">
          {useTimer && <TimerRing cd={cd} size={190} />}
          {current.hint && (
            <div className="glass rounded-2xl px-6 py-4 text-center">
              <p className="text-sm font-bold text-violet">힌트</p>
              <p className="text-xl text-white/85">{current.hint}</p>
            </div>
          )}
          <AnimatePresence>
            {reveal && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-strong rounded-2xl px-8 py-5 text-center"
                style={{ boxShadow: "inset 0 0 0 2px #f5c45155" }}
              >
                <p className="text-sm font-bold text-gold">정답</p>
                <p className="text-4xl font-black text-white">{current.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PlayShell>
  );
}
