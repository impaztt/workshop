"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

// 폼 submit 버튼 — 1차 클릭 시 확인 문구로 바뀌고, 2차 클릭에서 실제 제출
export function ConfirmSubmit({
  label,
  confirmLabel = "정말 삭제할까요?",
  className = "ctrl-btn ctrl-btn-danger",
}: {
  label: string;
  confirmLabel?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!armed) {
          e.preventDefault();
          setArmed(true);
          setTimeout(() => setArmed(false), 3000);
        }
      }}
      className={className}
    >
      {pending ? "처리 중..." : armed ? confirmLabel : label}
    </button>
  );
}

export function ConfirmResetButton() {
  return (
    <ConfirmSubmit
      label="진행 상태 초기화"
      confirmLabel="한 번 더 클릭하면 초기화됩니다"
    />
  );
}
