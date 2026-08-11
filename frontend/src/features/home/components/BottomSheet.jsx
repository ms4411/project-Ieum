import { useEffect, useRef, useState } from 'react';
import Group from './Group';
import './BottomSheet.css';

function BottomSheet({ groups, selectedGroup }) {
  const [isSheetUp, setIsSheetUp] = useState(false);
  const listRef = useRef(null);

  const toggleSheet = () => setIsSheetUp((prev) => !prev);

  const sheetStyle = {
    transform: isSheetUp ? 'translateY(0)' : 'translateY(calc(100% - 50px))',
  };

  // 지도에서 마커를 누르면(selectedGroup이 갱신되면) 시트를 펼치고, 해당 모임이
  // 화면에 보이는 최소한만 스크롤한다 — 아래에 가려져 있으면 li 하단까지,
  // 위로 가려져 있으면 li 상단까지만(scrollIntoView의 'nearest'가 정확히 이 동작).
  useEffect(() => {
    if (!selectedGroup) return;
    setIsSheetUp(true);

    // 시트가 올라오는 트랜지션(0.5s) 도중에 스크롤 위치를 계산하면 어긋날 수 있어,
    // 트랜지션이 끝난 뒤 스크롤한다.
    const timer = setTimeout(() => {
      const target = listRef.current?.querySelector(
        `#group-item-${selectedGroup.group.id}`
      );
      target?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 520);

    return () => clearTimeout(timer);
  }, [selectedGroup]);

  return (
    <div id="bottom-sheet" className="box" onClick={toggleSheet} style={sheetStyle}>
      <hr />
      <ul id="group-list" ref={listRef}>
        {groups.map((group) => (
          <Group key={group.id ?? group.title} group={group} />
        ))}
      </ul>
    </div>
  );
}

export default BottomSheet;
