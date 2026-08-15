import { useRef, useState, useCallback } from 'react';
import Button from '../../../shared/components/Button/Button';
import LocationPicker from './LocationPicker';
import { useKoreaDateTime } from '../hooks/useKoreaDateTime';
import { createGroup } from '../../groups/api/groupsApi';
import { ApiError } from '../../../infrastructure/api/apiClient';
import './PopupScreen.css';
import { uploadImage } from '../../../uploadImages';

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
  const [imgFile, setImgFile]=useState(null);
  const [imgUrl, setImgUrl]=useState('');

  const handleLocationChange = useCallback((nextLocation) => {
    locationRef.current = nextLocation;
  }, []);

  const handleImgChange = async (file) => {
  // 1. 선택된 파일 객체를 State에 보관
  setImgFile(file);

  // 2. 파일이 없거나 선택을 취소한 경우 -> 기본 이미지 URL 설정 후 종료
  if (!file) {
    setImgUrl("https://scljvmfyshmfdnlqgftz.supabase.co/storage/v1/object/public/images/common.jpg");
    return;
  }

  // 3. 파일이 정상적으로 선택된 경우 -> Supabase 업로드 실행
  try {
    // 🚨 State(imgFile) 대신 매개변수로 받은 'file'을 직접 넘겨주어야 합니다!
    const uploadImg = await uploadImage(file); 
    setImgUrl(uploadImg);
  } catch (error) {
    console.error("이미지 업로드 실패:", error);
    setErrorMessage("이미지 업로드에 실패했습니다.");
  }
};

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
        imgUrl: imgUrl,
        maxMemberCnt: Number(maxMemberCnt),
        lat: locationRef.current.lat,
        lng: locationRef.current.lng,
        address: locationRef.current.address,
        meetAt: `${meetDate}T${meetTime}:00`,
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
            id='file-input'
            style={{ '--bg-url': `url(${imgUrl})` }}
            type='file'
            accept='.jpg, .png, .svg'
            onChange={(e)=>handleImgChange(e.target.files[0]|| null)}
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
