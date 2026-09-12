import SignupForm from "./components/SignupForm";

const EVENT_INFO = [
  {
    icon: "📅",
    label: "일시",
    value: "2026년 4월 2일(목) 오후 1시 ~ 5시 (4시간)",
  },
  {
    icon: "📍",
    label: "장소",
    value: "본사 대회의실",
  },
  {
    icon: "👥",
    label: "대상",
    value: "전 직원 (개발/비개발 무관)",
  },
  {
    icon: "💻",
    label: "준비물",
    value: "개인 노트북",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-gradient-to-b from-indigo-600 to-indigo-500 px-6 py-16 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-100">
            AI커피챗 강사 임태영
          </p>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">
            AI 바이브 코딩 마스터클래스
          </h1>
          <p className="mt-4 text-lg text-indigo-100 sm:text-xl">
            코딩 없이 AI로 업무 도구를 만드는 법
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 text-center">
        <p className="text-lg leading-relaxed text-slate-700 sm:text-xl">
          AI에게 말로 지시하면 앱이 만들어집니다.
          <br />
          코딩 경험이 전혀 없어도 괜찮아요.
          <br />
          4시간이면 여러분만의 업무 도구를 직접 만들 수 있습니다.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {EVENT_INFO.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="text-3xl" aria-hidden="true">
                {item.icon}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-500">{item.label}</p>
                <p className="mt-1 text-base font-medium text-slate-900">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-20">
        <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
          신청하기
        </h2>
        <SignupForm />
      </section>
    </main>
  );
}
