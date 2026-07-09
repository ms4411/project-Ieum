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

  const createMarker = (lat, lng, img = null,iwContent=null, map=mapObject)=>{
    const locPosition = new kakao.maps.LatLng(lat, lng);
    let marker = new kakao.maps.Marker({
        position: locPosition
    });
    //마커 이미지 변경
    if(img!=null){
      const imageSrc = img.src; // 카카오 제공 내 위치 동그라미
      const imageSize = new kakao.maps.Size(img.size, img.size); // 동그라미 크기
      const imageOption = { offset: new kakao.maps.Point(img.size/2, img.size/2) }; // 📌 중요: 원형 마커는 중심이 기준점이어야 하므로 반값씩 줍니다!
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      marker.setImage(markerImage);
    }
    //마커 창 추가
    if(iwContent!=null){

      var infowindow = new kakao.maps.InfoWindow({
          content : iwContent,
          removable : true
      });
      // 3. 마커에 클릭 이벤트 등록하기
      kakao.maps.event.addListener(marker, 'click', function() {
        // 기능 A: 정보창(InfoWindow) 표시하기
        infowindow.open(map, marker);
      })
    }
    return marker
  }

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

        const marker=createMarker(lat, lon, {src:'../public/makerImg.png', size:24}).setMap(mapObject);

        setMarkerRef(marker);
        });
        
    }
  };

  return (
  <>
    <KakaoMap setMapObject={setMapObject}/>
    <BottomMenu setPosFun={handleMoveToCurrentLocation} createMarker={createMarker}/>
    <BottomSheet groups={groups} setGroups={setGroups}/>
    <Menubar setPosFun={handleMoveToCurrentLocation}/>
  </>
  )
}

export default App
