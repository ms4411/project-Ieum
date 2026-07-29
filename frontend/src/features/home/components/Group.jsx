function Group({ group }) {
  return (
    <li>
      <img src={group.imgUrl} alt={group.name} />
      <div>
        <h1>{group.name}</h1>
        <p>{group.content}</p>
      </div>
    </li>
  );
}

export default Group;
