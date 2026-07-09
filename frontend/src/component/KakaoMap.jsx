import { useEffect, useRef, useState } from 'react';
import PopupScreen from './PopupScreen'

function KakaoMap({ setMapObject, createMarker}) {
  const container = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [latLng, setlatLng] = useState(null);
  let popupElement=null

  useEffect(() => {
    const { kakao } = window;
    if (kakao && container.current) {
      const map = new kakao.maps.Map(container.current, {
        center: new kakao.maps.LatLng(37.5665, 126.9780),
        level: 3
      });

      // 지도 클릭시 마커 생성
      kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
        // 클릭한 위치의 위도 경도 좌표를 가져옵니다
        const latlng = mouseEvent.latLng; 
        setlatLng(latlng)
        setIsOpen(true)
      });

      setMapObject(map); // 부모한테 지도 던져주기
    }
  }, [setMapObject]);

  return (
    <>
      <div ref={container} style={{ width: '100%', height: '100%' }} />
      {isOpen && (
        <PopupScreen lat={latLng.getLat()} lng={latLng.getLng()}/>
      )}
    </>
  );
}

export default KakaoMap