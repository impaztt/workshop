"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

export function MusicQuiz({
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
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const current = contents[index];

  useEffect(() => {
    setReveal(false);
    setStatus(null);
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [current.contentId]);

  const play = () => {
    audioRef.current?.play();
    setPlaying(true);
  };
  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };
  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaying(true);
    }
  };
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
      <PlayShell title={title} accent="#f0a6f0" controls={null}>
        <GameEnd
          title="음악퀴즈 종료!"
          subtitle={`총 ${contents.length}곡을 진행했습니다`}
          onRestart={() => {
            setIndex(0);
            setEnded(false);
          }}
        />
      </PlayShell>
    );
  }

  return (
    <PlayShell
      title={title}
      accent="#f0a6f0"
      progress={{ current: index + 1, total: contents.length }}
      controls={
        <>
          {playing ? (
            <button className="ctrl-btn ctrl-btn-gold" onClick={pause}>
              ⏸ 정지
            </button>
          ) : (
            <button className="ctrl-btn ctrl-btn-gold" onClick={play} disabled={!current.audioUrl}>
              ▶ 재생
            </button>
          )}
          <button className="ctrl-btn" onClick={restart} disabled={!current.audioUrl}>
            ⟳ 다시 듣기
          </button>
          <button className="ctrl-btn" onClick={() => setReveal((r) => !r)}>
            {reveal ? "정답 가리기" : "👁 정답 보기"}
          </button>
          <button className="ctrl-btn ctrl-btn-success" onClick={() => flash("success")}>
            ○ 정답
          </button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={() => flash("fail")}>
            ✕ 오답
          </button>
          <button className="ctrl-btn" onClick={next}>
            {index + 1 >= contents.length ? "결과 →" : "다음 →"}
          </button>
        </>
      }
    >
      <Feedback status={status} />
      {current.audioUrl && (
        <audio
          ref={audioRef}
          src={current.audioUrl}
          onEnded={() => setPlaying(false)}
          preload="auto"
        />
      )}

      <div className="flex w-full max-w-3xl flex-col items-center gap-10">
        {/* 음반 비주얼 */}
        <motion.div
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={playing ? { repeat: Infinity, duration: 4, ease: "linear" } : { duration: 0.3 }}
          className="relative grid h-72 w-72 place-items-center rounded-full bg-gradient-to-br from-[#4a1d52] to-[#9d2c8f] shadow-2xl"
          style={{ boxShadow: "0 0 80px -10px #9d2c8f" }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-black/60">
            <span className="text-5xl">🎵</span>
          </div>
          {playing && (
            <span className="absolute -bottom-2 rounded-full bg-black/60 px-4 py-1 text-sm font-semibold text-mint">
              재생 중...
            </span>
          )}
        </motion.div>

        {!current.audioUrl && (
          <p className="text-lg text-white/40">음원 미등록 (관리자페이지에서 등록)</p>
        )}

        {current.hint && (
          <div className="glass rounded-2xl px-8 py-4 text-center">
            <p className="text-sm font-bold text-violet">힌트</p>
            <p className="text-2xl text-white/85">{current.hint}</p>
          </div>
        )}

        <AnimatePresence>
          {reveal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass-strong rounded-2xl px-10 py-6 text-center"
              style={{ boxShadow: "inset 0 0 0 2px #f5c45155" }}
            >
              <p className="text-sm font-bold text-gold">정답</p>
              <p className="text-4xl font-black text-white">{current.answer}</p>
              {current.artist && (
                <p className="mt-1 text-xl text-white/60">{current.artist}</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PlayShell>
  );
}
