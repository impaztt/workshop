"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginScreen() {
  const [error, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="glass w-full max-w-md rounded-3xl p-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet to-mint text-2xl font-black text-ink">
          W
        </div>
        <h1 className="text-2xl font-black">관리자 로그인</h1>
        <p className="mt-2 text-sm text-white/50">
          행사 콘텐츠를 관리하려면 비밀번호를 입력하세요
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label className="admin-label" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            required
            className="admin-input"
            placeholder="••••••••"
          />
        </div>
        {error && (
          <p className="rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="ctrl-btn ctrl-btn-gold mt-2 w-full justify-center"
        >
          {pending ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
