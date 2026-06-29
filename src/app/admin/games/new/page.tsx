import Link from "next/link";
import { GameForm } from "@/components/admin/GameForm";
import { createGameAction } from "../../actions";

export default function NewGamePage() {
  return (
    <div>
      <Link href="/admin/games" className="text-sm text-white/50 hover:text-white">
        ← 게임 목록
      </Link>
      <h1 className="mb-6 mt-2 text-3xl font-black">새 게임 추가</h1>
      <div className="glass rounded-2xl p-6">
        <GameForm action={createGameAction} />
      </div>
    </div>
  );
}
