import { useState, useCallback } from 'react';
import { getCurrentPosition } from '../../../infrastructure/browser/geolocation';

// BottomMenu, Menubar에서 중복되던 "현재 위치를 가져와 모임 생성 팝업을 연다"
// 로직을 하나의 훅으로 추출했다.
export function useCreateGroupPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [latLng, setLatLng] = useState({ lat: 0, lng: 0 });

  const openCreateGroupPopup = useCallback(async () => {
    const position = await getCurrentPosition();
    setLatLng(position);
    setIsOpen(true);
  }, []);

  const closeCreateGroupPopup = useCallback(() => setIsOpen(false), []);

  return { isOpen, latLng, openCreateGroupPopup, closeCreateGroupPopup };
}
