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

    case "imagepick":
      return (
        <>
          <Field label="문제 (선택 · 화면 상단 표시)">
            <input name="question" defaultValue={content.question} className="admin-input" placeholder="예: 우리가 처음 갔던 곳은?" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <NumberedImageUpload label="보기 1" field="image" removeField="removeImage" url={content.imageUrl} />
            <NumberedImageUpload label="보기 2" field="image2" removeField="removeImage2" url={content.imageUrl2} />
            <NumberedImageUpload label="보기 3" field="image3" removeField="removeImage3" url={content.imageUrl3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="정답 (보기 번호) *">
              <select name="answer" defaultValue={content.answer || "1"} className="admin-input">
                <option value="1">1번</option>
                <option value="2">2번</option>
                <option value="3">3번</option>
              </select>
            </Field>
            <Field label="힌트 (선택)">
              <input name="hint" defaultValue={content.hint} className="admin-input" />
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

    case "draw":
      return (
        <>
          <Field label="주제 * (1개 콘텐츠 = 1개 주제, 선택 화면에 표시)">
            <input name="keyword" defaultValue={content.keyword} className="admin-input" placeholder="예: 동물" />
          </Field>
          <Field label="제시어 목록 * (한 줄에 하나씩)">
            <textarea name="options" defaultValue={content.options} rows={5} className="admin-input" placeholder={"코끼리\n기린\n펭귄\n악어"} />
          </Field>
          <div className="flex items-end gap-5">
            <div className="w-40">
              <label className="admin-label">참가 인원 (0=기본 4명)</label>
              <input name="count" type="number" min={0} defaultValue={content.count} className="admin-input" />
            </div>
            <div className="w-48">
              <label className="admin-label">1인 제한시간 (초)</label>
              <input name="timeLimit" type="number" min={0} defaultValue={content.timeLimit} className="admin-input" />
            </div>
            <ActiveCheckbox content={content} />
          </div>
        </>
      );

    case "chain":
      return (
        <>
          <Field label="주제 * (1개 콘텐츠 = 1개 주제, 선택 화면에 표시)">
            <input name="keyword" defaultValue={content.keyword} className="admin-input" placeholder="예: 음식 이름" />
          </Field>
          <Field label="초성 직접 지정 (선택 · 한 줄에 하나씩, 비워두면 자동 11개)">
            <textarea name="options" defaultValue={content.options} rows={4} className="admin-input" placeholder={"비워두면 ㄱ,ㄴ,ㄷ... 중 무작위 11개 생성\n직접 지정 시 예)\nㄱ\nㅅ\nㅂ"} />
          </Field>
          <Field label="예시 정답 (진행자 참고)">
            <input name="hint" defaultValue={content.hint} className="admin-input" placeholder="예: 김밥, 감자탕" />
          </Field>
          <TimeAndActive content={content} />
        </>
      );

    case "taste":
      return (
        <>
          <ImageUpload content={content} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="과자명 (정답) *">
              <input name="answer" defaultValue={content.answer} className="admin-input" placeholder="예: 새우깡" />
            </Field>
            <Field label="힌트">
              <input name="hint" defaultValue={content.hint} className="admin-input" />
            </Field>
          </div>
          <ActiveOnly content={content} />
        </>
      );

    case "together":
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="정답 단어 *">
              <input name="answer" defaultValue={content.answer} className="admin-input" placeholder="예: 워크샵 (글자 수 자동 계산)" />
            </Field>
            <Field label="힌트">
              <input name="hint" defaultValue={content.hint} className="admin-input" />
            </Field>
          </div>
          <ActiveOnly content={content} />
        </>
      );

    case "hide":
      return (
        <>
          <Field label="라운드 이름 *">
            <input name="question" defaultValue={content.question} className="admin-input" placeholder="예: A팀이 숨고 B팀이 찾기" />
          </Field>
          <Field label="안내 / 안전 문구">
            <input name="hint" defaultValue={content.hint} className="admin-input" placeholder="예: 계단·화장실엔 숨지 마세요" />
          </Field>
          <div className="flex items-end gap-5">
            <div className="w-48">
              <label className="admin-label">제한시간 (초, 기본 120)</label>
              <input name="timeLimit" type="number" min={0} defaultValue={content.timeLimit} className="admin-input" />
            </div>
            <ActiveCheckbox content={content} />
          </div>
        </>
      );

    case "goldenbell":
      return (
        <>
          <Field label="문제 *">
            <textarea name="question" defaultValue={content.question} rows={2} className="admin-input" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="문제 유형">
              <select name="questionType" defaultValue={content.questionType || "주관식"} className="admin-input">
                <option value="주관식">주관식</option>
                <option value="객관식">객관식</option>
                <option value="ox">OX</option>
              </select>
            </Field>
            <Field label="정답 *">
              <input name="answer" defaultValue={content.answer} className="admin-input" placeholder="객관식은 보기 중 하나 / OX는 O 또는 X" />
            </Field>
          </div>
          <Field label="객관식 보기 (한 줄에 하나씩)">
            <textarea name="options" defaultValue={content.options} rows={4} className="admin-input" placeholder={"고래\n박쥐\n상어\n사람"} />
          </Field>
          <Field label="해설 (선택)">
            <input name="hint" defaultValue={content.hint} className="admin-input" />
          </Field>
          <TimeAndActive content={content} />
        </>
      );

    case "truth":
      return (
        <>
          <Field label="문장 *">
            <textarea name="question" defaultValue={content.question} rows={2} className="admin-input" placeholder="예: 오늘 참석자 중 생일자가 있다." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="정답 *">
              <select name="answer" defaultValue={content.answer || "진실"} className="admin-input">
                <option value="진실">진실</option>
                <option value="거짓">거짓</option>
              </select>
            </Field>
            <Field label="해설 (선택)">
              <input name="hint" defaultValue={content.hint} className="admin-input" />
            </Field>
          </div>
          <ActiveOnly content={content} />
        </>
      );

    default:
      return <ActiveOnly content={content} />;
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

// 이미지 정답찾기용 — 보기별 이미지 업로드 (필드명/삭제필드명 지정)
function NumberedImageUpload({
  label,
  field,
  removeField,
  url,
}: {
  label: string;
  field: string;
  removeField: string;
  url: string;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {url && (
        <div className="mb-2 flex flex-col items-start gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" className="h-20 w-full rounded-lg object-contain bg-white/5 p-1" />
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input type="checkbox" name={removeField} className="accent-[#f87171]" />
            삭제
          </label>
        </div>
      )}
      <input type="file" name={field} accept="image/*" className="admin-input" />
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
