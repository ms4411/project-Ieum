import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import { useAuthUser } from '../hooks/useAuthUser';
import './AuthForm.css';

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuthUser();
  const [name, setName] = useState('');

  // TODO: 실제 회원가입 API 연동. 백엔드 연동 전까지는 가입과 동시에
  // 입력한 아이디를 닉네임으로 사용해 바로 로그인 처리한다.
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
        <p className="auth-card__emoji" aria-hidden="true">🌱</p>
        <h1 className="auth-card__title">환영해요, 시작해볼까요?</h1>
        <p className="auth-card__subtitle">몇 가지만 입력하면 바로 시작할 수 있어요</p>

        <form id="signup-form" className="auth-form" onSubmit={handleSubmit}>
          <input
            id="name"
            type="text"
            placeholder="아이디를 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input id="pw" type="password" placeholder="비밀번호를 입력하세요" />
          <input id="check-pw" type="password" placeholder="비밀번호를 재입력하세요" />
          <Button name="회원가입하기" type="submit" />
        </form>

        <Link className="auth-card__link" to="/login">
          이미 계정이 있나요? 로그인으로 이동
        </Link>
      </div>
    </div>
  );
}

export default SignUp;
