import type { Metadata } from "next";

import { AI_EXPERIENCE_LEVELS, DEPARTMENTS, LEARNING_GOALS } from "@/lib/constants";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

import {
  AiExperienceBar,
  DailyTrendLine,
  DepartmentDonut,
  LearningGoalPie,
} from "./DashboardCharts";
import {
  countToday,
  dailySeries,
  seoulDateTime,
  tally,
  topCategory,
  toSlices,
  type Registration,
} from "./stats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "신청 현황 | AI 바이브 코딩 마스터클래스",
};

function StatCard({
  label,
  value,
  caption,
  compact = false,
}: {
  label: string;
  value: string;
  caption?: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p
        className={
          compact
            ? "mt-2 text-xl font-bold leading-snug text-slate-900"
            : "mt-2 text-4xl font-bold text-slate-900"
        }
      >
        {value}
      </p>
      {caption && <p className="mt-1 text-sm text-slate-500">{caption}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  let rows: Registration[] = [];
  let failure: string | null = null;

  try {
    const { data, error } = await getSupabaseAdmin()
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      failure = `[${error.code}] ${error.message}`;
    } else {
      rows = (data ?? []) as Registration[];
    }
  } catch (cause) {
    failure = cause instanceof Error ? cause.message : String(cause);
  }

  if (failure) {
    return (
      <main className="flex-1 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-bold text-red-700">
            데이터를 불러오지 못했습니다
          </h1>
          <p className="mt-2 text-sm text-red-600">{failure}</p>
        </div>
      </main>
    );
  }

  const now = new Date();

  const departmentCounts = tally(rows, "department", DEPARTMENTS);
  const aiExperienceCounts = tally(rows, "ai_experience", AI_EXPERIENCE_LEVELS);
  const learningGoalCounts = tally(rows, "learning_goal", LEARNING_GOALS);

  const topDepartment = topCategory(departmentCounts);
  const topAiExperience = topCategory(aiExperienceCounts);

  return (
    <main className="flex-1 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">신청 현황</h1>
            <p className="mt-1 text-sm text-slate-500">
              AI 바이브 코딩 마스터클래스
            </p>
          </div>
          <p className="text-sm text-slate-500">
            기준 시각 {seoulDateTime(now)} (KST)
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="총 신청 인원" value={`${rows.length}`} caption="명" />
          <StatCard
            label="오늘 신청 인원"
            value={`${countToday(rows, now)}`}
            caption="명 (KST 기준)"
          />
          <StatCard
            label="가장 많은 소속 팀"
            value={topDepartment ? topDepartment.label : "-"}
            caption={topDepartment ? `${topDepartment.count}명` : undefined}
            compact
          />
          <StatCard
            label="가장 많은 AI 경험 레벨"
            value={topAiExperience ? topAiExperience.label : "-"}
            caption={topAiExperience ? `${topAiExperience.count}명` : undefined}
            compact
          />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <DepartmentDonut slices={toSlices(departmentCounts)} />
          <AiExperienceBar slices={toSlices(aiExperienceCounts, true)} />
          <LearningGoalPie slices={toSlices(learningGoalCounts)} />
          <DailyTrendLine points={dailySeries(rows, now)} />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <h2 className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700">
            신청자 목록
          </h2>

          {rows.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              아직 신청자가 없습니다
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">이름</th>
                    <th className="px-4 py-3">이메일</th>
                    <th className="px-4 py-3">소속 팀</th>
                    <th className="px-4 py-3">직급</th>
                    <th className="px-4 py-3">AI 경험</th>
                    <th className="px-4 py-3">배우고 싶은 것</th>
                    <th className="px-4 py-3">식이 제한</th>
                    <th className="px-4 py-3">신청일시</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.email}</td>
                      <td className="px-4 py-3 text-slate-600">{row.department}</td>
                      <td className="px-4 py-3 text-slate-600">{row.position}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.ai_experience}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.learning_goal}
                      </td>
                      <td
                        className={
                          row.dietary
                            ? "bg-amber-100 px-4 py-3 font-medium text-amber-900"
                            : "px-4 py-3 text-slate-400"
                        }
                      >
                        {row.dietary || "-"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500 tabular-nums">
                        {seoulDateTime(row.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
