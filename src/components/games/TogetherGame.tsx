"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#c4b5fd";

export function TogetherGame({
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
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const answer = current.answer || "";
  const len = [...answer].length;

  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      setReveal(false);
    }
  }, [current.contentId]);

  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1100);
  };
  const next = () => {
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd title="같이 말해 종료!" subtitle={`총 ${contents.length}문제 진행`} onRestart={() => { setIndex(0); setEnded(false); }} />
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
          <button className="ctrl-btn" onClick={() => setReveal((r) => !r)}>{reveal ? "정답 가리기" : "👁 정답 보기"}</button>
          <button className="ctrl-btn ctrl-btn-success" onClick={() => { flash("success"); setReveal(true); }}>○ 정답</button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={() => flash("fail")}>✕ 오답</button>
          <button className="ctrl-btn" onClick={next}>{index + 1 >= contents.length ? "결과 →" : "다음 →"}</button>
        </>
      }
    >
      <Feedback status={status} />
      <div className="flex w-full max-w-4xl flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-2xl text-white/50">상대팀이 한 글자씩 동시에 외칩니다</p>
          <p className="mt-2 text-6xl font-black" style={{ color: ACCENT }}>{len > 0 ? `${len}글자 단어` : "단어 미등록"}</p>
        </div>

        {/* 글자 칸 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {Array.from({ length: Math.max(len, 1) }).map((_, i) => (
            <div
              key={i}
              className="glass-strong grid h-28 w-24 place-items-center rounded-2xl text-6xl font-black text-white"
              style={{ boxShadow: reveal ? `inset 0 0 0 2px ${ACCENT}66` : undefined }}
            >
              {reveal ? [...answer][i] : "?"}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {reveal && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-3xl font-black gold-text"
            >
              {answer}
            </motion.p>
          )}
        </AnimatePresence>

        {current.hint && !reveal && (
          <p className="text-lg text-white/45">힌트: {current.hint}</p>
        )}
      </div>
    </PlayShell>
  );
}
