import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

// TODO: 실제 로그인 상태 관리(전역 인증 Context + 서버 세션 검증/토큰)로 교체.
// 백엔드 연동 전까지는 로그인 상태를 localStorage에만 저장하는 mock 구현이다.
const STORAGE_KEY = 'mock-auth-user';

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage 접근이 막힌 환경(프라이빗 브라우징 등)에서는 조용히 무시한다.
    }
  }, [user]);

  // TODO: 실제 로그인 API 연동. 지금은 입력한 아이디를 그대로 닉네임으로 사용한다.
  const login = useCallback((name) => setUser({ name }), []);

  const logout = useCallback(() => setUser(null), []);

  const updateNickname = useCallback((name) => {
    setUser((prev) => (prev ? { ...prev, name } : prev));
  }, []);

  // TODO: 실제 회원 탈퇴 API 연동.
  const withdraw = useCallback(() => setUser(null), []);

  const value = { user, login, logout, updateNickname, withdraw };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthUser는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
