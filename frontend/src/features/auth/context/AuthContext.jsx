import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
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

  // 아래 세션 복구 effect는 앱이 처음 켜질 때 딱 한 번 실행되는 비동기 작업이다.
  // 그런데 이 응답이 오기 전에 사용자가 로그인/로그아웃 같은 "더 최신" 인증 액션을
  // 끝내버리면, 뒤늦게 도착하는 낡은 복구 결과가 방금 로그인한 상태를 덮어써서
  // "로그인했는데도 다시 로그인하라고 함" 버그가 생긴다. login/logout/withdraw가
  // 호출될 때마다 세대를 올리고, 복구 effect는 자기 세대가 최신일 때만 상태를 반영한다.
  const authGenerationRef = useRef(0);

  // accessToken 재발급까지 실패해서 완전히 로그아웃 처리해야 할 때
  // apiClient가 호출해주는 콜백을 등록해둔다.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // 새로고침 등으로 앱이 다시 켜졌을 때, 저장된 accessToken이 있으면
  // 내 정보를 조회해서 로그인 상태를 복구한다.
  useEffect(() => {
    const generation = authGenerationRef.current;
    let cancelled = false;
    (async () => {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        if (!cancelled && authGenerationRef.current === generation) {
          setUser(me);
        }
      } catch {
        if (!cancelled && authGenerationRef.current === generation) {
          clearTokens();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (loginId, pw) => {
    authGenerationRef.current += 1;
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
    authGenerationRef.current += 1;
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
    authGenerationRef.current += 1;
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
