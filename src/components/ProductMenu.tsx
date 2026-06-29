"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";

// 헤더의 '오늘의 상품' 버튼 + 팝업(드롭다운). 기본은 접힌 상태.
export function ProductMenu({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
          open
            ? "border-gold/50 bg-gold/15 text-gold"
            : "border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      >
        <span>🎁</span>
        <span>오늘의 상품</span>
        <span className="rounded-full bg-gold/25 px-1.5 py-0.5 text-xs font-bold text-gold">
          {products.length}
        </span>
        <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* 바깥 클릭 시 닫힘 */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="glass-strong absolute right-0 top-full z-50 mt-2 flex max-h-[70vh] w-[min(88vw,22rem)] flex-col overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎁</span>
                  <h2 className="text-lg font-extrabold gold-text">오늘의 상품</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/15 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {products.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-white/35">
                    등록된 상품이 없습니다.
                    <br />
                    관리자페이지에서 추가하세요.
                  </p>
                ) : (
                  products.map((p, i) => (
                    <div
                      key={p.productId}
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#6e1f3a] to-[#c0306a] text-xl">
                            🎁
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-white">{p.name}</p>
                        <p className="text-xs text-gold-soft/70">경품 {i + 1}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
