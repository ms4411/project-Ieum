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
