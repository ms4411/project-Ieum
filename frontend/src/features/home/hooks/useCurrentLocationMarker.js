import { useRef, useCallback } from 'react';
import { createKakaoMarker } from '../../../infrastructure/kakao/kakaoMarker';
import { panToPosition } from '../../../infrastructure/kakao/kakaoMap';
import { getCurrentPosition } from '../../../infrastructure/browser/geolocation';

// public/ 폴더 자산은 Vite에서 루트 기준 절대경로로 참조해야 한다.
// (원본 코드의 '../public/makerImg.png' 상대경로는 실제로는 동작하지 않는다)
const CURRENT_LOCATION_MARKER_IMAGE = { src: '/makerImg.png', size: 24 };

export function useCurrentLocationMarker(map) {
  const markerRef = useRef(null);

  const moveToCurrentLocation = useCallback(async () => {
    if (!map) return;

    const { lat, lng } = await getCurrentPosition();
    panToPosition(map, lat, lng);

    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    const marker = createKakaoMarker({
      lat,
      lng,
      image: CURRENT_LOCATION_MARKER_IMAGE,
      map,
    });
    marker.setMap(map);
    markerRef.current = marker;
  }, [map]);

  return { moveToCurrentLocation };
}
