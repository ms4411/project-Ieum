import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import { useAuthUser } from '../hooks/useAuthUser';
import './AuthForm.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuthUser();
  const [name, setName] = useState('');

  // TODO: 실제 로그인 API 연동. 백엔드 연동 전까지는 입력한 아이디를 그대로
  // 닉네임으로 사용해 로그인 처리한다.
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    login(trimmedName);
    navigate('/my-profile');
  };

  return (
    <div className="auth-screen">
      <div className="auth-card box">
        <p className="auth-card__emoji" aria-hidden="true">👋</p>
        <h1 className="auth-card__title">다시 만나서 반가워요</h1>
        <p className="auth-card__subtitle">로그인하고 모임을 이어가 보세요</p>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
          <input
            id="name"
            type="text"
            placeholder="아이디를 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input id="pw" type="password" placeholder="비밀번호를 입력하세요" />
          <Button name="로그인하기" type="submit" />
        </form>

        <Link className="auth-card__link" to="/signup">
          아직 계정이 없나요? 회원가입하기
        </Link>
      </div>
    </div>
  );
}

export default Login;
