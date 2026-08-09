import { apiFetch } from '../../../infrastructure/api/apiClient';

// 회원가입. 성공 시 { message } 형태의 data를 돌려준다.
export function signUp({ loginId, pw, checkPw, nickname }) {
  return apiFetch('/api/v1/auth/signUp', {
    method: 'POST',
    auth: false,
    body: { loginId, pw, checkPw, nickname },
  }).then((res) => res.data);
}

// 로그인. 성공 시 { refreshToken, acceptToken } 형태의 토큰을 돌려준다.
export function login({ loginId, pw }) {
  return apiFetch('/api/v1/auth/login', {
    method: 'POST',
    auth: false,
    body: { loginId, pw },
  }).then((res) => res.data);
}

export function logout() {
  return apiFetch('/api/v1/auth/logout', { method: 'POST' }).then(
    (res) => res.data
  );
}

// 로그인된 내 정보 조회. { id, loginId, nickname } 형태.
// auth 기본값(true)이므로 apiFetch가 로그인 후 저장된 accessToken을
// Authorization 헤더에 자동으로 담아 보낸다(별도로 넘길 필요 없음).
export function getMe() {
  return apiFetch('/api/v1/users/me').then((res) => res.data);
}

export function updateNickname(nickname) {
  return apiFetch('/api/v1/users/me', {
    method: 'PATCH',
    body: { data: nickname },
  });
}

export function deleteUser() {
  return apiFetch('/api/v1/users/me', { method: 'DELETE' });
}
