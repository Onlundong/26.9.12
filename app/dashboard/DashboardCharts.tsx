"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DailyPoint, Slice } from "./stats";

const SURFACE = "#fcfcfb";
const GRID = "#e1e0d9";
const AXIS = "#c3c2b7";
const MUTED = "#898781";
const SERIES_1 = "#2a78d6";

const tooltipStyle = {
  backgroundColor: SURFACE,
  border: `1px solid ${AXIS}`,
  borderRadius: 8,
  fontSize: 13,
  color: "#0b0b0b",
} as const;

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyPlot() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
      아직 신청 데이터가 없습니다
    </div>
  );
}

/** 색만으로 구분하지 않도록 값까지 함께 읽히는 범례. */
function Legend({ slices, total }: { slices: Slice[]; total: number }) {
  return (
    <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
      {slices.map((slice) => (
        <li key={slice.label} className="flex items-center gap-2 text-sm">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: slice.color }}
          />
          <span className="truncate text-slate-600">{slice.label}</span>
          <span className="ml-auto shrink-0 font-medium text-slate-900 tabular-nums">
            {slice.count}명
            <span className="ml-1 font-normal text-slate-500">
              ({total > 0 ? Math.round((slice.count / total) * 100) : 0}%)
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function DepartmentDonut({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <ChartCard title="소속 팀별 신청 분포">
      {total === 0 ? (
        <EmptyPlot />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={slices}
                dataKey="count"
                nameKey="label"
                isAnimationActive={false}
                innerRadius={62}
                outerRadius={96}
                stroke={SURFACE}
                strokeWidth={2}
              >
                {slices.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [`${value}명`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <Legend slices={slices} total={total} />
        </>
      )}
    </ChartCard>
  );
}

export function LearningGoalPie({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <ChartCard title="가장 배우고 싶은 것 분포">
      {total === 0 ? (
        <EmptyPlot />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={slices}
                dataKey="count"
                nameKey="label"
                isAnimationActive={false}
                outerRadius={96}
                stroke={SURFACE}
                strokeWidth={2}
              >
                {slices.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value, name) => [`${value}명`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <Legend slices={slices} total={total} />
        </>
      )}
    </ChartCard>
  );
}

export function AiExperienceBar({ slices }: { slices: Slice[] }) {
  const max = Math.max(1, ...slices.map((slice) => slice.count));

  return (
    <ChartCard title="AI 도구 사용 경험 분포">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={slices}
          layout="vertical"
          margin={{ top: 4, right: 16, bottom: 4, left: 8 }}
          barCategoryGap={12}
        >
          <CartesianGrid stroke={GRID} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, max]}
            allowDecimals={false}
            tick={{ fill: MUTED, fontSize: 12 }}
            axisLine={{ stroke: AXIS }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={150}
            tick={{ fill: MUTED, fontSize: 12 }}
            axisLine={{ stroke: AXIS }}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(11,11,11,0.04)" }}
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}명`, "신청"]}
          />
          <Bar
            dataKey="count"
            fill={SERIES_1}
            radius={[0, 4, 4, 0]}
            maxBarSize={18}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function DailyTrendLine({ points }: { points: DailyPoint[] }) {
  const max = Math.max(1, ...points.map((point) => point.count));

  return (
    <ChartCard title="일별 신청 추이 (최근 7일)">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={points} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: MUTED, fontSize: 12 }}
            axisLine={{ stroke: AXIS }}
            tickLine={false}
          />
          <YAxis
            domain={[0, max]}
            allowDecimals={false}
            tick={{ fill: MUTED, fontSize: 12 }}
            axisLine={{ stroke: AXIS }}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${value}명`, "신청"]}
          />
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="count"
            stroke={SERIES_1}
            strokeWidth={2}
            dot={{ r: 4, fill: SERIES_1, stroke: SURFACE, strokeWidth: 2 }}
            activeDot={{ r: 6, fill: SERIES_1, stroke: SURFACE, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
