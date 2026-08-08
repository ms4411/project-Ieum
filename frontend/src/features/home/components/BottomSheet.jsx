import { useState } from 'react';
import Group from './Group';
import './BottomSheet.css';

function BottomSheet({ groups }) {
  const [isSheetUp, setIsSheetUp] = useState(false);

  const toggleSheet = () => setIsSheetUp((prev) => !prev);

  const sheetStyle = {
    transform: isSheetUp ? 'translateY(0)' : 'translateY(calc(100% - 50px))',
  };

  return (
    <div id="bottom-sheet" className="box" onClick={toggleSheet} style={sheetStyle}>
      <hr />
      <ul id="group-list">
        {groups.map((group) => (
          <Group key={group.id ?? group.title} group={group} />
        ))}
      </ul>
    </div>
  );
}

export default BottomSheet;
