import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import './ProfileButton.css';

// 화면 구석(상단)에 고정되는 프로필 진입점.
// 로그인/회원가입/내 모임처럼 "현재 화면과 상관없이 다른 곳으로 이동하는" 메뉴를
// 지도 조작 버튼들과 분리해 이 안에 모아둔다.
function ProfileButton() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const goTo = (path) => {
    closeMenu();
    navigate(path);
  };

  return (
    <div className="profile-button">
      <button
        type="button"
        className="profile-button__avatar"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="프로필 메뉴"
      >
        {user ? user.name.charAt(0) : '👤'}
      </button>

      {isMenuOpen && (
        <>
          <button
            type="button"
            className="profile-button__backdrop"
            aria-label="메뉴 닫기"
            onClick={closeMenu}
          />
          <div className="profile-button__menu" role="menu">
            {user ? (
              <>
                <p className="profile-button__greeting">{user.name}님</p>
                <button type="button" role="menuitem" onClick={() => goTo('/my-groups')}>
                  내 모임
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    // TODO: 실제 로그아웃 처리 연동
                    closeMenu();
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button type="button" role="menuitem" onClick={() => goTo('/login')}>
                  로그인
                </button>
                <button type="button" role="menuitem" onClick={() => goTo('/signup')}>
                  회원가입
                </button>
                <button type="button" role="menuitem" onClick={() => goTo('/my-groups')}>
                  내 모임
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileButton;
