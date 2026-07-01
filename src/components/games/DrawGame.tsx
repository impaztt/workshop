"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#5eead4";

// 콘텐츠의 제시어 목록(options, 한 줄/쉼표 구분)을 배열로. 비어 있으면 keyword를 단일 제시어로.
function parseKeywords(c: GameContent): string[] {
  const list = (c.options || "")
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return list.length ? list : c.keyword ? [c.keyword] : [];
}

export function DrawGame({
  title,
  defaultTimeLimit,
  contents,
}: {
  title: string;
  defaultTimeLimit: number;
  contents: GameContent[];
}) {
  // 1단계: 주제 선택 (각 콘텐츠 = 하나의 주제)
  const [topicIdx, setTopicIdx] = useState<number | null>(null);
  // 2단계: 제시어 진행
  const [keywords, setKeywords] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState(1);
  const [reveal, setReveal] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [ended, setEnded] = useState(false);

  const topic = topicIdx !== null ? contents[topicIdx] : null;
  const people = topic && topic.count > 0 ? topic.count : 4;
  const seconds = topic && topic.timeLimit > 0 ? topic.timeLimit : defaultTimeLimit || 5;

  const cd = useCountdown(seconds);
  // 제시어가 바뀌면 차례·타이머 초기화
  const key = useMemo(() => `${topicIdx}-${index}`, [topicIdx, index]);
  const prevKey = useRef(key);
  useEffect(() => {
    if (prevKey.current !== key) {
      prevKey.current = key;
      setTurn(1);
      setReveal(false);
      cd.setTotal(seconds);
    }
  }, [key, seconds, cd]);

  const startTopic = (i: number) => {
    setTopicIdx(i);
    setKeywords(parseKeywords(contents[i]));
    setIndex(0);
    setTurn(1);
    setReveal(false);
    setEnded(false);
    cd.setTotal(contents[i].timeLimit > 0 ? contents[i].timeLimit : defaultTimeLimit || 5);
  };
  const backToTopics = () => {
    setTopicIdx(null);
    setEnded(false);
  };

  const nextPerson = () => {
    setTurn((t) => Math.min(t + 1, people));
    cd.reset(seconds);
    cd.start();
  };
  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1100);
  };
  const nextKeyword = () => {
    if (index + 1 >= keywords.length) setEnded(true);
    else setIndex((i) => i + 1);
  };
  const prevKeyword = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  /* ───── 1단계: 주제 선택 화면 ───── */
  if (topicIdx === null) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <div className="flex w-full max-w-5xl flex-col items-center gap-8">
          <div className="text-center">
            <p className="text-sm font-bold tracking-widest text-white/40">STEP 1</p>
            <h2 className="text-4xl font-black text-white md:text-5xl">주제를 선택하세요</h2>
            <p className="mt-2 text-white/50">선택한 주제 안의 제시어들이 순서대로 진행됩니다</p>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
            {contents.map((c, i) => {
              const count = parseKeywords(c).length;
              return (
                <motion.button
                  key={c.contentId}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  onClick={() => startTopic(i)}
                  className="glass-strong flex min-h-[130px] flex-col items-center justify-center gap-2 rounded-3xl p-6"
                  style={{ boxShadow: `inset 0 0 0 1px ${ACCENT}33` }}
                >
                  <span className="text-3xl">✏️</span>
                  <span className="text-2xl font-black text-white">{c.keyword || `주제 ${i + 1}`}</span>
                  <span className="text-sm text-white/45">제시어 {count}개</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </PlayShell>
    );
  }

  /* ───── 라운드 종료 화면 ───── */
  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd
          title="라운드 종료!"
          subtitle={`「${topic!.keyword}」 · 제시어 ${keywords.length}개 진행`}
          onRestart={backToTopics}
        />
      </PlayShell>
    );
  }

  /* ───── 2단계: 제시어 진행 화면 ───── */
  return (
    <PlayShell
      title={title}
      accent={ACCENT}
      progress={{ current: index + 1, total: keywords.length }}
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
          <button className="ctrl-btn ctrl-btn-success" onClick={() => flash("success")}>
            ○ 정답
          </button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={() => flash("fail")}>
            ✕ 실패
          </button>
          <button className="ctrl-btn" onClick={prevKeyword} disabled={index === 0}>
            ← 이전
          </button>
          <button className="ctrl-btn" onClick={nextKeyword}>
            {index + 1 >= keywords.length ? "결과 →" : "다음 제시어 →"}
          </button>
          <button className="ctrl-btn" onClick={backToTopics}>
            주제 선택
          </button>
        </>
      }
    >
      <Feedback status={status} successText="정답!" failText="아쉬워요!" />
      <div className="flex w-full max-w-5xl flex-col items-center gap-8">
        {/* 주제 — 카운트다운 위 제목 */}
        <div className="text-center">
          <p className="text-sm font-bold tracking-widest text-white/40">주제</p>
          <h2 className="text-5xl font-black gold-text md:text-6xl">{topic!.keyword || "주제"}</h2>
        </div>

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
          <AnimatePresence mode="wait">
            {reveal ? (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-strong rounded-2xl px-10 py-5 text-center"
                style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}55` }}
              >
                <p className="text-sm font-bold" style={{ color: ACCENT }}>
                  제시어 (진행자 전용)
                </p>
                <p className="text-4xl font-black text-white">{keywords[index]}</p>
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
