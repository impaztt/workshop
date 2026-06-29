"use client";

import { AnimatePresence, motion } from "framer-motion";

export type FeedbackStatus = "success" | "fail" | null;

// 정답(전체 화면 성공 효과) / 오답(붉은 플래시) 연출 오버레이
export function Feedback({
  status,
  successText = "정답!",
  failText = "오답!",
}: {
  status: FeedbackStatus;
  successText?: string;
  failText?: string;
}) {
  return (
    <AnimatePresence>
      {status && (
        <motion.div
          key={status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          style={{
            background:
              status === "success"
                ? "radial-gradient(circle at center, rgba(52,211,153,0.35), rgba(0,0,0,0.55))"
                : "radial-gradient(circle at center, rgba(248,113,113,0.3), rgba(0,0,0,0.55))",
          }}
        >
          <motion.div
            initial={{ scale: 0.4, rotate: status === "fail" ? -6 : 0 }}
            animate={{
              scale: 1,
              rotate: 0,
              ...(status === "fail" ? { x: [0, -16, 14, -8, 0] } : {}),
            }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="text-center"
          >
            <div
              className="text-[10rem] font-black leading-none"
              style={{
                color: status === "success" ? "#34d399" : "#f87171",
                textShadow: `0 0 60px ${status === "success" ? "#34d39988" : "#f8717188"}`,
              }}
            >
              {status === "success" ? "○" : "✕"}
            </div>
            <div className="mt-2 text-5xl font-black text-white">
              {status === "success" ? successText : failText}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
