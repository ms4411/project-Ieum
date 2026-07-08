import { useState, useEffect } from 'react';
import '../componentCss/BottomSheet.css'
import { transform } from 'zod';
import Group from './Group';

function BottomSheet(){
    const [isSheetUp,setIsSheetUp]=useState(false);
    const [groups, setGroups]=useState([]);
    let MoveSheet=()=>{
        if(isSheetUp)
            setIsSheetUp(false)
        else
            setIsSheetUp(true)
    }
    let sheetCss={
        transform:isSheetUp?'translateY(0)' : 'translateY(calc(100% - 50px))'
    };

    useEffect(() => {
        let test = { name: 'wls이네 집', content: '집', imgUrl: '../../public/favicon.svg' };
        
        // 🟢 함수형 업데이트(prevGroups)를 사용합니다.
        setGroups(prevGroups => [...prevGroups, test]);
    }, []);

    return(
        <>
            <div id="bottom-sheet" onClick={MoveSheet} style={sheetCss}>
                <hr />
                <ul id='group-list'>
                    {groups.map((item, index) => (
                    <Group key={index} group={item} /> // 배열을 순회하며 동적 요소 렌더링
                    ))}
                </ul>
            </div>
        </>
    )
}
export default BottomSheet