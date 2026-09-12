import { createClient } from "@supabase/supabase-js";

// service role 키는 RLS를 우회하므로 절대 브라우저로 넘어가면 안 된다.
// 빌드 시점이 아니라 요청 시점에만 평가되도록 함수로 감싼다.
export function getSupabaseAdmin() {
  if (typeof window !== "undefined") {
    throw new Error("supabaseAdmin 은 서버에서만 사용할 수 있습니다.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      ".env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 를 입력한 뒤 개발 서버를 재시작해주세요.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
