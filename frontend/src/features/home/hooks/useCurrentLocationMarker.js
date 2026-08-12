import { useRef, useCallback, useEffect } from 'react';
import { createKakaoMarker } from '../../../infrastructure/kakao/kakaoMarker';
import { panToPosition } from '../../../infrastructure/kakao/kakaoMap';
import {
  getCurrentPosition,
  watchCurrentPosition,
  MAX_WATCH_INTERVAL_MS,
} from '../../../infrastructure/browser/geolocation';

// public/ 폴더 자산은 Vite에서 루트 기준 절대경로로 참조해야 한다.
const CURRENT_LOCATION_MARKER_IMAGE = { src: '/makerImg.png', size: 24 };

export function useCurrentLocationMarker(map) {
  const markerRef = useRef(null);
  const lastKnownPositionRef = useRef(null);
  // 지도가 뜬 뒤 유저 위치로 자동 이동시키는 건 화면당 한 번만 한다.
  // (10초마다 오는 위치 갱신 때마다 다시 가운데로 당기면 사용자가 지도를
  //  움직여 봐도 계속 원위치로 돌아가버려서 불편하다.)
  const hasAutoMovedRef = useRef(false);

  const updateMarkerPosition = useCallback(
    (position) => {
      lastKnownPositionRef.current = position;
      if (!map) return;

      if (!hasAutoMovedRef.current) {
        hasAutoMovedRef.current = true;
        panToPosition(map, position.lat, position.lng);
      }

      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      const marker = createKakaoMarker({
        ...position,
        image: CURRENT_LOCATION_MARKER_IMAGE,
        map,
      });
      marker.setMap(map);
      markerRef.current = marker;
    },
    [map]
  );

  // 지도가 준비되면 최대 10초 간격으로 실시간 위치를 받아 마커를 자동 갱신한다.
  useEffect(() => {
    if (!map) return;

    const stopWatching = watchCurrentPosition(updateMarkerPosition, {
      intervalMs: MAX_WATCH_INTERVAL_MS,
      onError: (error) => console.error('위치 갱신 실패:', error),
    });

    return stopWatching;
  }, [map, updateMarkerPosition]);

  // "내 위치" 버튼: 이미 백그라운드에서 받아둔 최신 위치가 있으면 그 값으로
  // 즉시 이동한다 (매번 새로 GPS를 조회하던 것이 기존 지연의 주된 원인이었다).
  // 아직 한 번도 받아온 적이 없을 때만 새로 조회한다.
  const moveToCurrentLocation = useCallback(async () => {
    if (!map) return;

    const position = lastKnownPositionRef.current ?? (await getCurrentPosition());
    panToPosition(map, position.lat, position.lng);
    updateMarkerPosition(position);
  }, [map, updateMarkerPosition]);

  return { moveToCurrentLocation };
}
