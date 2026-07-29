import Button from '../../../shared/components/Button/Button';
import PopupScreen from './PopupScreen';
import { useCreateGroupPopup } from '../hooks/useCreateGroupPopup';
import './BottomMenu.css';

function BottomMenu({ onMoveToCurrentLocation }) {
  const { isOpen, latLng, openCreateGroupPopup, closeCreateGroupPopup } =
    useCreateGroupPopup();

  return (
    <>
      <div id="bottom-menu">
        <Button img="/svg/내위치.svg" onClick={onMoveToCurrentLocation} />
        <Button img="/svg/plusBtn.svg" onClick={openCreateGroupPopup} />
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

export default BottomMenu;
