function Group(props){
    const liCss={
        borderStyle: 'dotted',
        borderColor: 'var(--point-color1)',
        borderWidth: '1px 0', // 위아래 1px, 좌우 0으로 정상 적용됩니다!
        display:'grid',
        gridTemplateColumns:'1fr 3fr',
        padding:'8px 0'
    }
    const imgCss={
        borderStyle: 'solid',
        borderColor: 'var(--point-color1)',
        borderWidth: '1px',
        borderRadius: 'var(--border-radius-size)',
        padding:'8px'

    }

    return(
        <>
            <li style={liCss}>
                <img src={props.group.imgUrl} style={imgCss}></img>
                <div>
                    <h1>{props.group.name}</h1>
                    <p>{props.group.content}</p>
                </div>
            </li>
        </>
    )
}

export default Group;