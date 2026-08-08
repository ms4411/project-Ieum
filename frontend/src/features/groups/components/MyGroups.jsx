import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import GroupNotice from './GroupNotice';
import MemberList from './MemberList';
import { useJoinedGroups } from '../hooks/useJoinedGroups';
import { useAuthUser } from '../../auth';
import './MyGroups.css';

function MyGroups() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const { groups, isLoading } = useJoinedGroups();

  useEffect(() => {
    if (!isAuthLoading && !user) navigate('/login', { replace: true });
  }, [isAuthLoading, user, navigate]);

  if (isAuthLoading || !user) return null;

  return (
    <div className="my-groups-screen">
      <div className="my-groups-screen__header">
        <Link className="my-groups-screen__back" to="/" aria-label="홈으로 돌아가기">
          ←
        </Link>
        <h1 className="my-groups-screen__title">내가 참여한 모임</h1>
      </div>

      {isLoading ? (
        <div className="my-groups-screen__empty">
          <p>불러오는 중...</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="my-groups-screen__empty">
          <p className="my-groups-screen__empty-emoji" aria-hidden="true">🌤️</p>
          <p>현재 참여한 모임이 없습니다.</p>
        </div>
      ) : (
        <ul className="my-groups-screen__list">
          {groups.map((group) => (
            <li key={group.id} className="my-groups-screen__card box">
              <GroupNotice title={group.title} content={group.content} />
              <MemberList members={group.members} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyGroups;
