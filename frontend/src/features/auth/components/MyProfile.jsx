import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import { useAuthUser } from '../hooks/useAuthUser';
import './MyProfile.css';

function MyProfile() {
  const navigate = useNavigate();
  const { user, isLoading, logout, updateNickname, withdraw } = useAuthUser();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // BottomNav를 거치지 않고 주소로 바로 들어온 경우를 대비한 안전장치.
  // (BottomNav는 로그인 여부에 따라 /login과 /my-profile을 구분해서 보내준다.)
  // 새로고침 직후에는 저장된 토큰으로 로그인 상태를 복구하는 중일 수 있으므로,
  // 그 확인(isLoading)이 끝난 뒤에도 user가 없을 때만 로그인 화면으로 보낸다.
  useEffect(() => {
    if (!isLoading && !user) 
      navigate('/login', { replace: true });
  }, [isLoading, user, navigate]);

  if (isLoading || !user) return null;

  const startEditingNickname = () => {
    setNicknameInput(user.nickname);
    setErrorMessage('');
    setIsEditingNickname(true);
  };

  const handleSaveNickname = async (e) => {
    e.preventDefault();
    const trimmed = nicknameInput.trim();
    if (!trimmed) return;
    try {
      await updateNickname(trimmed);
      setIsEditingNickname(false);
    } catch {
      setErrorMessage('닉네임 변경에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      '정말 탈퇴하시겠어요? 계정 정보가 모두 삭제되고 되돌릴 수 없어요.'
    );
    if (!confirmed) return;

    try {
      await withdraw();
      navigate('/');
    } catch {
      setErrorMessage('회원 탈퇴에 실패했습니다.');
    }
  };

  return (
    <div className="my-profile-screen">
      <div className="my-profile-screen__header">
        <button
          type="button"
          className="my-profile-screen__back"
          aria-label="홈으로 돌아가기"
          onClick={() => navigate('/')}
        >
          ←
        </button>
        <h1 className="my-profile-screen__title">마이프로필</h1>
      </div>

      <div className="my-profile-screen__card box">
        <p className="my-profile-screen__avatar" aria-hidden="true">
          {user.nickname.charAt(0)}
        </p>

        {isEditingNickname ? (
          <form
            className="my-profile-screen__nickname-form"
            onSubmit={handleSaveNickname}
          >
            <input
              type="text"
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              placeholder="닉네임을 입력하세요"
              autoFocus
            />
            <div className="my-profile-screen__nickname-actions">
              <Button
                name="취소"
                type="button"
                variant="outline"
                onClick={() => setIsEditingNickname(false)}
              />
              <Button name="저장" type="submit" />
            </div>
            {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
          </form>
        ) : (
          <>
            <p className="my-profile-screen__nickname">{user.nickname}님</p>
            <button
              type="button"
              className="my-profile-screen__edit-link"
              onClick={startEditingNickname}
            >
              닉네임 변경
            </button>
          </>
        )}
      </div>

      <div className="my-profile-screen__actions">
        <Button name="로그아웃" variant="outline" onClick={handleLogout} />
        <button
          type="button"
          className="my-profile-screen__withdraw"
          onClick={handleWithdraw}
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

export default MyProfile;
