"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";

export function ProductPanel({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="lg:shrink-0">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.aside
            key="open"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="glass flex max-h-[calc(100vh-220px)] w-full flex-col overflow-hidden rounded-3xl lg:w-80"
          >
            {/* 헤더 + 접기 버튼 */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <div>
                  <h2 className="text-xl font-extrabold gold-text">오늘의 상품</h2>
                  <p className="text-xs text-white/40">Today&apos;s Prizes</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="상품 패널 접기"
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/5 text-lg text-white/60 transition hover:bg-white/15 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* 리스트 */}
            <div className="flex-1 space-y-2 overflow-y-auto p-3">
              {products.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-white/35">
                  등록된 상품이 없습니다.
                  <br />
                  관리자페이지에서 추가하세요.
                </p>
              ) : (
                products.map((p, i) => (
                  <motion.div
                    key={p.productId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 p-2.5 transition hover:bg-white/10"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white/5">
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#6e1f3a] to-[#c0306a] text-2xl">
                          🎁
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{p.name}</p>
                      <p className="text-xs text-gold-soft/70">경품 {i + 1}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.aside>
        ) : (
          /* 접힌 상태 — 클릭하면 펼침 */
          <motion.button
            key="closed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(true)}
            aria-label="오늘의 상품 펼치기"
            className="glass flex w-full items-center justify-center gap-3 rounded-3xl px-5 py-4 text-gold-soft transition hover:bg-white/10 lg:h-56 lg:w-14 lg:flex-col lg:px-0"
          >
            <span className="text-2xl">🎁</span>
            <span className="font-extrabold lg:[writing-mode:vertical-rl]">오늘의 상품</span>
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-gold">
              {products.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
