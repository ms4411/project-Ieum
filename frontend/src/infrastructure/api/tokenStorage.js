// accessToken/refreshToken을 localStorage에 저장/조회/삭제하는 얇은 래퍼.
// 백엔드는 accessToken을 "acceptToken"이라는 이름으로 부르지만(TokensDTO),
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

// 백엔드 TokensDTO 형태({ acceptToken, refreshToken })를 그대로 받아 저장한다.
export function setTokens({ acceptToken, refreshToken }) {
  try {
    if (acceptToken) localStorage.setItem(ACCESS_TOKEN_KEY, acceptToken);
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
