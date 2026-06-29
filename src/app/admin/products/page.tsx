import { readDB } from "@/lib/db";
import {
  addProductAction,
  deleteProductAction,
  moveProductAction,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function ProductsAdminPage() {
  const db = await readDB();
  const products = [...db.products].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">오늘의 상품 관리</h1>
        <p className="mt-1 text-sm text-white/50">
          메인 화면 우측 “오늘의 상품” 패널에 표시되는 경품을 등록합니다
        </p>
      </div>

      <div className="glass mb-6 rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold">상품 추가</h2>
        <form action={addProductAction} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="admin-label">상품명 *</label>
              <input name="name" required placeholder="예: 블루투스 스피커" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">상품 이미지</label>
              <input type="file" name="image" accept="image/*" className="admin-input" />
            </div>
          </div>
          <button className="ctrl-btn ctrl-btn-gold self-start">+ 상품 추가</button>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        {products.map((p, i) => (
          <div key={p.productId} className="glass flex items-center gap-4 rounded-2xl p-3">
            {/* 순서 이동 */}
            <div className="flex flex-col gap-1">
              <form action={moveProductAction}>
                <input type="hidden" name="productId" value={p.productId} />
                <input type="hidden" name="dir" value="up" />
                <button className="grid h-6 w-6 place-items-center rounded bg-white/5 text-white/60 hover:bg-white/15 disabled:opacity-30" disabled={i === 0}>▲</button>
              </form>
              <form action={moveProductAction}>
                <input type="hidden" name="productId" value={p.productId} />
                <input type="hidden" name="dir" value="down" />
                <button className="grid h-6 w-6 place-items-center rounded bg-white/5 text-white/60 hover:bg-white/15 disabled:opacity-30" disabled={i === products.length - 1}>▼</button>
              </form>
            </div>

            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#6e1f3a] to-[#c0306a] text-2xl">🎁</div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold">{p.name}</p>
              <p className="text-xs text-white/40">{i + 1}번째 상품</p>
            </div>

            <form action={deleteProductAction}>
              <input type="hidden" name="productId" value={p.productId} />
              <button className="text-sm text-danger/70 hover:text-danger">삭제</button>
            </form>
          </div>
        ))}
        {products.length === 0 && (
          <p className="glass rounded-2xl p-8 text-center text-white/40">등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
