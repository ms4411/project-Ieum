import { Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '../features/home';
import { Login, SignUp, MyProfile, AuthProvider } from '../features/auth';
import { MyGroups, GroupDetail } from '../features/groups';
import BottomNav from '../shared/components/BottomNav/BottomNav';

// 하단 탭(모임/참여한 모임/마이프로필)이 있는 "메인" 화면에서만 BottomNav를 보여준다.
// 로그인/회원가입/모임 상세처럼 별도로 진입하는 화면에서는 숨긴다.
const MAIN_TAB_PATHS = ['/', '/my-groups', '/my-profile'];

function AppRoutes() {
  const location = useLocation();
  const showBottomNav = MAIN_TAB_PATHS.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/my-groups" element={<MyGroups />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/groups/:groupId" element={<GroupDetail />} />
      </Routes>

      {showBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
