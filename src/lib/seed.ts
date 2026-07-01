import type { DB, Game, GameContent, GameType } from "./types";

const now = () => new Date().toISOString();

// 기획서 9장 초기 기본 게임 12종
type SeedGame = Omit<Game, "createdAt" | "updatedAt">;

const baseGames: Array<
  Pick<
    SeedGame,
    | "gameId"
    | "gameType"
    | "title"
    | "shortDescription"
    | "description"
    | "mood"
    | "sortOrder"
    | "defaultTimeLimit"
  >
> = [
  {
    gameId: "g01",
    gameType: "balance",
    title: "밸런스 게임",
    shortDescription: "둘 중 하나만 골라야 한다면?",
    description:
      "화면에 표시되는 질문을 보고 참가자가 O 또는 X 중 하나를 선택합니다.\n각 문제 제한시간은 기본 10초이며, 시간이 끝나면 선택을 마감합니다.\n정답이 없는 선택형 게임으로, 서로의 선택을 보며 즐기는 아이스브레이킹 게임입니다.",
    mood: "선택 · 웃음",
    sortOrder: 1,
    defaultTimeLimit: 10,
  },
  {
    gameId: "g02",
    gameType: "draw",
    title: "이어그리기",
    shortDescription: "한 명씩 5초, 이어서 완성하는 그림",
    description:
      "제시어를 보고 팀원이 한 명씩 5초 동안 그림을 이어 그립니다.\n마지막 사람은 완성된 그림을 보고 제시어를 맞힙니다.\n웹 화면은 제시어, 현재 차례, 타이머를 보여줍니다.",
    mood: "팀워크 · 그림",
    sortOrder: 2,
    defaultTimeLimit: 5,
  },
  {
    gameId: "g03",
    gameType: "chain",
    title: "줄줄이 말해요",
    shortDescription: "주제와 초성에 맞는 단어를 3초 안에!",
    description:
      "주어진 주제와 초성에 맞는 단어를 참가자가 한 명씩 3초 안에 말합니다.\n정답이면 다음 사람으로, 틀리거나 시간 초과 시 탈락합니다.\n마지막까지 살아남은 사람이 승리합니다.",
    mood: "순발력 · 초성",
    sortOrder: 3,
    defaultTimeLimit: 3,
  },
  {
    gameId: "g04",
    gameType: "taste",
    title: "흑백요리사",
    shortDescription: "안대를 쓰고 과자 맛을 맞혀라",
    description:
      "각 팀 대표자가 안대를 착용하고 과자를 먹은 뒤 어떤 과자인지 맞힙니다.\n먼저 정답을 외치고 맞히면 승리, 틀리면 상대팀에게 기회가 넘어갑니다.\n정답은 진행자 전용 보기로만 확인합니다.",
    mood: "미각 · 대표자전",
    sortOrder: 4,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g05",
    gameType: "image",
    title: "이미지퀴즈",
    shortDescription: "로고만 보고 어떤 기업일까?",
    description:
      "기업의 CI 또는 로고 이미지를 보고 어떤 기업인지 맞힙니다.\n참가자가 순서대로 정답을 말하고, 진행자가 정답·오답을 처리합니다.\n모든 이미지를 진행하면 종료됩니다.",
    mood: "추리 · 이미지",
    sortOrder: 5,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g06",
    gameType: "together",
    title: "같이 말해!",
    shortDescription: "한 글자씩 동시에, 무슨 단어일까?",
    description:
      "팀원들이 각각 한 글자씩 동시에 외치고, 상대팀은 그 소리를 조합해 단어를 맞힙니다.\n예) 정답이 '워크샵'이면 세 명이 '워', '크', '샵'을 동시에 외칩니다.\n정답 단어는 진행자 전용으로만 표시됩니다.",
    mood: "팀워크 · 단어",
    sortOrder: 6,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g07",
    gameType: "hide",
    title: "숨바꼭질!",
    shortDescription: "2분 안에 숨은 팀을 찾아라",
    description:
      "한 팀이 숨고 상대팀이 제한시간 2분 안에 찾습니다.\n역할을 바꿔 진행하고, 더 빨리 찾은 팀이 승리합니다.\n안전 안내를 반드시 확인하고 진행하세요.",
    mood: "실내활동 · 스릴",
    sortOrder: 7,
    defaultTimeLimit: 120,
  },
  {
    gameId: "g08",
    gameType: "music",
    title: "음악퀴즈!",
    shortDescription: "전주만 듣고 곡을 맞혀라",
    description:
      "노래의 전주를 듣고 곡명 또는 가수를 맞힙니다.\n진행자가 음악을 재생하고, 참가자가 정답을 외칩니다.\n필요 시 힌트를 제공할 수 있습니다.",
    mood: "음악 · 전주",
    sortOrder: 8,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g09",
    gameType: "goldenbell",
    title: "도전골든벨!",
    shortDescription: "최후의 1인을 가리는 퀴즈",
    description:
      "개인전으로 진행되는 퀴즈 게임입니다.\n참가자는 각자 문제를 듣고 답을 적거나 말하며, 틀린 사람은 탈락합니다.\n마지막까지 남은 사람이 우승합니다.",
    mood: "개인전 · 퀴즈",
    sortOrder: 9,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g10",
    gameType: "truth",
    title: "진실게임!",
    shortDescription: "진실인가 거짓인가, 단 한 문제",
    description:
      "하나의 문장을 보고 진실인지 거짓인지 판단합니다.\n짧고 강한 몰입형 게임으로, 정답 공개 시 임팩트 있는 연출이 핵심입니다.",
    mood: "추리 · 진실/거짓",
    sortOrder: 10,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g11",
    gameType: "gift",
    title: "선물증정!",
    shortDescription: "두근두근 랜덤 추첨 선물 교환",
    description:
      "참가자가 가져온 선물을 랜덤하게 배정하여 증정합니다.\n룰렛/슬롯머신 추첨 연출로 긴장감을 더하고, 당첨자와 선물을 화면에 크게 표시합니다.",
    mood: "랜덤 · 이벤트",
    sortOrder: 11,
    defaultTimeLimit: 0,
  },
  {
    gameId: "g12",
    gameType: "mission",
    title: "기상미션!",
    shortDescription: "아침까지 완수하는 1인 1미션",
    description:
      "잠들기 전부터 다음 날 아침까지 각자 1인 1미션을 수행합니다.\n아침에 미션 수행 여부를 확인하고 성공자를 발표합니다.\n미션 배정 화면과 결과 확인 화면을 분리해 운영합니다.",
    mood: "장기미션 · 도전",
    sortOrder: 12,
    defaultTimeLimit: 0,
  },
];

function content(
  gameId: string,
  sortOrder: number,
  fields: Partial<GameContent>,
): GameContent {
  return {
    contentId: `${gameId}-c${sortOrder}`,
    gameId,
    question: "",
    optionO: "",
    optionX: "",
    keyword: "",
    initialSound: "",
    answer: "",
    artist: "",
    hint: "",
    options: "",
    questionType: "주관식",
    count: 0,
    imageUrl: "",
    audioUrl: "",
    timeLimit: 0,
    sortOrder,
    isActive: true,
    ...fields,
  };
}

// 플레이 가능한 게임에 한해 샘플 콘텐츠를 시드한다 (행사 전 관리자페이지에서 교체)
const seedContents: GameContent[] = [
  // 밸런스 게임
  content("g01", 1, {
    question: "평생 라면만 먹기 vs 평생 치킨만 먹기",
    optionO: "평생 라면만",
    optionX: "평생 치킨만",
  }),
  content("g01", 2, {
    question: "여름 휴가는? 산으로 vs 바다로",
    optionO: "산으로",
    optionX: "바다로",
  }),
  content("g01", 3, {
    question: "출근한다면? 재택 평생 vs 사무실 평생",
    optionO: "재택 평생",
    optionX: "사무실 평생",
  }),
  // 이어그리기 (제시어)
  content("g02", 1, { keyword: "코끼리", answer: "코끼리", count: 4, timeLimit: 5 }),
  content("g02", 2, { keyword: "회식", answer: "회식", count: 4, timeLimit: 5 }),
  content("g02", 3, { keyword: "비행기", answer: "비행기", count: 4, timeLimit: 5 }),
  // 줄줄이 말해요 (1 콘텐츠 = 1 주제, 초성은 자동 11개 생성). 주제 6개.
  content("g03", 1, { keyword: "음식 이름", hint: "김밥, 감자탕", timeLimit: 3 }),
  content("g03", 2, { keyword: "동물", hint: "사자, 사슴", timeLimit: 3 }),
  content("g03", 3, { keyword: "회사 용어", hint: "보고서, 부장님", timeLimit: 3 }),
  content("g03", 4, { keyword: "영화 제목", hint: "기생충, 명량", timeLimit: 3 }),
  content("g03", 5, { keyword: "과일", hint: "감, 사과", timeLimit: 3 }),
  content("g03", 6, { keyword: "나라 이름", hint: "그리스, 스페인", timeLimit: 3 }),
  // 흑백요리사 (과자명 정답)
  content("g04", 1, { answer: "새우깡", hint: "바삭한 국민 스낵" }),
  content("g04", 2, { answer: "초코파이", hint: "정(情)" }),
  content("g04", 3, { answer: "홈런볼", hint: "동그란 크림" }),
  // 이미지퀴즈 (이미지는 관리자페이지에서 업로드)
  content("g05", 1, { answer: "구글", hint: "검색 엔진" }),
  content("g05", 2, { answer: "애플", hint: "한 입 베어 문 과일" }),
  content("g05", 3, { answer: "스타벅스", hint: "초록색 세이렌" }),
  // 같이 말해 (정답 단어)
  content("g06", 1, { answer: "워크샵", hint: "지금 우리가 하는 것" }),
  content("g06", 2, { answer: "삼겹살", hint: "회식 단골 메뉴" }),
  content("g06", 3, { answer: "프로젝트", hint: "업무 단위" }),
  // 숨바꼭질 (라운드, 2분)
  content("g07", 1, { question: "A팀이 숨고 B팀이 찾기", hint: "꼭꼭 숨어라!", timeLimit: 120 }),
  content("g07", 2, { question: "B팀이 숨고 A팀이 찾기", hint: "꼭꼭 숨어라!", timeLimit: 120 }),
  // 음악퀴즈 (음악 파일은 관리자페이지에서 업로드)
  content("g08", 1, { answer: "곡명 미등록", artist: "", hint: "행사 전 음원을 등록하세요" }),
  // 도전골든벨 (퀴즈)
  content("g09", 1, {
    question: "대한민국의 수도는?",
    questionType: "주관식",
    answer: "서울",
  }),
  content("g09", 2, {
    question: "다음 중 포유류가 아닌 것은?",
    questionType: "객관식",
    options: "고래\n박쥐\n상어\n사람",
    answer: "상어",
    hint: "아가미로 숨 쉬는 동물",
  }),
  content("g09", 3, {
    question: "지구에서 가장 큰 대양은 태평양이다.",
    questionType: "ox",
    answer: "O",
  }),
  // 진실게임 (진실/거짓)
  content("g10", 1, {
    question: "오늘 참석자 중 생일자가 있다.",
    answer: "진실",
    hint: "진행자가 사전에 확인하세요",
  }),
  content("g10", 2, {
    question: "우리 회사는 올해 창립 10주년이다.",
    answer: "거짓",
    hint: "행사에 맞게 수정하세요",
  }),
];

export function createSeedDB(): DB {
  const ts = now();
  const games: Game[] = baseGames.map((g) => ({
    ...g,
    thumbnailUrl: "",
    isActive: true,
    isCompleted: false,
    createdAt: ts,
    updatedAt: ts,
  }));

  return {
    meta: {
      eventName: "2026 Workshop",
      eventDate: "2026.06.30",
      mainTitle: "2026 Workshop Game Night",
    },
    games,
    contents: seedContents,
    // 선물증정 샘플 (행사 전 교체)
    gifts: [
      { giftId: "gift1", giftName: "블루투스 스피커", giftImageUrl: "", providerName: "", receiverName: "", isAssigned: false, sortOrder: 1 },
      { giftId: "gift2", giftName: "스타벅스 기프티콘", giftImageUrl: "", providerName: "", receiverName: "", isAssigned: false, sortOrder: 2 },
      { giftId: "gift3", giftName: "무선 충전기", giftImageUrl: "", providerName: "", receiverName: "", isAssigned: false, sortOrder: 3 },
    ],
    giftParticipants: [
      { id: "p1", name: "김철수" },
      { id: "p2", name: "이영희" },
      { id: "p3", name: "박민수" },
      { id: "p4", name: "정수진" },
    ],
    // 오늘의 상품(경품) 샘플 — 메인 우측 패널 노출 (이미지는 관리자페이지에서 등록)
    products: [
      { productId: "pr1", name: "블루투스 스피커", imageUrl: "", sortOrder: 1 },
      { productId: "pr2", name: "스타벅스 기프티콘", imageUrl: "", sortOrder: 2 },
      { productId: "pr3", name: "무선 충전기", imageUrl: "", sortOrder: 3 },
      { productId: "pr4", name: "치킨 기프티콘", imageUrl: "", sortOrder: 4 },
    ],
    // 기상미션 샘플
    missions: [
      { missionId: "m1", participantName: "김철수", missionText: "아침에 제일 먼저 단체 채팅방에 인사하기", isPublic: true, isCompleted: false, sortOrder: 1 },
      { missionId: "m2", participantName: "이영희", missionText: "아침 식사 때 옆 사람 물 따라주기", isPublic: true, isCompleted: false, sortOrder: 2 },
      { missionId: "m3", participantName: "박민수", missionText: "기상 후 단체사진 찍기", isPublic: true, isCompleted: false, sortOrder: 3 },
      { missionId: "m4", participantName: "정수진", missionText: "아침에 가장 먼저 로비에 도착하기", isPublic: true, isCompleted: false, sortOrder: 4 },
    ],
  };
}

export const GAME_TYPE_LABELS: Record<GameType, string> = {
  balance: "밸런스 게임",
  image: "이미지퀴즈",
  music: "음악퀴즈",
  gift: "선물증정",
  draw: "이어그리기",
  chain: "줄줄이 말해요",
  taste: "흑백요리사",
  together: "같이 말해",
  hide: "숨바꼭질",
  goldenbell: "도전골든벨",
  truth: "진실게임",
  mission: "기상미션",
};
