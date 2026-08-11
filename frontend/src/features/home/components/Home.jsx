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

  // 지금 지도로 보고 있는 범위 안의 모임만 걸러서 하단 목록에 보여준다.
  // 시간 필터가 꺼져 있으면 meetAt은 보내지 않아 모든 시간대의 모임이 나온다.
  const { groups, refetch: refetchGroups } = useNearbyGroups(mapObject, {
    keyword,
    meetAt: isTimeFilterOn ? `${date}T${time}` : undefined,
  });

  // 마커를 누르면 해당 모임을 저장한다. 같은 마커를 연달아 눌러도 바텀시트가
  // 다시 스크롤되도록, 값이 아니라 매번 새로운 객체(nonce 포함)로 갱신한다.
  const [selectedGroup, setSelectedGroup] = useState(null);
  useGroupMarkers(mapObject, groups, {
    onMarkerClick: (group) => setSelectedGroup({ group, nonce: Date.now() }),
  });

  const handleResetDateTime = () => {
    resetToNow();
    setIsTimeFilterOn(false);
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
      />
    </>
  );
}

export default Home;
