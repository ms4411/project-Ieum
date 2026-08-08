import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import PopupScreen from './PopupScreen';
import { useCreateGroupPopup } from '../hooks/useCreateGroupPopup';
import { useAuthUser } from '../../auth';
import './BottomMenu.css';

function BottomMenu({ onMoveToCurrentLocation, onGroupCreated }) {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const { isOpen, latLng, openCreateGroupPopup, closeCreateGroupPopup } =
    useCreateGroupPopup();

  // 모임 생성은 로그인한 사용자만 가능하다(백엔드가 Authorization 헤더를 요구).
  const handleCreateGroupClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    openCreateGroupPopup();
  };

  return (
    <>
      <div id="bottom-menu">
        <Button img="/svg/내위치.svg" onClick={onMoveToCurrentLocation} />
        <Button img="/svg/plusBtn.svg" onClick={handleCreateGroupClick} />
      </div>

      {isOpen && (
        <PopupScreen
          lat={latLng.lat}
          lng={latLng.lng}
          onClose={closeCreateGroupPopup}
          onCreated={() => {
            closeCreateGroupPopup();
            onGroupCreated?.();
          }}
        />
      )}
    </>
  );
}

export default BottomMenu;
