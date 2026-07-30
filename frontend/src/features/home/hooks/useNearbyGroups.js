import { useState, useEffect, useCallback } from 'react';
import { getMapBounds, addMapIdleListener } from '../../../infrastructure/kakao/kakaoMap';

// TODO: 실제 "주변 모임" 조회 API 연동 전까지 사용하는 임시(mock) 데이터.
// 화면에 보이는 범위만 걸러내야 하므로 각 모임은 좌표(lat/lng)를 갖고 있어야 한다.
const MOCK_ALL_GROUPS = [
  {
    id: 'group-1',
    name: 'wls이네 집',
    content: '집',
    imgUrl: '/favicon.svg',
    lat: 37.5665,
    lng: 126.978,
  },
  {
    id: 'group-2',
    name: '연남동 보드게임 모임',
    content: '가볍게 보드게임 한 판 하실 분 구해요',
    imgUrl: '/favicon.svg',
    lat: 37.5663,
    lng: 126.9254,
  },
  {
    id: 'group-3',
    name: '해운대 러닝 크루',
    content: '부산 해운대 바닷가에서 같이 뛰어요',
    imgUrl: '/favicon.svg',
    lat: 35.1587,
    lng: 129.1604,
  },
];

function isWithinBounds(bounds, position) {
  return (
    position.lat >= bounds.sw.lat &&
    position.lat <= bounds.ne.lat &&
    position.lng >= bounds.sw.lng &&
    position.lng <= bounds.ne.lng
  );
}

// 지도가 지금 보여주고 있는 범위(뷰포트) 안에 있는 모임만 걸러서 반환한다.
// 지도를 움직이거나 확대/축소해서 멈출 때(idle)마다 다시 계산한다.
export function useNearbyGroups(map) {
  const [nearbyGroups, setNearbyGroups] = useState([]);

  const updateNearbyGroups = useCallback(() => {
    if (!map) return;
    const bounds = getMapBounds(map);
    setNearbyGroups(MOCK_ALL_GROUPS.filter((group) => isWithinBounds(bounds, group)));
  }, [map]);

  useEffect(() => {
    if (!map) return;

    updateNearbyGroups();
    const removeIdleListener = addMapIdleListener(map, updateNearbyGroups);

    return removeIdleListener;
  }, [map, updateNearbyGroups]);

  return { groups: nearbyGroups };
}
