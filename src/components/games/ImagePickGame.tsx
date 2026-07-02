"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#7dd3fc";

// 퀴즈 이미지를 보고 정답을 맞춘 뒤, 정답도 이미지로 공개하는 게임 ("기억하니?")
export function ImagePickGame({
  title,
  defaultTimeLimit,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [ended, setEnded] = useState(false);

  const current = contents[index];
  // 기본 제한시간 10초 (게임/콘텐츠 설정이 있으면 우선)
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit || 10;
  const quizImage = current.imageUrl; // 퀴즈 이미지
  const answerImage = current.imageUrl2; // 정답 이미지
  const answer = parseInt(current.answer, 10); // 정답 보기 번호 (1~2)

  const cd = useCountdown(seconds);
  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setSelected(null);
      setReveal(false);
      setStatus(null);
      cd.setTotal(seconds);
    }
  }, [current.contentId, seconds, cd]);

  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1100);
  };

  const pick = (n: number) => {
    if (reveal) return;
    setSelected(n);
  };

  const doReveal = () => {
    setReveal(true);
    cd.pause();
    if (selected !== null) flash(selected === answer ? "success" : "fail");
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
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd
          title="종료!"
          subtitle={`총 ${contents.length}문제를 진행했습니다`}
          onRestart={() => {
            setIndex(0);
            setEnded(false);
            setSelected(null);
            setReveal(false);
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
          <button className="ctrl-btn" onClick={() => cd.reset(seconds)}>
            ⟳ 초기화
          </button>
          <button className="ctrl-btn" onClick={() => (reveal ? setReveal(false) : doReveal())}>
            {reveal ? "정답 가리기" : "👁 정답 공개"}
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
      <Feedback status={status} successText="정답!" failText="오답!" />
      <div className="flex w-full max-w-6xl flex-col items-center gap-8">
        {/* 문제 */}
        {current.question && (
          <h2 className="text-center text-4xl font-black text-white">{current.question}</h2>
        )}

        {/* 퀴즈 이미지 + 정답 이미지 */}
        <div className="flex w-full items-center justify-center gap-8">
          {/* 퀴즈 + 보기 선택 */}
          <div className="flex flex-col items-center gap-3">
            <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-bold text-white/80">
              퀴즈
            </span>
            <div className="glass flex aspect-square w-[min(46vh,480px)] items-center justify-center overflow-hidden rounded-[2rem] bg-white/5 p-6">
              {quizImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={quizImage} alt="퀴즈" className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-center text-xl text-white/40">
                  퀴즈 이미지 미등록
                  <br />
                  (관리자페이지에서 등록)
                </span>
              )}
            </div>
            {/* 보기 1번 / 2번 선택 */}
            <div className="grid w-full grid-cols-2 gap-4">
              {[1, 2].map((n) => {
                const isAnswer = reveal && n === answer;
                const isWrongPick = reveal && selected === n && n !== answer;
                const isSelected = selected === n;
                return (
                  <motion.button
                    key={`${current.contentId}-opt-${n}`}
                    onClick={() => pick(n)}
                    whileHover={reveal ? {} : { y: -4, scale: 1.03 }}
                    animate={isAnswer ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.4 }}
                    className="glass relative rounded-2xl px-6 py-5 text-2xl font-black text-white transition"
                    style={{
                      boxShadow: isAnswer
                        ? "inset 0 0 0 4px #34d399, 0 0 30px -4px #34d399"
                        : isWrongPick
                          ? "inset 0 0 0 4px #f87171"
                          : isSelected
                            ? `inset 0 0 0 4px ${ACCENT}`
                            : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                      opacity: reveal && !isAnswer ? 0.45 : 1,
                    }}
                  >
                    {n}번
                    {isAnswer && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-success px-3 py-1 text-sm font-bold text-ink">
                        정답
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 정답 (공개 시) */}
          <AnimatePresence>
            {reveal && (
              <motion.div
                initial={{ opacity: 0, x: 24, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 24, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-3"
              >
                <span className="rounded-full bg-success px-4 py-1 text-sm font-bold text-ink">
                  정답
                </span>
                <div
                  className="glass-strong flex aspect-square w-[min(46vh,480px)] items-center justify-center overflow-hidden rounded-[2rem] bg-white/5 p-6"
                  style={{ boxShadow: "inset 0 0 0 3px #34d39955, 0 0 40px -4px #34d399" }}
                >
                  {answerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={answerImage}
                      alt="정답"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-xl text-white/40">
                      정답 이미지 미등록
                      <br />
                      (관리자페이지에서 등록)
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 타이머 + 힌트 */}
        <div className="flex items-center gap-10">
          <TimerRing cd={cd} size={140} />
          {current.hint && (
            <div className="glass rounded-2xl px-6 py-4 text-center">
              <p className="text-sm font-bold text-violet">힌트</p>
              <p className="text-xl text-white/85">{current.hint}</p>
            </div>
          )}
        </div>
      </div>
    </PlayShell>
  );
}
