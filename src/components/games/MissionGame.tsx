"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Mission } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#fbbf24";

type Result = "success" | "fail" | null;

export function MissionGame({
  title,
  missions,
}: {
  title: string;
  missions: Mission[];
}) {
  const ordered = [...missions].sort((a, b) => a.sortOrder - b.sortOrder);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, Result>>({});
  const [ended, setEnded] = useState(false);

  const toggle = (id: string) =>
    setRevealed((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const mark = (id: string, r: Result) =>
    setResults((prev) => ({ ...prev, [id]: prev[id] === r ? null : r }));

  const successCount = Object.values(results).filter((r) => r === "success").length;

  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <div className="flex w-full max-w-2xl flex-col items-center">
          <GameEnd title="기상미션 결과 발표!" subtitle={`성공 ${successCount} / ${ordered.length}명`} />
          <div className="z-10 mt-6 w-full glass rounded-2xl p-6">
            {ordered.map((m) => (
              <div key={m.missionId} className="flex items-center justify-between border-b border-white/10 py-3 last:border-0">
                <div>
                  <span className="font-bold text-white">{m.participantName}</span>
                  <span className="ml-3 text-sm text-white/50">{m.missionText}</span>
                </div>
                <span className="text-lg font-bold" style={{ color: results[m.missionId] === "success" ? "#34d399" : results[m.missionId] === "fail" ? "#f87171" : "#9ca3af" }}>
                  {results[m.missionId] === "success" ? "성공" : results[m.missionId] === "fail" ? "실패" : "미정"}
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
      controls={
        <>
          <button className="ctrl-btn" onClick={() => setRevealed(new Set(ordered.map((m) => m.missionId)))}>전체 공개</button>
          <button className="ctrl-btn" onClick={() => setRevealed(new Set())}>전체 가리기</button>
          <button className="ctrl-btn ctrl-btn-gold" onClick={() => setEnded(true)}>결과 발표 →</button>
        </>
      }
    >
      <div className="flex w-full max-w-6xl flex-col items-center gap-6">
        <p className="text-2xl font-bold text-gold-soft">🌅 아침까지 미션을 완수하세요!</p>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {ordered.map((m) => {
            const open = revealed.has(m.missionId);
            const res = results[m.missionId];
            return (
              <motion.div
                key={m.missionId}
                layout
                className="glass-strong flex min-h-[180px] flex-col rounded-2xl p-5"
                style={{
                  boxShadow:
                    res === "success"
                      ? "inset 0 0 0 2px #34d39988"
                      : res === "fail"
                        ? "inset 0 0 0 2px #f8717188"
                        : undefined,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-lg font-black text-white">{m.participantName}</span>
                  {res && (
                    <span className="text-sm font-bold" style={{ color: res === "success" ? "#34d399" : "#f87171" }}>
                      {res === "success" ? "성공" : "실패"}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggle(m.missionId)}
                  className="flex flex-1 items-center justify-center rounded-xl bg-black/20 px-3 py-4 text-center text-sm transition hover:bg-black/30"
                >
                  {open ? (
                    <span className="text-white/90">{m.missionText}</span>
                  ) : (
                    <span className="text-white/40">🔒 미션 확인 (클릭)</span>
                  )}
                </button>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => mark(m.missionId, "success")} className="flex-1 rounded-lg bg-success/15 py-2 text-sm font-bold text-success hover:bg-success/25">성공</button>
                  <button onClick={() => mark(m.missionId, "fail")} className="flex-1 rounded-lg bg-danger/15 py-2 text-sm font-bold text-danger hover:bg-danger/25">실패</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PlayShell>
  );
}
