import { useState } from 'react';
import Menubar from './Menubar';
import KakaoMap from './KakaoMap';
import BottomSheet from './BottomSheet';
import BottomMenu from './BottomMenu';
import { useCurrentLocationMarker } from '../hooks/useCurrentLocationMarker';
import { useNearbyGroups } from '../hooks/useNearbyGroups';
import { useGroupMarkers } from '../hooks/useGroupMarkers';
import { useKoreaDateTime } from '../hooks/useKoreaDateTime';

function Home() {
  const [mapObject, setMapObject] = useState(null);
  const { moveToCurrentLocation } = useCurrentLocationMarker(mapObject);

  const [keyword, setKeyword] = useState('');
  const { date, setDate, time, setTime, resetToNow } = useKoreaDateTime();
  const [isTimeFilterOn, setIsTimeFilterOn] = useState(false);

  // 백엔드 검색 API에 새로 추가된 lastAt(선택) 파라미터. meetAt과 완전히 독립된
  // 별도 필터라서 날짜/시간 상태도, 켬/끔 토글도 따로 둔다.
  const {
    date: lastAtDate,
    setDate: setLastAtDate,
    time: lastAtTime,
    setTime: setLastAtTime,
    resetToNow: resetLastAtToNow,
  } = useKoreaDateTime();

  // 지금 지도로 보고 있는 범위 안의 모임만 걸러서 하단 목록에 보여준다.
  // 필터가 꺼져 있으면 해당 파라미터는 보내지 않는다.
  const { groups, refetch: refetchGroups } = useNearbyGroups(mapObject, {
    keyword,
    meetAt: isTimeFilterOn ? `${date}T${time}` : undefined,
    lastAt: isTimeFilterOn ? `${lastAtDate}T${lastAtTime}` : undefined,
  });

  // 마커를 누르면 해당 모임을 저장한다. 같은 마커를 연달아 눌러도 바텀시트가
  // 다시 스크롤되도록, 값이 아니라 매번 새로운 객체(nonce 포함)로 갱신한다.
  const [selectedGroup, setSelectedGroup] = useState(null);
  useGroupMarkers(mapObject, groups, {
    onMarkerClick: (group) => setSelectedGroup({ group, nonce: Date.now() }),
  });

  const handleResetDateTime = () => {
    resetToNow();
    resetLastAtToNow();
    //초기화할때 차이 1시간 주기
    const [hours, minutes] = time.split(':').map(Number);
    const nextHours = (hours + 1) % 24; // 24시가 넘어가면 0시로 순환
    setLastAtTime(`${String(nextHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`)
  };

  return (
    <>
      <KakaoMap onMapReady={setMapObject} />
      <BottomMenu
        onMoveToCurrentLocation={moveToCurrentLocation}
        onGroupCreated={refetchGroups}
      />
      <BottomSheet groups={groups} selectedGroup={selectedGroup} />
      <Menubar
        keyword={keyword}
        onKeywordChange={setKeyword}
        date={date}
        onDateChange={setDate}
        time={time}
        onTimeChange={setTime}
        isTimeFilterOn={isTimeFilterOn}
        onToggleTimeFilter={setIsTimeFilterOn}
        onResetDateTime={handleResetDateTime}
        lastAtDate={lastAtDate}
        onLastAtDateChange={setLastAtDate}
        lastAtTime={lastAtTime}
        onLastAtTimeChange={setLastAtTime}
      />
    </>
  );
}

export default Home;
