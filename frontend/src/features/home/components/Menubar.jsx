import './Menubar.css';

// 로그인/회원가입/내 모임/마이프로필처럼 다른 화면으로 이동하는 메뉴는
// 하단 BottomNav(모임/참여한 모임/마이프로필)로 옮겼고,
// 이 화면(지도)과 직접 관련된 컨트롤만 여기 남긴다.
//
// 검색어/날짜·시간 필터 상태는 Home이 들고 있다가 useNearbyGroups에 그대로
// 넘겨주므로, 이 컴포넌트는 순수하게 입력 UI만 담당한다.
function Menubar({
  keyword,
  onKeywordChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  isTimeFilterOn,
  onToggleTimeFilter,
  onResetDateTime,
}) {
  return (
    <div id="menubar">
      <div id="menubar-top-row">
        <input
          type="text"
          placeholder="모임 이름으로 검색"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>

      <div id="datetime-row">
        <label id="datetime-filter-toggle">
          <input
            type="checkbox"
            checked={isTimeFilterOn}
            onChange={(e) => onToggleTimeFilter(e.target.checked)}
          />
          시간 필터
        </label>
        <div id="datetime-input">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            disabled={!isTimeFilterOn}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            disabled={!isTimeFilterOn}
          />
        </div>
        <button type="button" id="reset-datetime-btn" onClick={onResetDateTime}>
          현재 시각
        </button>
      </div>
    </div>
  );
}

export default Menubar;
