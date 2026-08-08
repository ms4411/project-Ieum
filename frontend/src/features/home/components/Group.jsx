function Group({ group }) {
  return (
    <li>
      {group.imgUrl && <img src={group.imgUrl} alt={group.title} />}
      <div>
        <h1>{group.title}</h1>
        <p>{group.content}</p>
      </div>
    </li>
  );
}

export default Group;
