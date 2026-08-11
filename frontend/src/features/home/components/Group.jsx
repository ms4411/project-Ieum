import { Link } from 'react-router-dom';

function Group({ group }) {
  return (
    <li id={`group-item-${group.id}`}>
      <div className="group-item__thumb">
        {group.imgUrl ? (
          <img
            src={'http://localhost:8080/upload_imgs/' + group.imgUrl}
            alt={group.title}
          />
        ) : (
          <span aria-hidden="true">🏕️</span>
        )}
      </div>
      <div>
        {/* 바텀시트 전체에 열고 닫는 클릭 핸들러가 달려 있어서, 제목을 눌렀을 때는
            그걸 막고(stopPropagation) 상세 페이지로만 이동해야 한다. */}
        <Link
          to={`/groups/${group.id}`}
          onClick={(e) => e.stopPropagation()}
          className="group-item__title"
        >
          <h1>{group.title}</h1>
        </Link>
        <p>{group.content}</p>
      </div>
    </li>
  );
}

export default Group;
