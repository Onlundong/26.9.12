import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 확인 | AI 바이브 코딩 마스터클래스",
};

export default async function DashboardLoginPage({
  searchParams,
}: PageProps<"/dashboard/login">) {
  const failed = (await searchParams).error === "1";

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-bold text-slate-900">신청 현황 열람</h1>
        <p className="mt-1 text-sm text-slate-500">
          관리자 비밀번호를 입력해주세요.
        </p>

        <form
          method="post"
          action="/api/dashboard-login"
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {failed && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              비밀번호가 올바르지 않습니다.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            확인
          </button>
        </form>
      </div>
    </main>
  );
}
