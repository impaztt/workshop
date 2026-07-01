import { notFound, redirect } from "next/navigation";
import { getGame, getActiveContents } from "@/lib/data";
import { readDB } from "@/lib/db";
import { PLAYABLE_TYPES } from "@/lib/types";
import { BalanceGame } from "@/components/games/BalanceGame";
import { ImageQuiz } from "@/components/games/ImageQuiz";
import { MusicQuiz } from "@/components/games/MusicQuiz";
import { GiftDraw } from "@/components/games/GiftDraw";
import { DrawGame } from "@/components/games/DrawGame";
import { ChainGame } from "@/components/games/ChainGame";
import { TasteGame } from "@/components/games/TasteGame";
import { TogetherGame } from "@/components/games/TogetherGame";
import { HideGame } from "@/components/games/HideGame";
import { GoldenbellGame } from "@/components/games/GoldenbellGame";
import { TruthGame } from "@/components/games/TruthGame";
import { MissionGame } from "@/components/games/MissionGame";
import { ImagePickGame } from "@/components/games/ImagePickGame";

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

  // 콘텐츠 배열 대신 별도 컬렉션을 쓰는 게임
  if (game.gameType === "gift") {
    const db = await readDB();
    if (db.gifts.length === 0 || db.giftParticipants.length === 0) redirect(`/game/${id}`);
    return <GiftDraw title={game.title} gifts={db.gifts} participants={db.giftParticipants} />;
  }
  if (game.gameType === "mission") {
    const db = await readDB();
    if (db.missions.length === 0) redirect(`/game/${id}`);
    return <MissionGame title={game.title} missions={db.missions} />;
  }

  const contents = await getActiveContents(id);
  if (contents.length === 0) redirect(`/game/${id}`);

  const common = {
    title: game.title,
    defaultTimeLimit: game.defaultTimeLimit,
    contents,
  };

  switch (game.gameType) {
    case "balance":
      return <BalanceGame {...common} />;
    case "image":
      return <ImageQuiz {...common} />;
    case "music":
      return <MusicQuiz {...common} />;
    case "draw":
      return <DrawGame {...common} />;
    case "chain":
      return <ChainGame {...common} />;
    case "taste":
      return <TasteGame {...common} />;
    case "together":
      return <TogetherGame {...common} />;
    case "hide":
      return <HideGame {...common} />;
    case "goldenbell":
      return <GoldenbellGame {...common} />;
    case "truth":
      return <TruthGame {...common} />;
    case "imagepick":
      return <ImagePickGame {...common} />;
    default:
      redirect(`/game/${id}`);
  }
}
