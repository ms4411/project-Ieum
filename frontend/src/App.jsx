import { useState } from 'react'
import { useRef } from 'react'
import './App.css'
import Menubar from './component/Menubar.jsx'
import KakaoMap from './component/KakaoMap.jsx'
import BottomSheet from './component/BottomSheet.jsx';
import BottomMenu from './component/BottomMenu.jsx';

function App() {
  const markerRef = useRef(null);
  const setMarkerRef = (obj) => {markerRef.current=obj}
  const [mapObject, setMapObject] = useState(null);
  const [groups, setGroups]=useState([]);

  // 버튼을 눌러서 언제든 내 위치로 다시 이동하고 싶을 때 쓰는 함수
  const handleMoveToCurrentLocation = () => {
    console.log(markerRef);
    const { kakao } = window;
    if (navigator.geolocation && mapObject) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locPosition = new kakao.maps.LatLng(lat, lon);
        
        // 부드럽게 내 위치로 중심 이동
        mapObject.panTo(locPosition);
        
        if (markerRef.current && typeof markerRef.current.setMap === 'function') {
          markerRef.current.setMap(null)
          markerRef.current = null; // 지우고 나서 금고를 깨끗하게 비워줍니다.
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
        setMarkerRef(marker);
        });
        
    }
  };

  const addGroups = (group)=>{
    setGroups([...groups, group])
  }
  return (
  <>
    <Menubar setPosFun={handleMoveToCurrentLocation} addGroups={addGroups}/>
    <KakaoMap setMapObject={setMapObject}/>
    <BottomMenu setPosFun={handleMoveToCurrentLocation}/>
    <BottomSheet groups={groups} setGroups={setGroups}/>
  </>
  )
}

export default App
