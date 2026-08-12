import { useEffect, useRef } from 'react';
import {
  createKakaoMarker,
  createKakaoMarkerLabel,
} from '../../../infrastructure/kakao/kakaoMarker';

// 지도 범위 안의 모임(groups)을 지도 위에 마커로 그린다.
// groups가 바뀔 때마다(검색어/시간 필터/지도 이동으로 재조회될 때마다)
// 이전 마커를 전부 지우고 새로 그린다. 마커를 누르면 onMarkerClick(group)이 호출된다.
// 마커 자체(생성/클릭 로직)는 건드리지 않고, 어떤 모임인지 바로 보이도록 제목 라벨을
// 별도 오버레이로 얹기만 한다 — 라벨이 클릭을 가로채지 않으므로 마커 클릭 → 바텀시트
// 자동 스크롤 동작은 그대로 유지된다.
export function useGroupMarkers(map, groups, { onMarkerClick } = {}) {
  const markersRef = useRef([]);
  const labelsRef = useRef([]);
  // onMarkerClick을 의존성 배열에 넣으면 렌더될 때마다 함수가 새로 만들어져
  // 마커를 불필요하게 다시 그리게 되므로, ref로 최신 콜백만 참조한다.
  const onMarkerClickRef = useRef(onMarkerClick);
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    labelsRef.current.forEach((label) => label.setMap(null));
    labelsRef.current = [];

    (groups ?? []).forEach((group) => {
      if (typeof group.lat !== 'number' || typeof group.lng !== 'number') return;

      // 마커 생성/클릭 로직은 기존과 동일 — 여기서 바꾸는 게 없어야 클릭 시
      // 바텀시트가 올라오고 해당 항목으로 자동 스크롤되는 기능이 안 깨진다.
      const marker = createKakaoMarker({
        lat: group.lat,
        lng: group.lng,
        map,
        onClick: () => onMarkerClickRef.current?.(group),
      });
      marker.setMap(map);
      markersRef.current.push(marker);

      // 마커 위에 모임 제목 라벨을 별도로 얹는다 (클릭 불가 오버레이).
      if (group.title) {
        const label = createKakaoMarkerLabel({
          lat: group.lat,
          lng: group.lng,
          text: group.title,
        });
        label.setMap(map);
        labelsRef.current.push(label);
      }
    });

    return () => {
      labelsRef.current.forEach((label) => label.setMap(null));
      labelsRef.current = [];
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [map, groups]);
}
