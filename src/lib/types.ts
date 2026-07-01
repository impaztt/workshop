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
  | "mission" // 기상미션
  | "imagepick"; // 이미지 정답찾기 (3개 이미지 중 정답 1개 고르기 · "기억하니?")

// 본게임(플레이) 화면이 구현된 유형 — 전 게임 구현 완료
export const PLAYABLE_TYPES: GameType[] = [
  "balance",
  "draw",
  "chain",
  "taste",
  "image",
  "together",
  "hide",
  "music",
  "goldenbell",
  "truth",
  "gift",
  "mission",
  "imagepick",
];

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
  isCompleted?: boolean; // 메인 화면에서 '이미 진행함' 표시 (회색 처리, 위치는 유지)
  createdAt: string;
  updatedAt: string;
}

export interface GameContent {
  contentId: string;
  gameId: string;
  // 공통/유형별 필드 — 사용하지 않는 필드는 빈 문자열/기본값
  question: string; // 밸런스 질문, 골든벨/진실게임 문장 등
  optionO: string; // 밸런스 O 선택지
  optionX: string; // 밸런스 X 선택지
  keyword: string; // 제시어(이어그리기), 주제(줄줄이)
  initialSound: string; // 초성 (줄줄이 말해요)
  answer: string; // 정답
  artist: string; // 음악 가수명
  hint: string;
  options: string; // 객관식 보기 (줄바꿈 구분, 도전골든벨)
  questionType: string; // 골든벨 문제 유형: "주관식" | "객관식" | "ox"
  count: number; // 참가 인원 수 등 (이어그리기)
  imageUrl: string;
  imageUrl2: string; // 이미지 정답찾기 보기 2
  imageUrl3: string; // 이미지 정답찾기 보기 3
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

// 메인 화면 우측 '오늘의 상품' 패널에 노출되는 경품
export interface Product {
  productId: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
}

// 기상미션 전용 데이터
export interface Mission {
  missionId: string;
  participantName: string;
  missionText: string;
  isPublic: boolean; // 전체 공개 / 개인 공개
  isCompleted: boolean;
  sortOrder: number;
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
  missions: Mission[];
  products: Product[];
}
