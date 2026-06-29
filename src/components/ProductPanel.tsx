"use client";

import { motion } from "framer-motion";
import type { Product } from "@/lib/types";

export function ProductPanel({ products }: { products: Product[] }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass flex max-h-[calc(100vh-220px)] w-full flex-col overflow-hidden rounded-3xl lg:w-80"
    >
      {/* 헤더 */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
        <span className="text-2xl">🎁</span>
        <div>
          <h2 className="text-xl font-extrabold gold-text">오늘의 상품</h2>
          <p className="text-xs text-white/40">Today&apos;s Prizes</p>
        </div>
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
              transition={{ delay: 0.3 + i * 0.07 }}
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
  );
}
