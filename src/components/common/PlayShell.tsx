"use client";

import { useRouter } from "next/navigation";

// 본게임 화면 공통 프레임: 상단(게임명·진행번호·종료), 본문, 하단 컨트롤 바
export function PlayShell({
  title,
  progress,
  children,
  controls,
  accent = "#f5c451",
}: {
  title: string;
  progress?: { current: number; total: number };
  children: React.ReactNode;
  controls: React.ReactNode;
  accent?: string;
}) {
  const router = useRouter();

  return (
    <main className="stage-bg flex min-h-screen flex-col">
      {/* 상단 바 */}
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          <span className="h-3 w-3 rounded-full" style={{ background: accent, boxShadow: `0 0 14px ${accent}` }} />
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        </div>
        {progress && (
          <div className="glass rounded-2xl px-6 py-2 text-2xl font-black tabular-nums">
            <span style={{ color: accent }}>{progress.current}</span>
            <span className="text-white/30"> / {progress.total}</span>
          </div>
        )}
        <button
          onClick={() => router.push("/")}
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 transition hover:bg-danger/20 hover:text-white"
        >
          종료
        </button>
      </header>

      {/* 본문 */}
      <section className="relative flex flex-1 items-center justify-center px-8 py-4">
        {children}
      </section>

      {/* 하단 컨트롤 바 */}
      <footer className="border-t border-white/10 bg-black/30 px-8 py-5 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3">
          {controls}
        </div>
      </footer>
    </main>
  );
}
