import { Link } from 'react-router-dom';
import '../../index.css'
import '../componentCss/Login.css'
import Button from '../../common/Button';

function Login(){
    return(
        <>
            <div id='login-box' className='box'>
                <h1>로그인</h1>
                <form id='login-form' action="">
                    <input id="name" type="text" placeholder='아이디를 입력하세요'/>
                    <input id="pw" type="password" placeholder='비밀번호를 입력하세요'/>
                    <input id="check-pw" type="password" placeholder='비밀번호를 다시 한번 입력하세요'/>
                    <Button name={"제출하기"}/>
                </form>
                <Link to="/SignUp">회원가입하기</Link>
            </div>
        </>
    )
}

export default Login;