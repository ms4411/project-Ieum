import { useState } from "react";
import Button from "./Button";
import './Menubar.css'

function Menubar(props){
    let testfun=()=>{window.open("https://youtube.com")}
    //현재 한국 시간 받기
    const getKoreaCurrentDateTime = () => {
        // 한국 시간(UTC+9)을 맞추기 위해 시차만큼 밀어줍니다.
        const kstOffset = 9 * 60 * 60 * 1000;
        const kstDate = new Date(new Date().getTime() + kstOffset);
        
        // 결과물: "2026-07-08T00:51:28.000Z" -> 여기서 앞의 16자리(분까지)만 자릅니다.
        return kstDate.toISOString().slice(0, 16); 
    };
    const [selectedDateTime, setselectedDateTime] = useState(getKoreaCurrentDateTime);

    const handleDateTimeChange = (e) => {
        setselectedDateTime(e.target.value); // YYYY-MM-DDTHH:mm 형식으로 저장됨 (예: 2026-07-07T20:30)
    };
    return(
        <>
            <div id="menubar">
                <input 
                    type="datetime-local" 
                    value={selectedDateTime} 
                    onChange={handleDateTimeChange} 
                />
                <ul id="btn-list">
                    <Button name="내 위치" fun={props.setPosFun}/>
                    <Button name="로그인" fun={testfun}/>
                    <Button name="예시입니다" fun={testfun}/>
                </ul>
            </div>
        </>

    )
};

export default Menubar;