import { useState, useEffect, useCallback } from 'react';
import { getMyGroups, getMyJoinRequests } from '../api/groupsApi';
import { getAccessToken } from '../../../infrastructure/api/tokenStorage';

// "신청자" 필터는 /users/me/join-requests(Reservation 목록)를 쓰는데,
// 호스트/참여자 필터가 쓰는 /users/me/groups(ReadGroupDTO 목록)와 응답 모양이 다르다.
//   - ReadGroupDTO: { id(모임 id), title, content, role, members }
//   - Reservation : { id(신청 id), group: { id, title, content, ... }, role, status, ... }
// 화면(MyGroups)에서 두 경우를 똑같이 다룰 수 있도록 여기서 형태를 맞춰준다.
// status는 'PENDING' | 'REJECTED' 그대로 넘겨서, 화면에서 대기 중/거절됨 배지를 구분해 보여줄 수 있게 한다.
function normalizeJoinRequest(reservation) {
  const group = reservation.group ?? {};
  return {
    id: group.id,
    reservationId: reservation.id,
    title: group.title,
    content: group.content,
    role: reservation.role,
    members: [],
    applicantStatus: reservation.status, // 'PENDING' | 'REJECTED'
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
      let result;
      if (roleFilter === 'APPLICANT') {
        // "신청자" 필터에서는 대기 중인 신청과 거절된 신청을 함께 보여준다.
        // 두 상태를 각각 조회한 뒤 합치고, 화면에서는 applicantStatus로 배지를 구분해 표시한다.
        const [pending, rejected] = await Promise.all([
          getMyJoinRequests('PENDING'),
          getMyJoinRequests('REJECTED'),
        ]);
        result = [...(pending ?? []), ...(rejected ?? [])].map(normalizeJoinRequest);
      } else {
        result = await getMyGroups(roleFilter);
      }
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
