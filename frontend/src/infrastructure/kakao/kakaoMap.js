// Kakao Maps SDK 지도 생성/제어 어댑터. Domain/Presentation 계층은
// window.kakao 전역 객체를 직접 참조하지 않고 이 모듈을 통해서만 접근한다.
export function createKakaoMap(container, { center, level }) {
  const { kakao } = window;
  return new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(center.lat, center.lng),
    level,
  });
}

export function panToPosition(map, lat, lng) {
  const { kakao } = window;
  map.panTo(new kakao.maps.LatLng(lat, lng));
}

// 지도 중심 좌표 조회 (위치 선택 UI에서 사용)
export function getMapCenter(map) {
  const center = map.getCenter();
  return { lat: center.getLat(), lng: center.getLng() };
}

// 현재 지도 화면(뷰포트)에 보이는 좌표 범위를 반환한다. "주변 모임"처럼 화면에
// 보이는 범위 안의 데이터만 걸러낼 때 사용한다.
export function getMapBounds(map) {
  const bounds = map.getBounds();
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  return {
    sw: { lat: sw.getLat(), lng: sw.getLng() },
    ne: { lat: ne.getLat(), lng: ne.getLng() },
  };
}

// 지도가 움직임을 멈췄을 때(드래그/줌 종료) 호출되는 리스너.
// 반환값을 호출하면 리스너를 해제한다.
export function addMapIdleListener(map, callback) {
  const { kakao } = window;
  kakao.maps.event.addListener(map, 'idle', callback);
  return function removeIdleListener() {
    kakao.maps.event.removeListener(map, 'idle', callback);
  };
}
