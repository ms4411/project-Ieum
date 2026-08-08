import { useState, useEffect, useCallback, useRef } from 'react';
import { getMapBounds, addMapIdleListener } from '../../../infrastructure/kakao/kakaoMap';
import { searchGroups } from '../../groups/api/groupsApi';

// 지도가 지금 보여주고 있는 범위(뷰포트) 안에 있는 모임만 서버에서 조회한다.
// 지도를 움직이거나 확대/축소해서 멈출 때(idle)마다 다시 조회하고,
// keyword/meetAt(검색어·날짜 필터)이 바뀔 때도 다시 조회한다.
export function useNearbyGroups(map, { keyword, meetAt } = {}) {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // 응답이 요청 순서와 다르게 도착해 옛 결과로 최신 결과를 덮어쓰는 것을 막는다.
  const requestIdRef = useRef(0);

  const fetchGroups = useCallback(async () => {
    if (!map) return;
    const bounds = getMapBounds(map);
    const requestId = ++requestIdRef.current;

    setIsLoading(true);
    try {
      const result = await searchGroups({
        swLat: bounds.sw.lat,
        swLng: bounds.sw.lng,
        neLat: bounds.ne.lat,
        neLng: bounds.ne.lng,
        keyword: keyword || undefined,
        meetAt: meetAt || undefined,
      });
      if (requestId === requestIdRef.current) setGroups(result ?? []);
    } catch (error) {
      console.error('주변 모임 조회 실패:', error);
      if (requestId === requestIdRef.current) setGroups([]);
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [map, keyword, meetAt]);

  useEffect(() => {
    if (!map) return;

    fetchGroups();
    const removeIdleListener = addMapIdleListener(map, fetchGroups);

    return removeIdleListener;
  }, [map, fetchGroups]);

  // 모임 생성 직후처럼, idle 이벤트를 기다리지 않고 즉시 다시 불러오고 싶을 때 사용.
  return { groups, isLoading, refetch: fetchGroups };
}
