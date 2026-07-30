// 마커 생성 + 이미지/인포윈도우 부착 로직을 한 곳에 모은 어댑터
export function createKakaoMarker({
  lat,
  lng,
  image,
  infoWindowContent,
  map,
  draggable,
  onDragEnd,
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

  if (draggable && onDragEnd) {
    kakao.maps.event.addListener(marker, 'dragend', () => {
      const nextPosition = marker.getPosition();
      onDragEnd({ lat: nextPosition.getLat(), lng: nextPosition.getLng() });
    });
  }

  return marker;
}
