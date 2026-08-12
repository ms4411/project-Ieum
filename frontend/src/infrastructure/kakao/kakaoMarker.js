// 마커 생성 + 이미지/인포윈도우/클릭 콜백 부착 로직을 한 곳에 모은 어댑터
export function createKakaoMarker({
  lat,
  lng,
  image,
  infoWindowContent,
  map,
  draggable,
  onDragEnd,
  onClick,
}) {
  const { kakao } = window;
  const position = new kakao.maps.LatLng(lat, lng);
  const marker = new kakao.maps.Marker({ position, draggable: Boolean(draggable) });

  if (image) {
    const imageSize = new kakao.maps.Size(image.size, image.size);
    // 원형 마커는 중심이 기준점이어야 하므로 반값씩 offset을 준다.
    const imageOption = {
      offset: new kakao.maps.Point(image.size / 2, image.size / 2),
    };
    marker.setImage(new kakao.maps.MarkerImage(image.src, imageSize, imageOption));
  }

  if (infoWindowContent) {
    const infoWindow = new kakao.maps.InfoWindow({
      content: infoWindowContent,
      removable: true,
    });
    kakao.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(map, marker);
    });
  }

  if (onClick) {
    kakao.maps.event.addListener(marker, 'click', onClick);
  }

  if (draggable && onDragEnd) {
    kakao.maps.event.addListener(marker, 'dragend', () => {
      const nextPosition = marker.getPosition();
      onDragEnd({ lat: nextPosition.getLat(), lng: nextPosition.getLng() });
    });
  }

  return marker;
}

// 마커 위에 항상 떠 있는 라벨(모임 제목)을 그리는 CustomOverlay 어댑터.
// 마커와는 별개의 DOM 오버레이라서 겹쳐 보이더라도 마커 클릭을 가로챌 수 있는데,
// clickable:false + CSS pointer-events:none으로 클릭/터치가 항상 라벨을 그대로
// 통과해 아래(지도/마커)로 전달되도록 만든다 — 즉 라벨을 눌러도 마커를 누른 것과
// 동일하게 동작해서 "라벨 때문에 마커가 안 눌리는" 현상이 생기지 않는다.
export function createKakaoMarkerLabel({ lat, lng, text }) {
  const { kakao } = window;
  const position = new kakao.maps.LatLng(lat, lng);

  const content = document.createElement('div');
  content.className = 'kakao-marker-label';
  content.textContent = text;

  return new kakao.maps.CustomOverlay({
    position,
    content,
    xAnchor: 0.5,
    yAnchor: 0, // 콘텐츠 하단을 기준점으로 삼는다 — CSS margin-bottom으로 마커 위까지 띄운다.
    clickable: false,
  });
}
