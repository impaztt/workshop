"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#f5c451";

export function TasteGame({
  title,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const current = contents[index];

  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setReveal(false);
      setWinner(null);
    }
  }, [current.contentId]);

  const win = (team: string) => {
    setWinner(team);
    setReveal(true);
    setStatus("success");
    setTimeout(() => setStatus(null), 1200);
  };
  const fail = () => {
    setStatus("fail");
    setTimeout(() => setStatus(null), 1000);
  };
  const next = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd title="흑백요리사 종료!" subtitle={`총 ${contents.length}라운드 대결`} onRestart={() => { setIndex(0); setEnded(false); }} />
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
          <button className="ctrl-btn ctrl-btn-success" onClick={() => win("A팀")}>A팀 정답</button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={fail}>✕ 오답</button>
          <button className="ctrl-btn" style={{ background: "rgba(125,211,252,0.18)" }} onClick={() => win("B팀")}>B팀 정답</button>
          <button className="ctrl-btn" onClick={() => setReveal((r) => !r)}>{reveal ? "정답 가리기" : "👁 정답 보기"}</button>
          <button className="ctrl-btn" onClick={next}>{index + 1 >= contents.length ? "결과 →" : "다음 →"}</button>
        </>
      }
    >
      <Feedback status={status} successText={winner ? `${winner} 정답!` : "정답!"} failText="땡! 상대팀 기회" />
      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        {/* 대결 구도 */}
        <div className="flex items-center gap-6 text-3xl font-black">
          <span className="text-mint">A팀</span>
          <span className="text-white/30">VS</span>
          <span className="text-[#7dd3fc]">B팀</span>
        </div>

        {/* 미스터리 스낵 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.contentId}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-strong flex aspect-square w-[min(46vh,420px)] flex-col items-center justify-center gap-4 rounded-[2rem] p-8"
            style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}44` }}
          >
            {reveal ? (
              <>
                {current.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={current.imageUrl} alt="" className="max-h-[55%] object-contain" />
                ) : (
                  <span className="text-7xl">🍪</span>
                )}
                <p className="text-sm font-bold" style={{ color: ACCENT }}>정답</p>
                <p className="text-5xl font-black text-white">{current.answer}</p>
              </>
            ) : (
              <>
                <span className="text-8xl">❓</span>
                <p className="text-3xl font-black text-white/80">Mystery Snack #{index + 1}</p>
                {current.hint && <p className="text-lg text-white/50">힌트: {current.hint}</p>}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </PlayShell>
  );
}
