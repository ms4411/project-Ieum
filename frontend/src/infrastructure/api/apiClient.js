import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from './tokenStorage';

// Vite 프로젝트 기준. .env(.local)에 VITE_API_BASE_URL=http://localhost:8080 처럼
// 백엔드 주소를 지정해두면 된다. 지정하지 않으면 로컬 개발 기본값을 사용한다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export class ApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// accessToken 재발급이 계속 실패해서(=로그인이 완전히 만료돼서) 로그아웃 처리가
// 필요할 때 AuthContext가 등록해두는 콜백. apiClient는 AuthContext를 몰라야 하므로
// 이런 콜백 등록 방식으로 느슨하게 연결한다.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

// 진행 중인 refresh 요청이 있으면 그 Promise를 그대로 공유한다.
// (같은 순간에 여러 요청이 401을 맞아도 refresh는 한 번만 나가도록)
let refreshPromise = null;

async function refreshTokens() {
  const refreshToken = getRefreshToken();
  const acceptToken = getAccessToken();
  if (!refreshToken) throw new ApiError('로그인이 필요합니다.', { status: 401 });

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken, acceptToken }),
    })
      .then(async (res) => {
        const body = await safeParseJson(res);
        if (!res.ok) {
          throw new ApiError(body?.error?.message ?? '토큰 재발급 실패', {
            status: res.status,
            code: body?.error?.code,
          });
        }
        const tokens = body?.data?.tokens;
        setTokens(tokens);
        return tokens;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function safeParseJson(res) {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function buildUrl(path, params) {
  const url = new URL(
    path.startsWith('http') ? path : `${BASE_URL}${path}`
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });
  }
  return url.toString();
}

/**
 * @param {string} path - 예: '/api/v1/groups'
 * @param {object} [options]
 * @param {'GET'|'POST'|'PATCH'|'DELETE'} [options.method='GET']
 * @param {object} [options.body] - JSON으로 직렬화될 요청 바디
 * @param {object} [options.params] - 쿼리스트링 파라미터
 * @param {boolean|'optional'} [options.auth=true]
 *   - true: 로그인이 필요한 요청. 저장된 accessToken을 Authorization 헤더로 담아 보내고,
 *           401이면 refresh 후 재시도 → 그래도 실패하면 로그아웃 처리한다.
 *   - 'optional': 로그인이 필수는 아니지만(예: 모임 검색/상세), 로그인된 상태라면
 *           반드시 accessToken을 담아 보낸다. 401이 나도 강제 로그아웃은 하지 않는다.
 *   - false: 로그인/회원가입처럼 토큰 개념 자체가 없는 요청. 절대 토큰을 붙이지 않는다.
 * @returns 백엔드가 내려준 JSON 바디 전체(성공 응답은 { success, data }, 일부 엔드포인트는 배열을 그대로 반환)
 */
export async function apiFetch(
  path,
  { method = 'GET', body, params, auth = true, _isRetry = false } = {}
) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  // auth가 true(필수)든 'optional'(선택)이든, 로그인 후 저장된 토큰이 있으면 항상 담아 보낸다.
  // auth: false만 토큰을 붙이지 않는다(로그인/회원가입처럼 토큰 개념이 없는 요청).
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const parsed = await safeParseJson(res);

  if (res.ok) return parsed;

  // accessToken이 만료된 경우 딱 한 번 재발급을 시도하고, 성공하면 원래 요청을 재시도한다.
  // (로그인이 필수인 요청에서만 강제 refresh/로그아웃을 수행한다. 'optional'은 토큰이
  //  유효하지 않아도 로그인 없이 계속 쓸 수 있는 화면이므로 세션을 끊지 않는다.)
  if (res.status === 401 && auth === true && !_isRetry && getRefreshToken()) {
    try {
      await refreshTokens();
      return apiFetch(path, { method, body, params, auth, _isRetry: true });
    } catch {
      clearTokens();
      unauthorizedHandler?.();
      throw new ApiError('로그인이 만료되었습니다. 다시 로그인해 주세요.', {
        status: 401,
      });
    }
  }

  if (res.status === 401 && auth === true) {
    clearTokens();
    unauthorizedHandler?.();
  }

  // @Valid 검증 실패(MethodArgumentNotValidException)는 { success, error } 래핑 없이
  // { code, message }가 최상위로 바로 내려온다. 래핑 유무에 상관없이 안전하게 읽는다.
  const errorPayload = parsed?.error ?? parsed;
  throw new ApiError(errorPayload?.message ?? '요청 처리 중 오류가 발생했습니다.', {
    status: res.status,
    code: errorPayload?.code,
  });
}
