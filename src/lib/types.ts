// 게임 유형 — 본게임 화면 분기 및 관리자 콘텐츠 폼 분기에 사용
export type GameType =
  | "balance" // 밸런스 게임 (OX 선택형)
  | "image" // 이미지퀴즈
  | "music" // 음악퀴즈
  | "gift" // 선물증정 (랜덤추첨)
  | "draw" // 이어그리기
  | "chain" // 줄줄이 말해요
  | "taste" // 흑백요리사
  | "together" // 같이 말해
  | "hide" // 숨바꼭질
  | "goldenbell" // 도전골든벨
  | "truth" // 진실게임
  | "mission"; // 기상미션

// 1차 개발 범위에서 실제 플레이 화면이 구현된 유형
export const PLAYABLE_TYPES: GameType[] = ["balance", "image", "music", "gift"];

export interface Game {
  gameId: string;
  gameType: GameType;
  title: string;
  shortDescription: string;
  description: string; // 상세 규칙 (줄바꿈 허용)
  thumbnailUrl: string; // 대표 이미지 (없으면 빈 문자열 → 그라데이션 대체)
  mood: string; // 난이도/분위기 태그 (예: 순발력, 팀워크)
  sortOrder: number;
  defaultTimeLimit: number; // 초 단위, 0이면 타이머 미사용
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GameContent {
  contentId: string;
  gameId: string;
  // 공통/유형별 필드 — 사용하지 않는 필드는 빈 문자열/기본값
  question: string; // 밸런스 질문, 골든벨 문제 등
  optionO: string; // 밸런스 O 선택지
  optionX: string; // 밸런스 X 선택지
  keyword: string; // 제시어
  answer: string; // 정답 (이미지/음악 등)
  artist: string; // 음악 가수명
  hint: string;
  imageUrl: string;
  audioUrl: string;
  timeLimit: number; // 0이면 게임 기본값 사용
  sortOrder: number;
  isActive: boolean;
}

// 선물증정 전용 데이터
export interface Gift {
  giftId: string;
  giftName: string;
  giftImageUrl: string;
  providerName: string;
  receiverName: string; // 추첨 확정 시 채워짐
  isAssigned: boolean;
  sortOrder: number;
}

export interface GiftParticipant {
  id: string;
  name: string;
}

export interface DB {
  meta: {
    eventName: string; // 행사명
    eventDate: string; // 행사 날짜 표시용
    mainTitle: string; // 메인 타이틀
  };
  games: Game[];
  contents: GameContent[];
  gifts: Gift[];
  giftParticipants: GiftParticipant[];
}
