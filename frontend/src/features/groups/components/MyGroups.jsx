import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GroupNotice from './GroupNotice';
import MemberList from './MemberList';
import Button from '../../../shared/components/Button/Button';
import { useJoinedGroups } from '../hooks/useJoinedGroups';
import { useAuthUser } from '../../auth';
import './MyGroups.css';

const FILTERS = [
  { value: 'HOST', label: '호스트' },
  { value: 'MEMBER', label: '참여자' },
  { value: 'APPLICANT', label: '신청자' },
];

const EMPTY_MESSAGE = {
  HOST: '아직 만든 모임이 없습니다.',
  MEMBER: '아직 참여 중인 모임이 없습니다.',
  APPLICANT: '아직 신청한 모임이 없습니다.',
};

function MyGroups() {
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const [filter, setFilter] = useState('HOST');
  const { groups, isLoading, error } = useJoinedGroups(filter);

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

      <div className="my-groups-screen__filters" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            className={
              'my-groups-screen__filter' +
              (filter === f.value ? ' is-active' : '')
            }
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="my-groups-screen__empty">
          <p>불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="my-groups-screen__empty">
          <p>{error.message ?? '모임 목록을 불러오지 못했습니다.'}</p>
        </div>
      ) : groups.length === 0 ? (
        <div className="my-groups-screen__empty">
          <p className="my-groups-screen__empty-emoji" aria-hidden="true">🌤️</p>
          <p>{EMPTY_MESSAGE[filter]}</p>
        </div>
      ) : (
        <ul className="my-groups-screen__list">
          {groups.map((group) => (
            <li key={group.reservationId ?? group.id} className="my-groups-screen__card box">
              <GroupNotice group={group} />
              {group.applicantStatus === 'REJECTED' ? (
                <p className="my-groups-screen__rejected-badge">거절된 신청</p>
              ) : group.applicantStatus === 'PENDING' ? (
                <p className="my-groups-screen__pending-badge">승인 대기 중</p>
              ) : (
                <MemberList members={group.members} />
              )}
              <Button
                name="모임 상세보기"
                variant="outline"
                onClick={() => navigate(`/groups/${group.id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyGroups;
