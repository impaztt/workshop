import type { GameContent, GameType } from "@/lib/types";

// 게임 유형에 따라 다른 콘텐츠 입력 필드를 렌더링 (기획서 7.3)
export function ContentFields({
  gameType,
  content,
}: {
  gameType: GameType;
  content: GameContent;
}) {
  switch (gameType) {
    case "balance":
      return (
        <>
          <Field label="질문 *">
            <input name="question" defaultValue={content.question} className="admin-input" placeholder="예: 평생 라면만 vs 평생 치킨만" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="O 선택지">
              <input name="optionO" defaultValue={content.optionO} className="admin-input" placeholder="O 문구" />
            </Field>
            <Field label="X 선택지">
              <input name="optionX" defaultValue={content.optionX} className="admin-input" placeholder="X 문구" />
            </Field>
          </div>
          <TimeAndActive content={content} />
        </>
      );

    case "image":
      return (
        <>
          <ImageUpload content={content} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="정답 *">
              <input name="answer" defaultValue={content.answer} className="admin-input" placeholder="예: 스타벅스" />
            </Field>
            <Field label="힌트">
              <input name="hint" defaultValue={content.hint} className="admin-input" placeholder="예: 초록색 세이렌" />
            </Field>
          </div>
          <TimeAndActive content={content} />
        </>
      );

    case "music":
      return (
        <>
          <AudioUpload content={content} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="곡명 (정답) *">
              <input name="answer" defaultValue={content.answer} className="admin-input" />
            </Field>
            <Field label="가수">
              <input name="artist" defaultValue={content.artist} className="admin-input" />
            </Field>
            <Field label="힌트">
              <input name="hint" defaultValue={content.hint} className="admin-input" placeholder="발매연도, 장르 등" />
            </Field>
          </div>
          <ActiveOnly content={content} />
        </>
      );

    default:
      // 2차 개발 게임 — 범용 필드 (사전 입력용)
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="문제 / 제시어">
              <input name="question" defaultValue={content.question} className="admin-input" />
            </Field>
            <Field label="키워드 / 초성">
              <input name="keyword" defaultValue={content.keyword} className="admin-input" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="정답">
              <input name="answer" defaultValue={content.answer} className="admin-input" />
            </Field>
            <Field label="힌트">
              <input name="hint" defaultValue={content.hint} className="admin-input" />
            </Field>
          </div>
          <TimeAndActive content={content} />
        </>
      );
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
    </div>
  );
}

function TimeAndActive({ content }: { content: GameContent }) {
  return (
    <div className="flex items-end gap-5">
      <div className="w-48">
        <label className="admin-label">제한시간 (초, 0=게임 기본값)</label>
        <input name="timeLimit" type="number" min={0} defaultValue={content.timeLimit} className="admin-input" />
      </div>
      <ActiveCheckbox content={content} />
    </div>
  );
}

function ActiveOnly({ content }: { content: GameContent }) {
  return (
    <div className="flex items-center">
      <ActiveCheckbox content={content} />
    </div>
  );
}

function ActiveCheckbox({ content }: { content: GameContent }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 pb-2">
      <input type="checkbox" name="isActive" defaultChecked={content.isActive} className="h-5 w-5 accent-[#a78bfa]" />
      <span className="text-sm text-white/80">사용</span>
    </label>
  );
}

function ImageUpload({ content }: { content: GameContent }) {
  return (
    <div>
      <label className="admin-label">이미지</label>
      {content.imageUrl && (
        <div className="mb-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={content.imageUrl} alt="" className="h-16 w-16 rounded-lg object-contain bg-white/5 p-1" />
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input type="checkbox" name="removeImage" className="accent-[#f87171]" />
            삭제
          </label>
        </div>
      )}
      <input type="file" name="image" accept="image/*" className="admin-input" />
    </div>
  );
}

function AudioUpload({ content }: { content: GameContent }) {
  return (
    <div>
      <label className="admin-label">음원 파일</label>
      {content.audioUrl && (
        <div className="mb-2 flex items-center gap-3">
          <audio controls src={content.audioUrl} className="h-9" />
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input type="checkbox" name="removeAudio" className="accent-[#f87171]" />
            삭제
          </label>
        </div>
      )}
      <input type="file" name="audio" accept="audio/*" className="admin-input" />
    </div>
  );
}
