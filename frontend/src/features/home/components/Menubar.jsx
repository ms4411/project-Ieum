import { useKoreaDateTime } from '../hooks/useKoreaDateTime';
import './Menubar.css';

// 로그인/회원가입/내 모임/마이프로필처럼 다른 화면으로 이동하는 메뉴는
// 하단 BottomNav(모임/참여한 모임/마이프로필)로 옮겼고,
// 이 화면(지도)과 직접 관련된 컨트롤만 여기 남긴다.
function Menubar() {
  const { date, setDate, time, setTime, resetToNow } = useKoreaDateTime();

  return (
    <div id="menubar">
      <div id="menubar-top-row">
        <input type="text" placeholder="검색창" />
      </div>

      <div id="datetime-row">
        <div id="datetime-input">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <button type="button" id="reset-datetime-btn" onClick={resetToNow}>
          현재 시각
        </button>
      </div>
    </div>
  );
}

export default Menubar;
