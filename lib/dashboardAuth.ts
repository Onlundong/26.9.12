export const DASHBOARD_COOKIE = "dashboard_auth";

/** 비밀번호 원문을 쿠키에 담지 않기 위해 해시값을 세션 토큰으로 쓴다. */
export async function passwordToken(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`dashboard:${password}`),
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
