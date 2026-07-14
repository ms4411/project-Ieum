import { useState,useEffect } from "react";
import './../componentCss/PopupScreen.css'
import Button from "./Button";
function PopupScreen({lat,lng,setIsOpen}){
    const [address, setAddress] = useState('');
    // 1. 주소-좌표 변환 객체를 생성합니다
    var geocoder = new daum.maps.services.Geocoder();

    // 3. 좌표로 행정동 주소 정보를 요청합니다
    const getAddress=(lng, lat)=>{geocoder.coord2Address(lng, lat, function(result, status) {
        if (status === daum.maps.services.Status.OK) {
            setAddress(result[0].address.address_name);
            
        }
    })};
    const a=(lng,lat)=>{
        getAddress(lng, lat)
        return address
    }

    return(
        <>
            <div id="background">
                <div id="popup">
                    <h1 style={{textAlign:'center'}}>모임 생성</h1>
                    <form action="" id="group-form">
                        <input type="text" value={a(lng,lat)} />
                        <input required placeholder="제목을 입력해 주세요" />
                        <textarea required rows={10} placeholder="내용을 입력해주세요" style={{resize: 'none'}}></textarea>
                        <input min={1} required placeholder="최대 사람 수를 입력해 주세요" type="number" />
                        <button>제출하기</button>
                        <a onClick={()=>setIsOpen(false)}>모임 생성 취소하기</a>
                    </form>
                </div>
            </div>
        </>
    )
}

export default PopupScreen;