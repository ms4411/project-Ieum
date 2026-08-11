function Group({ group }) {
  return (
    <li>
      <img src={"http://localhost:8080/upload_imgs/"+group.imgUrl} alt={group.title} />
      <div>
        <h1>{group.title}</h1>
        <p>{group.content}</p>
      </div>
    </li>
  );
}

export default Group;
