import { useState } from 'react';
import Menubar from './Menubar';
import KakaoMap from './KakaoMap';
import BottomSheet from './BottomSheet';
import BottomMenu from './BottomMenu';
import { useCurrentLocationMarker } from '../hooks/useCurrentLocationMarker';
import { useNearbyGroups } from '../hooks/useNearbyGroups';

function Home() {
  const [mapObject, setMapObject] = useState(null);
  const { moveToCurrentLocation } = useCurrentLocationMarker(mapObject);
  // 지금 지도로 보고 있는 범위 안의 모임만 걸러서 하단 목록에 보여준다.
  const { groups } = useNearbyGroups(mapObject);

  return (
    <>
      <KakaoMap onMapReady={setMapObject} />
      <BottomMenu onMoveToCurrentLocation={moveToCurrentLocation} />
      <BottomSheet groups={groups} />
      <Menubar />
    </>
  );
}

export default Home;
