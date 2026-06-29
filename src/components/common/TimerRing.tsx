"use client";

import type { Countdown } from "./useCountdown";

// 원형 게이지 + 큰 숫자 카운트다운 (대형 화면용 72px+)
export function TimerRing({
  cd,
  size = 220,
}: {
  cd: Countdown;
  size?: number;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ratio = cd.total > 0 ? Math.max(0, Math.min(1, cd.remaining / cd.total)) : 0;
  const danger = cd.remaining <= 3 && cd.total > 0;
  const color = danger ? "#f87171" : "#f5c451";
  const display = Math.ceil(cd.remaining);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          style={{
            transition: "stroke-dashoffset 0.1s linear, stroke 0.3s",
            filter: `drop-shadow(0 0 12px ${color}99)`,
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className={`font-black tabular-nums leading-none ${danger ? "animate-pulse" : ""}`}
          style={{ fontSize: size * 0.34, color }}
        >
          {display}
        </span>
        <span className="mt-1 text-sm font-medium tracking-widest text-white/40">초</span>
      </div>
    </div>
  );
}
