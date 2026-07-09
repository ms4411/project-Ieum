import '../componentCss/BottomMenu.css'
import Button from './Button';
function BottomMenu(props){
    return(
        <>
            <div id="bottom-menu">
                <Button img="../../public/svg/내위치.svg" fun={props.setPosFun}/>
                <Button img="../../public/svg/plusBtn.svg" fun={null}/>
            </div>
        </>
    )
}

export default BottomMenu;