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

// 이미지 3개 중 정답 1개를 고르는 게임 ("기억하니?")
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
  const answer = parseInt(current.answer, 10); // 정답 보기 번호 (1~3)
  const images = [current.imageUrl, current.imageUrl2, current.imageUrl3];

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

        {/* 이미지 3개 보기 */}
        <div className="grid w-full grid-cols-3 gap-6">
          {images.map((url, i) => {
            const n = i + 1;
            const isAnswer = reveal && n === answer;
            const isWrongPick = reveal && selected === n && n !== answer;
            const isSelected = selected === n;
            return (
              <motion.button
                key={`${current.contentId}-${n}`}
                onClick={() => pick(n)}
                whileHover={reveal ? {} : { y: -6, scale: 1.02 }}
                animate={isAnswer ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="glass relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/5 p-4 transition"
                style={{
                  boxShadow: isAnswer
                    ? "inset 0 0 0 4px #34d399, 0 0 40px -4px #34d399"
                    : isWrongPick
                      ? "inset 0 0 0 4px #f87171"
                      : isSelected
                        ? `inset 0 0 0 4px ${ACCENT}`
                        : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  opacity: reveal && !isAnswer ? 0.45 : 1,
                }}
              >
                {/* 번호 배지 */}
                <div
                  className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl text-lg font-black text-ink"
                  style={{ backgroundColor: isAnswer ? "#34d399" : ACCENT }}
                >
                  {n}
                </div>
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt={`보기 ${n}`} className="max-h-full max-w-full object-contain" />
                ) : (
                  <span className="text-center text-sm text-white/40">
                    이미지 미등록
                    <br />
                    (보기 {n})
                  </span>
                )}
                {/* 정답 배지 */}
                {isAnswer && (
                  <div className="absolute bottom-3 right-3 rounded-full bg-success px-3 py-1 text-sm font-bold text-ink">
                    정답
                  </div>
                )}
              </motion.button>
            );
          })}
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
          <AnimatePresence>
            {reveal && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-strong rounded-2xl px-8 py-5 text-center"
                style={{ boxShadow: "inset 0 0 0 2px #34d39955" }}
              >
                <p className="text-sm font-bold text-gold">정답</p>
                <p className="text-4xl font-black text-white">{answer || "-"}번</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PlayShell>
  );
}
