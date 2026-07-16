import { useState } from 'react';
import '../componentCss/BottomMenu.css'
import Button from '../../common/Button';
import PopupScreen from './PopupScreen';
function BottomMenu({setPosFun, createMarker}){
    
    const [isOpen, setIsOpen] = useState(false);
    const [latLng,setLatLng] = useState({lat:0,lng:0});

    const createGroup=()=>{
        // 클릭한 위치의 위도 경도 좌표를 가져옵니다
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;  // 현재 내 위치 위도
            const lng = position.coords.longitude; // 현재 내 위치 경도
            setLatLng({lat:lat,lng:lng})
            setIsOpen(true)
        });
    }

    
    return(
        <>
            <div id="bottom-menu">
                <Button img="../../public/svg/내위치.svg" fun={setPosFun}/>
                <Button img="../../public/svg/plusBtn.svg" fun={createGroup}/>
            </div>
            {isOpen && (
                <PopupScreen lat={latLng.lat} lng={latLng.lng} setIsOpen={setIsOpen}/>
            )}
        </>
    )
}

export default BottomMenu;