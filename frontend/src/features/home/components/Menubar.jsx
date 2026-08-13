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
  lastAtDate,
  onLastAtDateChange,
  lastAtTime,
  onLastAtTimeChange,
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


      {//날짜 
      }
      <div className="datetime-row box">
      <button
        type="button"
        className={`datetime-filter-toggle${isTimeFilterOn ? ' is-on' : ''}`}
        aria-pressed={isTimeFilterOn}
        onClick={() => onToggleTimeFilter(!isTimeFilterOn)}
      >
        <span className="datetime-filter-toggle__dot" aria-hidden="true" />
        시간 필터
      </button>

      {/* 꺼져 있을 땐 입력란을 아예 렌더링하지 않는다 — 한 줄에 라벨+입력+버튼을
          다 욱여넣지 않아도 되므로 좁은 화면에서 잘려나가는 문제도 함께 없어진다. */}
      {isTimeFilterOn && (
        <>
          <div id='datetime-controller'>
            <div className="datetime-fields">
              <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
              <input type="time" value={time} onChange={(e) => onTimeChange(e.target.value)} />
            </div>
            <p>~</p>
            <div className="datetime-fields">
              <input type="date" value={lastAtDate} onChange={(e) => onLastAtDateChange(e.target.value)} />
              <input type="time" value={lastAtTime} onChange={(e) => onLastAtTimeChange(e.target.value)} />
            </div>
          </div>
          <button type="button" className="reset-datetime-btn" onClick={onResetDateTime}>
            현재 시각
          </button>
        </>
      )}
    </div>

    </div>
  );
}

export default Menubar;
