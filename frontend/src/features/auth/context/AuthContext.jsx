import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import * as authApi from '../api/authApi';
import {
  getAccessToken,
  setTokens,
  clearTokens,
} from '../../../infrastructure/api/tokenStorage';
import { setUnauthorizedHandler } from '../../../infrastructure/api/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 앱이 처음 켜졌을 때 저장된 토큰으로 로그인 상태를 복구하는 동안의 로딩 상태.
  // 이 값이 true인 동안은 "로그인 안 한 사용자"로 단정할 수 없다.
  const [isLoading, setIsLoading] = useState(true);

  // accessToken 재발급까지 실패해서 완전히 로그아웃 처리해야 할 때
  // apiClient가 호출해주는 콜백을 등록해둔다.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // 새로고침 등으로 앱이 다시 켜졌을 때, 저장된 accessToken이 있으면
  // 내 정보를 조회해서 로그인 상태를 복구한다.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        if (!cancelled) setUser(me);
      } catch {
        clearTokens();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (loginId, pw) => {
    const tokens = await authApi.login({ loginId, pw });
    setTokens(tokens);
    const me = await authApi.getMe();
    setUser(me);
    return me;
  }, []);

  const signUp = useCallback(
    async ({ loginId, pw, checkPw, nickname }) => {
      await authApi.signUp({ loginId, pw, checkPw, nickname });
      // 회원가입 API는 토큰을 내려주지 않으므로, 가입 직후 바로 로그인까지 이어서 처리한다.
      return login(loginId, pw);
    },
    [login]
  );

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) await authApi.logout();
    } catch {
      // 서버 로그아웃이 실패해도(이미 만료된 토큰 등) 클라이언트 쪽은 정리한다.
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const updateNickname = useCallback(async (nickname) => {
    await authApi.updateNickname(nickname);
    setUser((prev) => (prev ? { ...prev, nickname } : prev));
  }, []);

  const withdraw = useCallback(async () => {
    await authApi.deleteUser();
    clearTokens();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    login,
    signUp,
    logout,
    updateNickname,
    withdraw,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthUser는 AuthProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
