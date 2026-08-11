import { useEffect, useRef } from 'react';
import { createKakaoMarker } from '../../../infrastructure/kakao/kakaoMarker';

// 지도 범위 안의 모임(groups)을 지도 위에 마커로 그린다.
// groups가 바뀔 때마다(검색어/시간 필터/지도 이동으로 재조회될 때마다)
// 이전 마커를 전부 지우고 새로 그린다. 마커를 누르면 onMarkerClick(group)이 호출된다.
export function useGroupMarkers(map, groups, { onMarkerClick } = {}) {
  const markersRef = useRef([]);
  // onMarkerClick을 의존성 배열에 넣으면 렌더될 때마다 함수가 새로 만들어져
  // 마커를 불필요하게 다시 그리게 되므로, ref로 최신 콜백만 참조한다.
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    (groups ?? []).forEach((group) => {
      if (typeof group.lat !== 'number' || typeof group.lng !== 'number') return;
      const marker = createKakaoMarker({
        lat: group.lat,
        lng: group.lng,
        map,
        onClick: () => onMarkerClickRef.current?.(group),
      });
      marker.setMap(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, groups]);
}
