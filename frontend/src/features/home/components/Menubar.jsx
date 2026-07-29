import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import PopupScreen from './PopupScreen';
import { useCreateGroupPopup } from '../hooks/useCreateGroupPopup';
import { useKoreaDateTime } from '../hooks/useKoreaDateTime';
import './Menubar.css';

function Menubar({ onMoveToCurrentLocation }) {
  const navigate = useNavigate();
  const { date, setDate, time, setTime, resetToNow } = useKoreaDateTime();
  const { isOpen, latLng, openCreateGroupPopup, closeCreateGroupPopup } =
    useCreateGroupPopup();

  return (
    <>
      <div id="menubar">
        <input type="text" placeholder="검색창" />

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

        <div id="btn-list">
          <Button name="로그인" onClick={() => navigate('/login')} />
          <Button name="내 위치" onClick={onMoveToCurrentLocation} />
          <Button name="모임 생성" onClick={openCreateGroupPopup} />
          <Button name="현재 시각" onClick={resetToNow} />
        </div>
      </div>

      {isOpen && (
        <PopupScreen
          lat={latLng.lat}
          lng={latLng.lng}
          onClose={closeCreateGroupPopup}
        />
      )}
    </>
  );
}

export default Menubar;
