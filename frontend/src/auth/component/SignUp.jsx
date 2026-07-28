import { Link } from 'react-router-dom';
import '../../index.css'
import '../componentCss/Login.css'
import Button from '../../common/Button';

function SignUp(){
    return(
        <>
            <div id='login-box' className='box'>
                <h1>회원가입</h1>
                <form id='login-form' action="" method='POST'>
                    <input id="name" type="text" placeholder='아이디를 입력하세요'/>
                    <input id="pw" type="password" placeholder='비밀번호를 입력하세요'/>
                    <input id="check-pw" type="password" placeholder='비밀번호를 재입력하세요'/>
                    <Button name={"제출하기"}/>
                </form>
                <Link to="/Login">로그인으로 이동</Link>
            </div>
        </>
    )
}

export default SignUp;