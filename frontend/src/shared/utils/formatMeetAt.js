const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

// 모임 만나는 시간(meetAt, ISO 문자열)을 "8월 12일(수) 오후 3:00" 형태로 바꾼다.
// GroupDetail(상세)과 Group(바텀시트 목록) 양쪽에서 같은 포맷을 쓰기 위해 공용으로 뺐다.
export function formatMeetAt(meetAt) {
  if (!meetAt) return '시간 정보 없음';
  const parsed = new Date(meetAt);
  if (Number.isNaN(parsed.getTime())) return meetAt;
  const period = parsed.getHours() < 12 ? '오전' : '오후';
  const hour12 = ((parsed.getHours() + 11) % 12) + 1;
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${parsed.getMonth() + 1}월 ${parsed.getDate()}일(${WEEKDAY[parsed.getDay()]}) ${period} ${hour12}:${minutes}`;
}
