import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import { useAuthUser } from '../hooks/useAuthUser';
import './MyProfile.css';

function MyProfile() {
  const navigate = useNavigate();
  const { user, logout, updateNickname, withdraw } = useAuthUser();
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');

  // BottomNav를 거치지 않고 주소로 바로 들어온 경우를 대비한 안전장치.
  // (BottomNav는 로그인 여부에 따라 /login과 /my-profile을 구분해서 보내준다.)
  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const startEditingNickname = () => {
    setNicknameInput(user.name);
    setIsEditingNickname(true);
  };

  const handleSaveNickname = (e) => {
    e.preventDefault();
    const trimmed = nicknameInput.trim();
    if (!trimmed) return;
    updateNickname(trimmed);
    setIsEditingNickname(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleWithdraw = () => {
    const confirmed = window.confirm(
      '정말 탈퇴하시겠어요? 계정 정보가 모두 삭제되고 되돌릴 수 없어요.'
    );
    if (!confirmed) return;

    withdraw();
    navigate('/');
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
          {user.name.charAt(0)}
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
          </form>
        ) : (
          <>
            <p className="my-profile-screen__nickname">{user.name}님</p>
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
