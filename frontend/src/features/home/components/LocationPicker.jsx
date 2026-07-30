import { useEffect, useRef, useState, useCallback } from 'react';
import { createKakaoMap } from '../../../infrastructure/kakao/kakaoMap';
import { createKakaoMarker } from '../../../infrastructure/kakao/kakaoMarker';
import { getAddressFromCoords } from '../../../infrastructure/kakao/kakaoGeocoder';
import './LocationPicker.css';

const DEFAULT_ZOOM_LEVEL = 4;

// 지정된 좌표(초기 위치)에 실제 카카오맵 마커를 올려서 모임 장소를 보여주는 위치 선택기.
// 마커는 draggable이라 사용자가 직접 끌어서 위치를 미세 조정할 수 있고,
// 마커를 놓을 때(dragend)마다 좌표를 역지오코딩해서 주소를 갱신한다.
function LocationPicker({ initialLat, initialLng, onLocationChange }) {
  const containerRef = useRef(null);
  const [address, setAddress] = useState('주소를 확인하는 중...');

  const updateAddressForPosition = useCallback(
    async (position) => {
      try {
        const result = await getAddressFromCoords(position.lat, position.lng);
        setAddress(result || '주소를 찾을 수 없어요');
        onLocationChange({ ...position, address: result });
      } catch {
        setAddress('주소를 찾을 수 없어요');
        onLocationChange({ ...position, address: '' });
      }
    },
    [onLocationChange]
  );

  useEffect(() => {
    if (!window.kakao || !containerRef.current) return;

    const map = createKakaoMap(containerRef.current, {
      center: { lat: initialLat, lng: initialLng },
      level: DEFAULT_ZOOM_LEVEL,
    });

    const marker = createKakaoMarker({
      lat: initialLat,
      lng: initialLng,
      map,
      draggable: true,
      onDragEnd: updateAddressForPosition,
    });
    marker.setMap(map);

    updateAddressForPosition({ lat: initialLat, lng: initialLng });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="location-picker">
      <div className="location-picker__map-wrapper">
        <div className="location-picker__map" ref={containerRef} />
      </div>
      <div className="location-picker__address-bar">
        <span className="location-picker__address-icon" aria-hidden="true">📍</span>
        {address}
      </div>
      <p className="location-picker__hint">마커를 끌어서 모임 장소를 맞춰보세요</p>
    </div>
  );
}

export default LocationPicker;
