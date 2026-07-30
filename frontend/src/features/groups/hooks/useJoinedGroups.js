import { useState } from 'react';

// TODO: 실제 "내가 참여한 모임" 조회 API 연동 전까지 사용하는 임시 데이터.
// API가 준비되면 useState 대신 useEffect + features/groups/api의 fetch 호출로 교체한다.
// 빈 상태를 확인하려면 아래 배열을 []로 바꿔보면 된다.
const MOCK_JOINED_GROUPS = [
  {
    id: 'group-1',
    title: '이번 주 토요일 한강 러닝 모임',
    content:
      '토요일 오전 7시 반포 한강공원에서 가볍게 5km 러닝해요! 초보자도 환영입니다. 러닝 끝나고 근처 카페에서 같이 아침 먹어요.',
    members: [
      { id: 'user-1', name: '민지' },
      { id: 'user-2', name: '현우' },
      { id: 'user-3', name: '서연' },
    ],
  },
];

export function useJoinedGroups() {
  const [groups] = useState(MOCK_JOINED_GROUPS);
  return { groups };
}
