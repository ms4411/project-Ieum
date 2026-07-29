import { useState, useEffect } from 'react';
import Group from './Group';
import './BottomSheet.css';

// TODO: 실제 모임 목록 조회 API 연동 전까지 사용하는 임시(mock) 데이터.
// API 연동 시 이 useEffect 블록은 features/home/api 쪽 fetch 로직으로 대체한다.
const MOCK_GROUP = {
  name: 'wls이네 집',
  content: '집',
  imgUrl: '/favicon.svg',
};

function BottomSheet({ groups, setGroups }) {
  const [isSheetUp, setIsSheetUp] = useState(false);

  const toggleSheet = () => setIsSheetUp((prev) => !prev);

  const sheetStyle = {
    transform: isSheetUp ? 'translateY(0)' : 'translateY(calc(100% - 50px))',
  };

  useEffect(() => {
    setGroups((prevGroups) => [...prevGroups, MOCK_GROUP]);
  }, [setGroups]);

  return (
    <div id="bottom-sheet" className="box" onClick={toggleSheet} style={sheetStyle}>
      <hr />
      <ul id="group-list">
        {groups.map((group, index) => (
          <Group key={index} group={group} />
        ))}
      </ul>
    </div>
  );
}

export default BottomSheet;
