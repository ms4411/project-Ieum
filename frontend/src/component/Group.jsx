function Group(props){

    return(
        <>
            <li>
                <img src={props.group.imgUrl}></img>
                <div>
                    <h1>{props.group.name}</h1>
                    <p>{props.group.content}</p>
                </div>
            </li>
        </>
    )
}

export default Group;