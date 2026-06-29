import type { GameType } from "./types";

// 대표 이미지가 없을 때 사용할 게임 유형별 아이콘 + 그라데이션
export const GAME_VISUAL: Record<
  GameType,
  { icon: string; gradient: string; accent: string }
> = {
  balance: { icon: "⚖️", gradient: "from-[#3b2f7a] to-[#6d28d9]", accent: "#a78bfa" },
  draw: { icon: "✏️", gradient: "from-[#0f4c5c] to-[#1b8a8f]", accent: "#5eead4" },
  chain: { icon: "🔗", gradient: "from-[#6b2d5c] to-[#b03a82]", accent: "#f0a6d8" },
  taste: { icon: "🍪", gradient: "from-[#5a3921] to-[#a85a2a]", accent: "#f5c451" },
  image: { icon: "🖼️", gradient: "from-[#23406e] to-[#2f6fb0]", accent: "#7dd3fc" },
  together: { icon: "🗣️", gradient: "from-[#3a2f6b] to-[#5b4bb8]", accent: "#c4b5fd" },
  hide: { icon: "🫣", gradient: "from-[#1f3a2e] to-[#2f7a52]", accent: "#6ee7b7" },
  music: { icon: "🎵", gradient: "from-[#4a1d52] to-[#9d2c8f]", accent: "#f0a6f0" },
  goldenbell: { icon: "🔔", gradient: "from-[#5c4a1a] to-[#c79a2e]", accent: "#f5c451" },
  truth: { icon: "🎭", gradient: "from-[#2a2150] to-[#5b3a8f]", accent: "#a78bfa" },
  gift: { icon: "🎁", gradient: "from-[#6e1f3a] to-[#c0306a]", accent: "#fb7185" },
  mission: { icon: "🌅", gradient: "from-[#5a3a1a] to-[#c2742e]", accent: "#fbbf24" },
};
