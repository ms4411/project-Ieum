function MemberList({ members }) {
  return (
    <div className="member-list">
      <h2 className="member-list__title">참여 인원 {members.length}명</h2>
      <ul className="member-list__items">
        {members.map((member) => (
          <li key={member.id} className="member-list__item">
            <span className="member-list__avatar" aria-hidden="true">
              {member.name.charAt(0)}
            </span>
            <span className="member-list__name">{member.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemberList;
