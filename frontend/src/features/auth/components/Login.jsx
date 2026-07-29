import { Link } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import './AuthForm.css';

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 로그인 API 연동
  };

  return (
    <div id="login-box" className="box">
      <h1>로그인</h1>
      <form id="login-form" onSubmit={handleSubmit}>
        <input id="name" type="text" placeholder="아이디를 입력하세요" />
        <input id="pw" type="password" placeholder="비밀번호를 입력하세요" />
        <Button name="제출하기" />
      </form>
      <Link to="/signup">회원가입하기</Link>
    </div>
  );
}

export default Login;
