"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CONFETTI_COLORS = ["#f5c451", "#a78bfa", "#5eead4", "#fb7185", "#7dd3fc", "#fbbf24"];

function Confetti() {
  const pieces = Array.from({ length: 60 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const duration = 2.2 + Math.random() * 1.8;
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const size = 8 + Math.random() * 8;
        return (
          <motion.div
            key={i}
            initial={{ y: -40, opacity: 0, rotate: 0 }}
            animate={{ y: "110vh", opacity: [0, 1, 1, 0.8], rotate: 360 + Math.random() * 360 }}
            transition={{ delay, duration, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              left: `${left}%`,
              width: size,
              height: size * 0.5,
              background: color,
              borderRadius: 2,
            }}
          />
        );
      })}
    </div>
  );
}

// 게임 종료 화면 (라운드/게임 종료 공통)
export function GameEnd({
  title,
  subtitle,
  onRestart,
}: {
  title: string;
  subtitle?: string;
  onRestart?: () => void;
}) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <Confetti />
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="z-10 text-center"
      >
        <div className="text-7xl">🎉</div>
        <h2 className="mt-4 text-6xl font-black gold-text">{title}</h2>
        {subtitle && <p className="mt-3 text-2xl text-white/70">{subtitle}</p>}
        <div className="mt-10 flex items-center justify-center gap-4">
          {onRestart && (
            <button onClick={onRestart} className="ctrl-btn">
              처음부터 다시
            </button>
          )}
          <Link href="/" className="ctrl-btn ctrl-btn-gold">
            메인으로 →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
