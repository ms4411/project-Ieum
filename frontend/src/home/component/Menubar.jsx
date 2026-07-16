import { useState } from "react";
import { useNavigate  } from 'react-router-dom';
import Button from "../../common/Button";
import '../componentCss/Menubar.css'
import PopupScreen from "./PopupScreen";

function Menubar({setPosFun}){
    //현재 한국 시간 받기
    const navigate = useNavigate();
    const getKoreaCurrentDateTime = () => {
        // 한국 시간(UTC+9)을 맞추기 위해 시차만큼 밀어줍니다.
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstDate = new Date(new Date().getTime() + kstOffset);
        
        // 결과물: "2026-07-08T00:51:28.000Z" -> 여기서 앞의 16자리(분까지)만 자릅니다.
        return kstDate.toISOString().slice(0, 16); 
    };

    const [selectedDate, setselectedDate] = useState(()=>getKoreaCurrentDateTime().slice(0,10));
    const [selectedTime, setselectedTime] = useState(()=>getKoreaCurrentDateTime().slice(11,16));

    const handleDateChange = (e) => {
        setselectedDate(e.target.value); // YYYY-MM-DDTHH:mm 형식으로 저장됨 (예: 2026-07-07T20:30)
    };
    const handleTimeChange = (e) => {
        setselectedTime(e.target.value); // YYYY-MM-DDTHH:mm 형식으로 저장됨 (예: 2026-07-07T20:30)
    };
    
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
            <div id="menubar">
                <input type="text" placeholder="검색창"></input>
                <div id="datetime-input">
                    <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={handleDateChange} 
                    />
                    <input 
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    />
                </div>
                
                <div id="btn-list">
                    <Button name="로그인" fun={() => navigate("/Login")}/>
                    <Button name="내 위치" fun={setPosFun}/>
                    <Button name="모임 생성" fun={createGroup}/>
                    <Button name="현재 시각" fun={()=>{
                        setselectedDate(getKoreaCurrentDateTime().slice(0,10))
                        setselectedTime(getKoreaCurrentDateTime().slice(11,16))
                    }}/>
                </div>
                {isOpen && (
                    <PopupScreen lat={latLng.lat} lng={latLng.lng} setIsOpen={setIsOpen}/>
                )}
            </div>
        </>

    )
};

export default Menubar;