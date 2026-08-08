import { apiFetch } from '../../../infrastructure/api/apiClient';
import { setTokens } from '../../../infrastructure/api/tokenStorage';

// 지도 화면 범위(bounds) 안의 모임을 검색한다. keyword/meetAt은 선택.
export function searchGroups({ swLat, swLng, neLat, neLng, keyword, meetAt }) {
  return apiFetch('/api/v1/groups', {
    params: { swLat, swLng, neLat, neLng, keyword, meetAt },
    auth: false,
  }).then((res) => res.data.groups);
}

export function getGroupById(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}`, { auth: false }).then(
    (res) => res.data.group
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
  return res.data.newGroup;
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
    (res) => res.data.groups
  );
}

export function getGroupMembers(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}/members`).then(
    (res) => res.data.members
  );
}

export function createReservation(groupId, { message, role }) {
  return apiFetch(`/api/v1/groups/${groupId}/join-requests`, {
    method: 'POST',
    body: { message, role },
  }).then((res) => res.data.newReservation);
}

export function deleteReservation(groupId) {
  return apiFetch(`/api/v1/groups/${groupId}/join-requests/me`, {
    method: 'DELETE',
  });
}
