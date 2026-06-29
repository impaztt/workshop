import { notFound, redirect } from "next/navigation";
import { getGame, getActiveContents } from "@/lib/data";
import { readDB } from "@/lib/db";
import { PLAYABLE_TYPES } from "@/lib/types";
import { BalanceGame } from "@/components/games/BalanceGame";
import { ImageQuiz } from "@/components/games/ImageQuiz";
import { MusicQuiz } from "@/components/games/MusicQuiz";
import { GiftDraw } from "@/components/games/GiftDraw";

export const dynamic = "force-dynamic";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) notFound();
  if (!PLAYABLE_TYPES.includes(game.gameType)) redirect(`/game/${id}`);

  if (game.gameType === "gift") {
    const db = await readDB();
    if (db.gifts.length === 0 || db.giftParticipants.length === 0) {
      redirect(`/game/${id}`);
    }
    return (
      <GiftDraw
        title={game.title}
        gifts={db.gifts}
        participants={db.giftParticipants}
      />
    );
  }

  const contents = await getActiveContents(id);
  if (contents.length === 0) redirect(`/game/${id}`);

  switch (game.gameType) {
    case "balance":
      return (
        <BalanceGame
          title={game.title}
          defaultTimeLimit={game.defaultTimeLimit}
          contents={contents}
        />
      );
    case "image":
      return (
        <ImageQuiz
          title={game.title}
          defaultTimeLimit={game.defaultTimeLimit}
          contents={contents}
        />
      );
    case "music":
      return (
        <MusicQuiz
          title={game.title}
          defaultTimeLimit={game.defaultTimeLimit}
          contents={contents}
        />
      );
    default:
      redirect(`/game/${id}`);
  }
}
