import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import PopupScreen from './PopupScreen';
import { useCreateGroupPopup } from '../hooks/useCreateGroupPopup';
import { useAuthUser } from '../../auth';
import './BottomMenu.css';

function BottomMenu({ onMoveToCurrentLocation, onGroupCreated }) {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthUser();
  const { isOpen, latLng, openCreateGroupPopup, closeCreateGroupPopup } =
    useCreateGroupPopup();

  // 모임 생성은 로그인한 사용자만 가능하다(백엔드가 Authorization 헤더를 요구).
  // isLoading이 true인 동안(로그인 상태 복구 중)은 아직 "로그인 안 함"으로
  // 단정할 수 없으므로 판단을 보류한다 — 그렇지 않으면 실제로는 로그인돼
  // 있는데도 복구가 끝나기 전에 클릭하면 로그인 화면으로 튕겨나간다.
  const handleCreateGroupClick = () => {
    if (isLoading) return;
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
