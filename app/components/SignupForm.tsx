"use client";

import { useState, type FormEvent } from "react";

import {
  AI_EXPERIENCE_LEVELS,
  DEPARTMENTS,
  LEARNING_GOALS,
  POSITIONS,
} from "@/lib/constants";
import { supabase } from "@/lib/supabase";

type FormState = {
  name: string;
  email: string;
  department: string;
  position: string;
  aiExperience: string;
  learningGoal: string;
  dietary: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  department: "",
  position: "",
  aiExperience: "",
  learningGoal: "",
  dietary: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const selectClassName =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";
const inputClassName =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function SignupForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "이름을 입력해주세요.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "이메일을 입력해주세요.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      nextErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!form.department) {
      nextErrors.department = "소속 팀/부서를 선택해주세요.";
    }

    if (!form.position) {
      nextErrors.position = "직급을 선택해주세요.";
    }

    if (!form.aiExperience) {
      nextErrors.aiExperience = "AI 도구 사용 경험을 선택해주세요.";
    }

    if (!form.learningGoal) {
      nextErrors.learningGoal = "배우고 싶은 것을 선택해주세요.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase.from("registrations").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department,
      position: form.position,
      ai_experience: form.aiExperience,
      learning_goal: form.learningGoal,
      dietary: form.dietary.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      console.error("신청 저장 실패:", error);
      setSubmitError("신청 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
        <p className="text-2xl font-bold text-emerald-700">
          신청이 완료되었습니다! 🎉
        </p>
        <p className="mt-2 text-emerald-700">당일 노트북 꼭 챙겨오세요.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          이름 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClassName}
          placeholder="홍길동"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          이메일 <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={inputClassName}
          placeholder="name@company.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-slate-700">
            소속 팀/부서 <span className="text-red-500">*</span>
          </label>
          <select
            id="department"
            value={form.department}
            onChange={(e) => updateField("department", e.target.value)}
            className={selectClassName}
          >
            <option value="">선택해주세요</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-sm text-red-500">{errors.department}</p>
          )}
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-slate-700">
            직급 <span className="text-red-500">*</span>
          </label>
          <select
            id="position"
            value={form.position}
            onChange={(e) => updateField("position", e.target.value)}
            className={selectClassName}
          >
            <option value="">선택해주세요</option>
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
          {errors.position && (
            <p className="mt-1 text-sm text-red-500">{errors.position}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="aiExperience" className="block text-sm font-medium text-slate-700">
          AI 도구 사용 경험 <span className="text-red-500">*</span>
        </label>
        <select
          id="aiExperience"
          value={form.aiExperience}
          onChange={(e) => updateField("aiExperience", e.target.value)}
          className={selectClassName}
        >
          <option value="">선택해주세요</option>
          {AI_EXPERIENCE_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        {errors.aiExperience && (
          <p className="mt-1 text-sm text-red-500">{errors.aiExperience}</p>
        )}
      </div>

      <div>
        <label htmlFor="learningGoal" className="block text-sm font-medium text-slate-700">
          강의에서 가장 배우고 싶은 것 <span className="text-red-500">*</span>
        </label>
        <select
          id="learningGoal"
          value={form.learningGoal}
          onChange={(e) => updateField("learningGoal", e.target.value)}
          className={selectClassName}
        >
          <option value="">선택해주세요</option>
          {LEARNING_GOALS.map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
        {errors.learningGoal && (
          <p className="mt-1 text-sm text-red-500">{errors.learningGoal}</p>
        )}
      </div>

      <div>
        <label htmlFor="dietary" className="block text-sm font-medium text-slate-700">
          식이 제한이나 알레르기
        </label>
        <textarea
          id="dietary"
          value={form.dietary}
          onChange={(e) => updateField("dietary", e.target.value)}
          rows={3}
          className={inputClassName}
          placeholder="간식 준비 참고용"
        />
      </div>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {submitting ? "신청 중..." : "신청하기"}
      </button>
    </form>
  );
}
