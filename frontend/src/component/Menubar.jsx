import { useState } from "react";
import Button from "./Button";
import '../componentCss/Menubar.css'

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

    const [selectedDate, setselectedDate] = useState(()=>getKoreaCurrentDateTime().slice(0,10));
    const [selectedTime, setselectedTime] = useState(()=>getKoreaCurrentDateTime().slice(11,16));

    const handleDateChange = (e) => {
        setselectedDate(e.target.value); // YYYY-MM-DDTHH:mm 형식으로 저장됨 (예: 2026-07-07T20:30)
    };
    const handleTimeChange = (e) => {
        setselectedTime(e.target.value); // YYYY-MM-DDTHH:mm 형식으로 저장됨 (예: 2026-07-07T20:30)
    };
    const testData={name:'예시',imgUrl:'/public/makerImg.png', content:'어ㅓㅓㅓㅓㅓ'}
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
                    <Button name="내 위치" fun={props.setPosFun}/>
                    <Button name="로그인" fun={testfun}/>
                    <Button name="예시입니다" fun={()=>props.addGroups(testData)}/>
                </div>
            </div>
        </>

    )
};

export default Menubar;