import { useRef, useCallback } from 'react';
import Button from '../../../shared/components/Button/Button';
import LocationPicker from './LocationPicker';
import './PopupScreen.css';

function PopupScreen({ lat, lng, onClose }) {
  // LocationPicker가 자체적으로 주소를 화면에 표시하므로, 여기서는 리렌더링이
  // 필요 없는 최신 좌표+주소만 ref에 보관해두었다가 제출 시 사용한다.
  const locationRef = useRef({ lat, lng, address: '' });

  const handleLocationChange = useCallback((nextLocation) => {
    locationRef.current = nextLocation;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 모임 생성 API 연동. locationRef.current(선택된 좌표+주소)를 함께 전송한다.
  };

  return (
    <div id="background" onClick={onClose}>
      <div id="popup" className="box" onClick={(e) => e.stopPropagation()}>
        <div id="popup-handle" aria-hidden="true" />
        <h1 className="popup-title">모임 생성</h1>
        <form id="group-form" onSubmit={handleSubmit}>
          <LocationPicker
            initialLat={lat}
            initialLng={lng}
            onLocationChange={handleLocationChange}
          />
          <input required placeholder="제목을 입력해 주세요" />
          <textarea
            required
            rows={5}
            placeholder="내용을 입력해주세요"
            style={{ resize: 'none' }}
          />
          <input
            min={1}
            required
            placeholder="최대 사람 수를 입력해 주세요"
            type="number"
          />
          <Button name="제출하기" type="submit" />
          <a onClick={onClose}>모임 생성 취소하기</a>
        </form>
      </div>
    </div>
  );
}

export default PopupScreen;
