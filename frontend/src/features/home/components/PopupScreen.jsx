import { useState, useEffect } from 'react';
import Button from '../../../shared/components/Button/Button';
import { getAddressFromCoords } from '../../../infrastructure/kakao/kakaoGeocoder';
import './PopupScreen.css';

function PopupScreen({ lat, lng, onClose }) {
  const [address, setAddress] = useState('');

  // 원본 코드는 렌더링 중에 geocoder를 호출하고 그 안에서 setState를 실행해
  // 렌더마다 부수효과가 발생했다. useEffect로 옮기고 lat/lng가 바뀔 때만 실행되게 했다.
  useEffect(() => {
    let isCancelled = false;

    getAddressFromCoords(lat, lng)
      .then((result) => {
        if (!isCancelled) setAddress(result);
      })
      .catch(() => {
        if (!isCancelled) setAddress('');
      });

    return () => {
      isCancelled = true;
    };
  }, [lat, lng]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 모임 생성 API 연동 (infrastructure/api 계층 추가 후 연결)
  };

  return (
    <div id="background">
      <div id="popup">
        <h1 style={{ textAlign: 'center' }}>모임 생성</h1>
        <form id="group-form" onSubmit={handleSubmit}>
          <input type="text" value={address} readOnly />
          <input required placeholder="제목을 입력해 주세요" />
          <textarea
            required
            rows={10}
            placeholder="내용을 입력해주세요"
            style={{ resize: 'none' }}
          />
          <input
            min={1}
            required
            placeholder="최대 사람 수를 입력해 주세요"
            type="number"
          />
          <Button name="제출하기" />
          <a onClick={onClose}>모임 생성 취소하기</a>
        </form>
      </div>
    </div>
  );
}

export default PopupScreen;
