// accessToken/refreshToken을 localStorage에 저장/조회/삭제하는 얇은 래퍼.
// 나머지 코드에서는 좀 더 일반적인 accessToken이라는 이름을 쓴다.

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

// 백엔드 TokensDTO 형태({ accessToken, refreshToken })를 그대로 받아 저장한다.
export function setTokens(tokens) {
  const { accessToken, refreshToken } = tokens ?? {};
  // 진단용: 응답에 토큰이 하나라도 빠져 있으면 바로 눈에 띄도록 경고를 남긴다.
  if (!tokens || !accessToken || !refreshToken) {
    console.warn(
      '[tokenStorage] setTokens: 토큰이 누락된 채로 호출됨 — 백엔드 응답의 필드명을 확인하세요.',
      { received: tokens, receivedKeys: tokens ? Object.keys(tokens) : [] }
    );
  }
  try {
    if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    // localStorage 접근이 막힌 환경(프라이빗 브라우징 등)에서는 조용히 무시한다.
  }
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    // no-op
  }
}
