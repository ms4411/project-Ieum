import { apiFetch } from '../../../infrastructure/api/apiClient';
import { setTokens } from '../../../infrastructure/api/tokenStorage';

// 지도 화면 범위(bounds) 안의 모임을 검색한다. keyword/meetAt은 선택.
// 로그인 여부와 무관하게 호출 가능하지만(인증 "불필요"), 로그인된 상태라면
// 저장된 accessToken을 그대로 실어 보낸다 → auth: 'optional'
export function searchGroups({ swLat, swLng, neLat, neLng, keyword, meetAt }) {
  return apiFetch('/api/v1/groups', {
    params: { swLat, swLng, neLat, neLng, keyword, meetAt },
    auth: 'optional',
  }).then((res) => res.data);
}

export function getGroupById(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}`, { auth: 'optional' }).then(
    (res) => {
      return res.data
    }
  );
}

// 모임 생성. 백엔드가 "이 모임의 HOST"라는 정보(role, createGroupId)가 들어간
// 새 토큰 세트를 함께 내려주므로, 반드시 그 토큰으로 교체 저장해야
// 이후 모임 수정/삭제, 참가 신청 승인 같은 HOST 전용 API를 호출할 수 있다.
export async function createGroup(createGroupDTO) {
  const res = await apiFetch('/api/v1/groups', {
    method: 'POST',
    body: createGroupDTO,
  });
  setTokens(res.data.tokens);
  return res.data;
}

export function updateGroup(groupId, updateGroupDTO) {
  return apiFetch(`/api/v1/groups/${groupId}`, {
    method: 'PATCH',
    body: updateGroupDTO,
  });
}

export function deleteGroup(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}`, { method: 'DELETE' });
}

// 내가 참여 중인(=신청이 승인된) 모임 목록. role을 넘기면 HOST/MEMBER로 필터링된다.
export function getMyGroups(role) {
  return apiFetch('/api/v1/users/me/groups', { params: { role } }).then(
    (res) => res.data
  );
}

// 내가 신청해둔(아직 결과가 안 나온/처리된) 모임 신청 내역. status는 필수.
// 예: getMyJoinRequests('PENDING') — "신청자" 필터에서 사용.
export function getMyJoinRequests(status) {
  return apiFetch('/api/v1/users/me/join-requests', { params: { status } }).then(
    (res) => res.data
  );
}

export function getGroupMembers(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}/members`).then(
    (res) => res.data
  );
}

// 모임장이 자신이 만든 모임에 들어온 신청 목록을 조회한다 (호스트 전용, status 필수).
export function getGroupJoinRequests(groupId, status = 'PENDING') {
  return apiFetch(`/api/v1/groups/${groupId}/join-requests`, {
    params: { status },
  }).then((res) => res.data);
}

// 모임장이 특정 신청 건을 수락/거절한다 (호스트 전용).
export function updateJoinRequestStatus(groupId, reservationId, status) {
  return apiFetch(`/api/v1/groups/${groupId}/join-requests/${reservationId}`, {
    method: 'PATCH',
    body: { status },
  });
}

export function createReservation(groupId, { message, role = 'MEMBER' } = {}) {
  return apiFetch(`/api/v1/groups/${groupId}/join-requests`, {
    method: 'POST',
    body: { message, role },
  }).then((res) => res.data);
}

export function deleteReservation(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}/join-requests/me`, {
    method: 'DELETE',
  });
}
