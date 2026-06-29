"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Countdown {
  remaining: number; // 남은 초 (소수)
  total: number;
  running: boolean;
  finished: boolean;
  start: () => void;
  pause: () => void;
  reset: (seconds?: number) => void;
  setTotal: (seconds: number) => void;
}

export function useCountdown(
  initialSeconds: number,
  onFinish?: () => void,
): Countdown {
  const [total, setTotalState] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;

  const stopRaf = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const tick = useCallback((t: number) => {
    const dt = (t - lastRef.current) / 1000;
    lastRef.current = t;
    setRemaining((prev) => {
      const next = prev - dt;
      if (next <= 0) {
        setRunning(false);
        finishRef.current?.();
        return 0;
      }
      return next;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running && remaining > 0) {
      lastRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
      return stopRaf;
    }
    stopRaf();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, tick]);

  const start = useCallback(() => {
    setRemaining((r) => (r <= 0 ? total : r));
    setRunning(true);
  }, [total]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(
    (seconds?: number) => {
      setRunning(false);
      const s = seconds ?? total;
      setRemaining(s);
    },
    [total],
  );

  const setTotal = useCallback((seconds: number) => {
    setTotalState(seconds);
    setRunning(false);
    setRemaining(seconds);
  }, []);

  return {
    remaining,
    total,
    running,
    finished: remaining <= 0 && total > 0,
    start,
    pause,
    reset,
    setTotal,
  };
}
