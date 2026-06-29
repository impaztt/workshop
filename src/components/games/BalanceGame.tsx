"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { GameEnd } from "@/components/common/GameEnd";

export function BalanceGame({
  title,
  defaultTimeLimit,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit || 10;

  const cd = useCountdown(seconds);
  // 문제 전환 시 타이머 초기화
  const reseed = useMemo(() => current.contentId, [current]);
  useMemoTimerReset(cd, seconds, reseed);

  const next = () => {
    if (index + 1 >= contents.length) {
      setEnded(true);
    } else {
      setIndex((i) => i + 1);
    }
  };

  if (ended) {
    return (
      <PlayShell title={title} accent="#a78bfa" controls={null}>
        <GameEnd
          title="밸런스 게임 종료!"
          subtitle="모든 질문을 진행했습니다"
          onRestart={() => {
            setIndex(0);
            setEnded(false);
            cd.reset(seconds);
          }}
        />
      </PlayShell>
    );
  }

  const oLabel = current.optionO || "O";
  const xLabel = current.optionX || "X";

  return (
    <PlayShell
      title={title}
      accent="#a78bfa"
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
          <button className="ctrl-btn ctrl-btn-success" onClick={next}>
            {index + 1 >= contents.length ? "결과 보기 →" : "다음 →"}
          </button>
        </>
      }
    >
      <div className="flex w-full max-w-6xl flex-col items-center">
        {/* 질문 */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={current.contentId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="mb-8 max-w-5xl text-center text-5xl font-black leading-snug md:text-6xl"
          >
            {current.question}
          </motion.h2>
        </AnimatePresence>

        {/* 타이머 */}
        <div className="mb-8">
          <TimerRing cd={cd} size={180} />
        </div>

        {/* O / X 카드 */}
        <div className="grid w-full max-w-5xl grid-cols-2 gap-6">
          <ChoiceCard symbol="O" color="#5eead4" label={oLabel} />
          <ChoiceCard symbol="X" color="#fb7185" label={xLabel} />
        </div>
      </div>
    </PlayShell>
  );
}

function ChoiceCard({
  symbol,
  color,
  label,
}: {
  symbol: string;
  color: string;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      className="glass-strong flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[2rem] p-8"
      style={{ boxShadow: `inset 0 0 0 2px ${color}55, 0 20px 50px -20px ${color}66` }}
    >
      <span className="text-8xl font-black" style={{ color }}>
        {symbol}
      </span>
      <span className="text-center text-3xl font-bold text-white">{label}</span>
    </motion.div>
  );
}

// 콘텐츠가 바뀔 때 타이머를 새 제한시간으로 리셋
import { useEffect, useRef } from "react";
import type { Countdown } from "@/components/common/useCountdown";
function useMemoTimerReset(cd: Countdown, seconds: number, key: string) {
  const prev = useRef(key);
  useEffect(() => {
    if (prev.current !== key) {
      prev.current = key;
      cd.setTotal(seconds);
    }
  }, [key, seconds, cd]);
}
