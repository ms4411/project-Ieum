import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../../features/auth';
import './BottomNav.css';

// 앱 전체에서 쓰는 하단 탭 메뉴: 모임 / 참여한 모임 / 마이프로필.
// "마이프로필"은 로그인 여부에 따라 이동할 곳이 달라지므로(로그인 화면 vs 프로필 화면)
// react-router-dom의 NavLink 대신 직접 navigate로 분기한다.
function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthUser();

  const isActive = (path) => location.pathname === path;

  const goToProfile = () => {
    navigate(user ? '/my-profile' : '/login');
  };

  return (
    <nav id="bottom-nav">
      <button
        type="button"
        className={`bottom-nav__item${isActive('/') ? ' bottom-nav__item--active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span className="bottom-nav__icon" aria-hidden="true">🗺️</span>
        <span className="bottom-nav__label">모임</span>
      </button>

      <button
        type="button"
        className={`bottom-nav__item${isActive('/my-groups') ? ' bottom-nav__item--active' : ''}`}
        onClick={() => navigate('/my-groups')}
      >
        <span className="bottom-nav__icon" aria-hidden="true">🙋</span>
        <span className="bottom-nav__label">참여한 모임</span>
      </button>

      <button
        type="button"
        className={`bottom-nav__item${isActive('/my-profile') ? ' bottom-nav__item--active' : ''}`}
        onClick={goToProfile}
      >
        <span className="bottom-nav__icon" aria-hidden="true">
          {user ? user.name.charAt(0) : '👤'}
        </span>
        <span className="bottom-nav__label">마이프로필</span>
      </button>
    </nav>
  );
}

export default BottomNav;
