"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#6ee7b7";

interface Record {
  label: string;
  seconds: number | null; // null = 실패
}

export function HideGame({
  title,
  defaultTimeLimit,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<Record[]>([]);
  const [ended, setEnded] = useState(false);
  const current = contents[index];
  const seconds = current.timeLimit > 0 ? current.timeLimit : defaultTimeLimit || 120;
  const label = current.question || `라운드 ${index + 1}`;

  const cd = useCountdown(seconds);
  const prevId = useRef(current.contentId);
  useEffect(() => {
    if (prevId.current !== current.contentId) {
      prevId.current = current.contentId;
      cd.setTotal(seconds);
    }
  }, [current.contentId, seconds, cd]);

  const advance = (rec: Record) => {
    const newRecords = [...records, rec];
    setRecords(newRecords);
    if (index + 1 >= contents.length) setEnded(true);
    else setIndex((i) => i + 1);
  };
  const found = () => {
    cd.pause();
    advance({ label, seconds: Math.round(seconds - cd.remaining) });
  };
  const failRound = () => {
    cd.pause();
    advance({ label, seconds: null });
  };
  const prevRound = () => {
    if (index > 0) {
      setRecords((r) => r.slice(0, -1));
      setIndex((i) => i - 1);
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (ended) {
    const best = records
      .filter((r) => r.seconds !== null)
      .sort((a, b) => (a.seconds as number) - (b.seconds as number))[0];
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <div className="flex w-full max-w-2xl flex-col items-center">
          <GameEnd
            title="숨바꼭질 종료!"
            subtitle={best ? `최단 기록: ${best.label} (${fmt(best.seconds as number)})` : "기록 없음"}
          />
          <div className="z-10 mt-6 w-full glass rounded-2xl p-6">
            {records.map((r, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 py-3 last:border-0">
                <span className="text-white/70">{r.label}</span>
                <span className="text-xl font-bold" style={{ color: r.seconds === null ? "#f87171" : ACCENT }}>
                  {r.seconds === null ? "실패" : fmt(r.seconds)}
                </span>
              </div>
            ))}
          </div>
        </div>
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
          <button className="ctrl-btn" onClick={prevRound} disabled={index === 0}>← 이전</button>
          <button className="ctrl-btn ctrl-btn-success" onClick={found}>✓ 찾았다! (기록)</button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={failRound}>✕ 못 찾음</button>
        </>
      }
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-8">
        <motion.div
          key={current.contentId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl px-10 py-4 text-center"
        >
          <span className="text-sm font-bold tracking-widest text-white/40">현재 라운드</span>
          <p className="text-3xl font-extrabold text-white">{label}</p>
        </motion.div>

        <TimerRing cd={cd} size={260} />

        {current.hint && (
          <div className="glass rounded-2xl px-8 py-4 text-center text-lg text-warn">
            ⚠ {current.hint}
          </div>
        )}

        {records.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {records.map((r, i) => (
              <span key={i} className="rounded-full bg-white/5 px-4 py-1.5 text-sm">
                {r.label}: <b style={{ color: r.seconds === null ? "#f87171" : ACCENT }}>{r.seconds === null ? "실패" : fmt(r.seconds)}</b>
              </span>
            ))}
          </div>
        )}
      </div>
    </PlayShell>
  );
}
