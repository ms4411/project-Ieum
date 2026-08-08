import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import { useAuthUser } from '../hooks/useAuthUser';
import { ApiError } from '../../../infrastructure/api/apiClient';
import './AuthForm.css';

function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuthUser();
  const [loginId, setLoginId] = useState('');
  const [nickname, setNickname] = useState('');
  const [pw, setPw] = useState('');
  const [checkPw, setCheckPw] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId.trim() || !nickname.trim() || !pw || !checkPw) return;

    if (pw !== checkPw) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await signUp({
        loginId: loginId.trim(),
        nickname: nickname.trim(),
        pw,
        checkPw,
      });
      navigate('/my-profile');
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : '회원가입에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card box">
        <p className="auth-card__emoji" aria-hidden="true">🌱</p>
        <h1 className="auth-card__title">환영해요, 시작해볼까요?</h1>
        <p className="auth-card__subtitle">몇 가지만 입력하면 바로 시작할 수 있어요</p>

        <form id="signup-form" className="auth-form" onSubmit={handleSubmit}>
          <input
            id="loginId"
            type="text"
            placeholder="아이디를 입력하세요"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input
            id="nickname"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <input
            id="pw"
            type="password"
            placeholder="비밀번호를 입력하세요 (8자 이상)"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
          <input
            id="check-pw"
            type="password"
            placeholder="비밀번호를 재입력하세요"
            value={checkPw}
            onChange={(e) => setCheckPw(e.target.value)}
          />
          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
          <Button
            name={isSubmitting ? '가입 중...' : '회원가입하기'}
            type="submit"
            disabled={isSubmitting}
          />
        </form>

        <Link className="auth-card__link" to="/login">
          이미 계정이 있나요? 로그인으로 이동
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
