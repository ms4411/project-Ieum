import { useState, useEffect, useCallback } from 'react';
import { getMyGroups, getMyJoinRequests } from '../api/groupsApi';
import { getAccessToken } from '../../../infrastructure/api/tokenStorage';

// "신청자" 필터는 /users/me/join-requests(Reservation 목록)를 쓰는데,
// 호스트/참여자 필터가 쓰는 /users/me/groups(ReadGroupDTO 목록)와 응답 모양이 다르다.
//   - ReadGroupDTO: { id(모임 id), title, content, role, members }
//   - Reservation : { group: { id, title, content, ... }, role, status, ... }
// 화면(MyGroups)에서 두 경우를 똑같이 다룰 수 있도록 여기서 형태를 맞춰준다.
function normalizeJoinRequest(reservation) {
  const group = reservation.group ?? {};
  return {
    id: group.id,
    title: group.title,
    content: group.content,
    role: reservation.role,
    members: [],
    isPending: true, // 아직 승인 대기 중 — 참여 인원 목록 대신 "대기 중" 배지를 보여준다.
  };
}

// roleFilter: 'HOST' | 'MEMBER' | 'APPLICANT'
export function useJoinedGroups(roleFilter = 'HOST') {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    // 로그인 전에는 호출해봐야 401만 나므로 조용히 건너뛴다.
    if (!getAccessToken()) {
      setGroups([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result =
        roleFilter === 'APPLICANT'
          ? (await getMyJoinRequests('PENDING')).map(normalizeJoinRequest)
          : await getMyGroups(roleFilter);
      setGroups(result ?? []);
    } catch (err) {
      setError(err);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return { groups, isLoading, error, refetch: load };
}
