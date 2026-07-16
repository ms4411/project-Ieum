function Button({ img, name, fun, svg }){
    const buttonCss={
        display:'flex',
        alginItems:'center',
        justifyContent:'center'
    }
    if (img){
        return(
            <button className="box" style={buttonCss} onClick={fun}><img src={img}/>{name}</button>
        )
    }
    return(
        <button className="box" style={buttonCss} onClick={fun}>{name}</button>
    )
}

export default Button;