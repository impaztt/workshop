import Link from "next/link";
import { notFound } from "next/navigation";
import { getGame } from "@/lib/data";
import { GameForm } from "@/components/admin/GameForm";
import { ConfirmSubmit } from "@/components/admin/ConfirmButton";
import { updateGameAction, deleteGameAction } from "../../../actions";

export const dynamic = "force-dynamic";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();

  return (
    <div>
      <Link href="/admin/games" className="text-sm text-white/50 hover:text-white">
        ← 게임 목록
      </Link>
      <h1 className="mb-6 mt-2 text-3xl font-black">게임 수정 · {game.title}</h1>

      <div className="glass rounded-2xl p-6">
        <GameForm game={game} action={updateGameAction} />
      </div>

      <div className="mt-6 glass rounded-2xl border border-danger/20 p-6">
        <h2 className="text-lg font-bold text-danger">게임 삭제</h2>
        <p className="mt-1 text-sm text-white/50">
          이 게임과 등록된 모든 콘텐츠가 영구 삭제됩니다.
        </p>
        <form action={deleteGameAction} className="mt-4">
          <input type="hidden" name="gameId" value={game.gameId} />
          <ConfirmSubmit label="게임 삭제" confirmLabel="한 번 더 클릭하면 삭제됩니다" />
        </form>
      </div>
    </div>
  );
}
