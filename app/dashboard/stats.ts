import { ETC } from "@/lib/constants";

export type Registration = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  department: string;
  position: string;
  ai_experience: string;
  learning_goal: string;
  dietary: string | null;
};

export type Slice = { label: string; count: number; color: string };
export type DailyPoint = { label: string; count: number };

// dataviz 기본 카테고리 팔레트(라이트). 순서 고정 — 색은 순위가 아니라 항목에 붙는다.
export const SERIES_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
  "#e34948",
];

const seoulDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const seoulDateTimeFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function seoulDate(value: string | Date): string {
  return seoulDateFormatter.format(new Date(value));
}

export function seoulDateTime(value: string | Date): string {
  return seoulDateTimeFormatter.format(new Date(value));
}

/** 정의된 카테고리 순서대로 집계하고, 목록에 없는 값은 기타로 모은다. */
export function tally(
  rows: Registration[],
  field: "department" | "ai_experience" | "learning_goal",
  categories: readonly string[],
): Map<string, number> {
  const counts = new Map<string, number>(categories.map((c) => [c, 0]));

  for (const row of rows) {
    const value = row[field];
    const key = counts.has(value) ? value : ETC;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

/** 색은 전체 카테고리 순서 기준으로 고정 — 0건 항목을 걸러내도 남은 항목 색이 바뀌지 않는다. */
export function toSlices(counts: Map<string, number>, includeZero = false): Slice[] {
  return [...counts.entries()]
    .map(([label, count], index) => ({
      label,
      count,
      color: SERIES_COLORS[index % SERIES_COLORS.length],
    }))
    .filter((slice) => includeZero || slice.count > 0);
}

/** 최다 카테고리. 동률이면 카테고리 정의 순서상 앞선 항목이 이긴다(안정적). */
export function topCategory(counts: Map<string, number>): Slice | null {
  let best: { label: string; count: number } | null = null;

  for (const [label, count] of counts) {
    if (count > 0 && (!best || count > best.count)) {
      best = { label, count };
    }
  }

  return best ? { ...best, color: SERIES_COLORS[0] } : null;
}

export function countToday(rows: Registration[], now: Date = new Date()): number {
  const today = seoulDate(now);
  return rows.filter((row) => seoulDate(row.created_at) === today).length;
}

/** 최근 7일(Asia/Seoul). 신청이 없는 날도 0으로 채워 라인 차트가 끊기지 않게 한다. */
export function dailySeries(rows: Registration[], now: Date = new Date()): DailyPoint[] {
  const buckets = new Map<string, number>();
  const base = new Date(`${seoulDate(now)}T00:00:00Z`);

  for (let offset = 6; offset >= 0; offset--) {
    const day = new Date(base);
    day.setUTCDate(day.getUTCDate() - offset);
    buckets.set(day.toISOString().slice(0, 10), 0);
  }

  for (const row of rows) {
    const key = seoulDate(row.created_at);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return [...buckets.entries()].map(([date, count]) => ({
    label: `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`,
    count,
  }));
}
