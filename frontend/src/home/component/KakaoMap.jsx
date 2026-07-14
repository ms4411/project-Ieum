import { useEffect, useRef, useState } from 'react';
import PopupScreen from './PopupScreen'

function KakaoMap({ setMapObject}) {
  const container = useRef(null);
  let popupElement=null

  useEffect(() => {
    const { kakao } = window;
    if (kakao && container.current) {
      const map = new kakao.maps.Map(container.current, {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
      });

      setMapObject(map); // 부모한테 지도 던져주기
    }
  }, [setMapObject]);

  return (
    <>
      <div ref={container} style={{ width: '100%', height: '100%' }} />
    </>
  );
}

export default KakaoMap