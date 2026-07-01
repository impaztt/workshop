"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GameContent } from "@/lib/types";
import { PlayShell } from "@/components/common/PlayShell";
import { TimerRing } from "@/components/common/TimerRing";
import { useCountdown } from "@/components/common/useCountdown";
import { Feedback, type FeedbackStatus } from "@/components/common/Feedback";
import { GameEnd } from "@/components/common/GameEnd";

const ACCENT = "#f0a6d8";
const SOUND_COUNT = 11; // 주제당 초성 개수
const CONSONANTS = ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

// 주제에 지정된 초성(있으면)을 우선 쓰고, 모자라면 무작위로 11개를 채운다.
function buildSounds(custom: string): string[] {
  const list = custom
    .split(/[\n,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const result = list.slice(0, SOUND_COUNT);
  while (result.length < SOUND_COUNT) {
    let c = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    // 바로 직전과 같은 초성은 가급적 피함
    if (result.length > 0 && result[result.length - 1] === c) {
      c = CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)];
    }
    result.push(c);
  }
  return result;
}

export function ChainGame({
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
  // 2단계: 초성 진행
  const [sounds, setSounds] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [passCount, setPassCount] = useState(0);
  const [status, setStatus] = useState<FeedbackStatus>(null);
  const [ended, setEnded] = useState(false);

  const topic = topicIdx !== null ? contents[topicIdx] : null;
  const seconds = topic && topic.timeLimit > 0 ? topic.timeLimit : defaultTimeLimit || 3;

  const cd = useCountdown(seconds);
  // 초성이 바뀌면 타이머 초기화 (다음 초성으로 넘어온 경우 자동 시작)
  const key = useMemo(() => `${topicIdx}-${index}`, [topicIdx, index]);
  const prevKey = useRef(key);
  const autoStart = useRef(false);
  useEffect(() => {
    if (prevKey.current !== key) {
      prevKey.current = key;
      cd.setTotal(seconds);
      if (autoStart.current) {
        autoStart.current = false;
        cd.start();
      }
    }
  }, [key, seconds, cd]);

  const startTopic = (i: number) => {
    setTopicIdx(i);
    setSounds(buildSounds(contents[i].options));
    setIndex(0);
    setPassCount(0);
    setEnded(false);
    cd.setTotal(contents[i].timeLimit > 0 ? contents[i].timeLimit : defaultTimeLimit || 3);
  };
  const backToTopics = () => {
    setTopicIdx(null);
    setEnded(false);
  };

  const flash = (s: FeedbackStatus) => {
    setStatus(s);
    setTimeout(() => setStatus(null), 1000);
  };
  const success = () => {
    setPassCount((c) => c + 1);
    flash("success");
    cd.reset(seconds);
    cd.start();
  };
  const fail = () => {
    flash("fail");
    cd.pause();
  };
  const next = () => {
    if (index + 1 >= sounds.length) setEnded(true);
    else {
      autoStart.current = true; // 다음 초성으로 넘어가면 3초 카운트 자동 시작
      setIndex((i) => i + 1);
    }
  };
  const prev = () => {
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
            <p className="mt-2 text-white/50">선택한 주제로 초성 {SOUND_COUNT}개가 진행됩니다</p>
          </div>
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
            {contents.map((c, i) => (
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
                <span className="text-3xl">💬</span>
                <span className="text-2xl font-black text-white">{c.keyword || `주제 ${i + 1}`}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </PlayShell>
    );
  }

  /* ───── 종료 화면 ───── */
  if (ended) {
    return (
      <PlayShell title={title} accent={ACCENT} controls={null}>
        <GameEnd
          title="라운드 종료!"
          subtitle={`「${topic!.keyword}」 · 초성 ${sounds.length}개 진행 · 통과 ${passCount}회`}
          onRestart={backToTopics}
        />
      </PlayShell>
    );
  }

  /* ───── 2단계: 초성 진행 화면 ───── */
  return (
    <PlayShell
      title={title}
      accent={ACCENT}
      progress={{ current: index + 1, total: sounds.length }}
      controls={
        <>
          <button className="ctrl-btn ctrl-btn-gold" onClick={cd.start} disabled={cd.running}>▶ 시작</button>
          <button className="ctrl-btn" onClick={cd.pause} disabled={!cd.running}>⏸ 정지</button>
          <button className="ctrl-btn" onClick={() => cd.reset(seconds)}>⟳ 초기화</button>
          <button className="ctrl-btn ctrl-btn-success" onClick={success}>○ 성공 (다음 사람)</button>
          <button className="ctrl-btn ctrl-btn-danger" onClick={fail}>✕ 탈락</button>
          <button className="ctrl-btn" onClick={prev} disabled={index === 0}>← 이전</button>
          <button className="ctrl-btn" onClick={next}>{index + 1 >= sounds.length ? "결과 →" : "다음 초성 →"}</button>
          <button className="ctrl-btn" onClick={backToTopics}>주제 선택</button>
        </>
      }
    >
      <Feedback status={status} successText="통과!" failText="탈락!" />
      <div className="flex w-full max-w-5xl flex-col items-center gap-6">
        {/* 주제 */}
        <div className="glass rounded-2xl px-8 py-3 text-center">
          <span className="text-sm font-bold tracking-widest text-white/40">주제</span>
          <p className="text-3xl font-extrabold text-white">{topic!.keyword || "주제"}</p>
        </div>

        {/* 초성 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="font-black leading-none"
            style={{ fontSize: "12rem", color: ACCENT, textShadow: `0 0 60px ${ACCENT}88` }}
          >
            {sounds[index]}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-10">
          <TimerRing cd={cd} size={150} />
          <div className="text-center">
            <p className="text-sm text-white/40">통과한 사람</p>
            <p className="text-6xl font-black tabular-nums" style={{ color: ACCENT }}>{passCount}</p>
          </div>
        </div>

        {/* 예시 정답 (진행자 참고) */}
        {topic!.hint && (
          <p className="text-sm text-white/35">예시: {topic!.hint}</p>
        )}
      </div>
    </PlayShell>
  );
}
