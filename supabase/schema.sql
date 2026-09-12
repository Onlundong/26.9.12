-- AI 바이브 코딩 마스터클래스 신청 테이블
-- Supabase 대시보드 > SQL Editor 에서 실행

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null check (length(trim(name)) > 0),

  email text not null check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),

  department text not null check (
    department in (
      '프로덕트', '마케팅', '세일즈', '컨설팅',
      '개발', '디자인', '경영지원', '기타'
    )
  ),

  position text not null check (
    position in ('사원', '대리', '과장', '차장', '부장', '임원')
  ),

  ai_experience text not null check (
    ai_experience in (
      '처음이에요',
      'ChatGPT 정도 써봤어요',
      'Claude도 써봤어요',
      'Claude Code까지 써봤어요'
    )
  ),

  learning_goal text not null check (
    learning_goal in (
      '업무 자동화', '데이터 분석', '웹서비스 만들기',
      'AI 도구 전반', '기타'
    )
  ),

  dietary text
);

-- RLS: 신청(INSERT)만 공개, 조회는 대시보드/service_role만 가능
alter table public.registrations enable row level security;

create policy "anyone can submit a registration"
  on public.registrations
  for insert
  to anon, authenticated
  with check (true);
