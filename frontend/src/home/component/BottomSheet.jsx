import { useState, useEffect } from 'react';
import '../componentCss/BottomSheet.css'
import { transform } from 'zod';
import Group from './Group';

function BottomSheet(props){
    const [isSheetUp,setIsSheetUp]=useState(false);
    let MoveSheet=()=>{
        if(isSheetUp)
            setIsSheetUp(false)
        else
            setIsSheetUp(true)
    }
    let sheetCss={
        transform:isSheetUp?'translateY(0)' : 'translateY(calc(100% - var(--first-bottom-sheet-height)))',
        innerHeight:"calc(100% - var(--menubar-size))"
    };

    useEffect(() => {
        
        // 🟢 함수형 업데이트(prevGroups)를 사용합니다.
        props.setGroups(prevGroups => [...prevGroups, test]);
    }, []);

    return(
        <>
            <div id="bottom-sheet" className='box' onClick={MoveSheet} style={sheetCss}>
                <hr />
                <ul id='group-list'>
                    {props.groups.map((item, index) => (
                    <Group key={index} group={item} /> // 배열을 순회하며 동적 요소 렌더링
                    ))}
                </ul>
            </div>
        </>
    )
}
export default BottomSheet