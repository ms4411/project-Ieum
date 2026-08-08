import { useRef, useState, useCallback } from 'react';
import Button from '../../../shared/components/Button/Button';
import LocationPicker from './LocationPicker';
import { useKoreaDateTime } from '../hooks/useKoreaDateTime';
import { createGroup } from '../../groups/api/groupsApi';
import { ApiError } from '../../../infrastructure/api/apiClient';
import './PopupScreen.css';

function PopupScreen({ lat, lng, onClose, onCreated }) {
  // LocationPicker가 자체적으로 주소를 화면에 표시하므로, 여기서는 리렌더링이
  // 필요 없는 최신 좌표+주소만 ref에 보관해두었다가 제출 시 사용한다.
  const locationRef = useRef({ lat, lng, address: '' });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [maxMemberCnt, setMaxMemberCnt] = useState('');
  const { date, time } = useKoreaDateTime();
  const [meetDate, setMeetDate] = useState(date);
  const [meetTime, setMeetTime] = useState(time);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationChange = useCallback((nextLocation) => {
    locationRef.current = nextLocation;
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !maxMemberCnt || !meetDate || !meetTime) {
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await createGroup({
        title: title.trim(),
        content: content.trim(),
        imgUrl: null,
        maxMemberCnt: Number(maxMemberCnt),
        lat: locationRef.current.lat,
        lng: locationRef.current.lng,
        address: locationRef.current.address,
        meatAt: `${meetDate}T${meetTime}:00`,
      });
      onCreated?.();
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : '모임 생성에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <input
            required
            placeholder="제목을 입력해 주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            required
            rows={5}
            placeholder="내용을 입력해주세요"
            style={{ resize: 'none' }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            min={1}
            required
            placeholder="최대 사람 수를 입력해 주세요"
            type="number"
            value={maxMemberCnt}
            onChange={(e) => setMaxMemberCnt(e.target.value)}
          />
          <div className="popup-datetime-row">
            <input
              required
              type="date"
              value={meetDate}
              onChange={(e) => setMeetDate(e.target.value)}
            />
            <input
              required
              type="time"
              value={meetTime}
              onChange={(e) => setMeetTime(e.target.value)}
            />
          </div>
          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}
          <Button
            name={isSubmitting ? '생성 중...' : '제출하기'}
            type="submit"
            disabled={isSubmitting}
          />
          <a onClick={onClose}>모임 생성 취소하기</a>
        </form>
      </div>
    </div>
  );
}

export default PopupScreen;
