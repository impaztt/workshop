import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getGame, getContents } from "@/lib/data";
import { GAME_TYPE_LABELS } from "@/lib/seed";
import { ContentFields } from "@/components/admin/ContentFields";
import { ConfirmSubmit } from "@/components/admin/ConfirmButton";
import {
  createContentAction,
  updateContentAction,
  deleteContentAction,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function ContentManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();
  // 선물증정은 전용 페이지에서 관리
  if (game.gameType === "gift") redirect("/admin/gifts");

  const contents = await getContents(id);

  return (
    <div>
      <Link href="/admin/games" className="text-sm text-white/50 hover:text-white">
        ← 게임 목록
      </Link>
      <div className="mb-6 mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">{game.title}</h1>
          <p className="mt-1 text-sm text-white/50">
            {GAME_TYPE_LABELS[game.gameType]} · 콘텐츠 {contents.length}개
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/games/${id}/edit`} className="ctrl-btn">
            게임 정보 수정
          </Link>
          <form action={createContentAction}>
            <input type="hidden" name="gameId" value={id} />
            <button className="ctrl-btn ctrl-btn-gold">+ 콘텐츠 추가</button>
          </form>
        </div>
      </div>

      {contents.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-white/50">
          등록된 콘텐츠가 없습니다. 우측 상단의 “콘텐츠 추가”로 시작하세요.
        </div>
      )}

      <div className="flex flex-col gap-4">
        {contents.map((c, i) => (
          <div key={c.contentId} className="glass rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg bg-white/5 px-3 py-1 text-sm font-bold text-violet">
                {i + 1}번 콘텐츠
              </span>
              {!c.isActive && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                  숨김
                </span>
              )}
            </div>

            <form action={updateContentAction} className="flex flex-col gap-4">
              <input type="hidden" name="contentId" value={c.contentId} />
              <input type="hidden" name="gameId" value={id} />
              <ContentFields gameType={game.gameType} content={c} />
              <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                <button type="submit" className="ctrl-btn ctrl-btn-success">
                  저장
                </button>
              </div>
            </form>

            <form action={deleteContentAction} className="mt-3">
              <input type="hidden" name="contentId" value={c.contentId} />
              <input type="hidden" name="gameId" value={id} />
              <ConfirmSubmit
                label="이 콘텐츠 삭제"
                confirmLabel="한 번 더 클릭하면 삭제됩니다"
                className="text-sm text-danger/70 hover:text-danger"
              />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
