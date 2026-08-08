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
  }).then((res) => res.data.tokens);
}

export function logout() {
  return apiFetch('/api/v1/auth/logout', { method: 'POST' }).then(
    (res) => res.data
  );
}

// 로그인된 내 정보 조회. { id, loginId, nickname } 형태.
export function getMe() {
  return apiFetch('/api/v1/users/me', {
    token: localStorage.getItem('ACCESS_TOKEN_KEY')
  }).then((res) => res.data.myData);
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
