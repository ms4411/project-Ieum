import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import { useAuthUser } from '../hooks/useAuthUser';
import { ApiError } from '../../../infrastructure/api/apiClient';
import './AuthForm.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthUser();
  const [loginId, setLoginId] = useState('');
  const [pw, setPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !pw) return;

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      // login()이 로그인 → 토큰 저장 → 내 정보 조회(getMe)까지 마친 뒤에 resolve되므로,
      // 여기 도달한 시점엔 이미 사용자 정보를 읽어온 상태다. 홈 화면으로 자동 이동한다.
      await login(loginId.trim(), pw);
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : '로그인에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="auth-screen">
      <div className="auth-card box">
        <p className="auth-card__emoji" aria-hidden="true">👋</p>
        <h1 className="auth-card__title">다시 만나서 반가워요</h1>
        <p className="auth-card__subtitle">로그인하고 모임을 이어가 보세요</p>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
          <input
            id="loginId"
            type="text"
            placeholder="아이디를 입력하세요"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input
            id="pw"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
          <Button
            name={isSubmitting ? '로그인 중...' : '로그인하기'}
            type="submit"
            disabled={isSubmitting}
          />
        </form>

        <Link className="auth-card__link" to="/signup">
          아직 계정이 없나요? 회원가입하기
        </Link>
      </div>
    </div>
  );
}

export default Login;
