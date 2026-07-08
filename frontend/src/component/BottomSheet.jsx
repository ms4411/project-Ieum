import { useState } from 'react'
import '../componentCss/BottomSheet.css'
import { transform } from 'zod';
import { group } from 'node:console';

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

    
    return(
        <>
            <div id="bottom-sheet" onClick={MoveSheet} style={sheetCss}>
                <hr />
                <ul id='group-list'>
                    {groups.map((item, index) => (
                    <Group key={index} content={item} /> // 배열을 순회하며 동적 요소 렌더링
                    ))}
                </ul>
            </div>
        </>
    )
}
export default BottomSheet