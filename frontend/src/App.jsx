import { useState } from 'react'
import './App.css'
import Menubar from './component/Menubar.jsx'
import KakaoMap from './component/KakaoMap.jsx'

function App() {
  const [mapObject,setMapObject] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);

  // 버튼을 눌러서 언제든 내 위치로 다시 이동하고 싶을 때 쓰는 함수
  const handleMoveToCurrentLocation = () => {
    const { kakao } = window;
    if (navigator.geolocation && mapObject) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new kakao.maps.LatLng(lat, lon);
        
        // 부드럽게 내 위치로 중심 이동
        mapObject.panTo(locPosition);
        
        if (currentMarker){
          currentMarker.setMap(null);
        }
        const imageSrc = '../public/makerImg.png'; // 카카오 제공 내 위치 동그라미
        const imageSize = new kakao.maps.Size(24, 24); // 동그라미 크기
        const imageOption = { offset: new kakao.maps.Point(12, 12) }; // 📌 중요: 원형 마커는 중심이 기준점이어야 하므로 반값씩 줍니다!

        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        const marker = new kakao.maps.Marker({
          position: locPosition,
          image: markerImage
        });

        // 3. 🚨 생성한 마커를 화면에 보이는 지도 위에 올리기
        marker.setMap(mapObject);
        });
        // 새 마커를 상태에 저장해 둡니다 (다음에 지우기 위해)
        setCurrentMarker(marker);
    }
  };

  return (
  <>
    <Menubar setPosFun={handleMoveToCurrentLocation}/>
    <KakaoMap setMapObject={setMapObject}/>
  </>
  )
}

export default App
