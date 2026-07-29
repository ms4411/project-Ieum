// 좌표 -> 주소 변환 어댑터.
// 원본 코드는 전역 daum.maps를 사용했는데, 나머지 코드베이스는 모두 kakao.maps를
// 사용하고 있어 kakao.maps.services.Geocoder로 통일했다. 사용 중인 SDK 스크립트가
// daum.maps만 제공한다면 이 부분만 되돌리면 된다.
export function getAddressFromCoords(lat, lng) {
  return new Promise((resolve, reject) => {
    const { kakao } = window;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve(result[0].address.address_name);
      } else {
        reject(new Error('주소를 가져오지 못했습니다.'));
      }
    });
  });
}
