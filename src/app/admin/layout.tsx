import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { LoginScreen } from "@/components/admin/LoginScreen";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) {
    return (
      <main className="stage-bg grid min-h-screen place-items-center px-6">
        <LoginScreen />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0b0d1f] text-white">
      {/* 사이드바 */}
      <aside className="flex w-60 flex-col border-r border-white/10 bg-black/30 p-5">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet to-mint text-lg font-black text-ink">
            W
          </div>
          <div>
            <p className="text-sm font-bold">관리자</p>
            <p className="text-xs text-white/40">Workshop Admin</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <NavItem href="/admin" label="대시보드" />
          <NavItem href="/admin/games" label="게임 목록 관리" />
          <NavItem href="/admin/products" label="오늘의 상품 관리" />
          <NavItem href="/admin/gifts" label="선물증정 관리" />
          <NavItem href="/admin/missions" label="기상미션 관리" />
          <NavItem href="/admin/settings" label="행사 설정" />
        </nav>
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            ↗ 메인 화면 보기
          </Link>
          <form action={logoutAction}>
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/60 transition hover:bg-danger/20 hover:text-white">
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </div>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2.5 font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}
