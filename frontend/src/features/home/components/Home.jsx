import { useState } from 'react';
import Menubar from './Menubar';
import KakaoMap from './KakaoMap';
import BottomSheet from './BottomSheet';
import BottomMenu from './BottomMenu';
import { useCurrentLocationMarker } from '../hooks/useCurrentLocationMarker';

function Home() {
  const [mapObject, setMapObject] = useState(null);
  const [groups, setGroups] = useState([]);
  const { moveToCurrentLocation } = useCurrentLocationMarker(mapObject);

  return (
    <>
      <KakaoMap onMapReady={setMapObject} />
      <BottomMenu onMoveToCurrentLocation={moveToCurrentLocation} />
      <BottomSheet groups={groups} setGroups={setGroups} />
      <Menubar onMoveToCurrentLocation={moveToCurrentLocation} />
    </>
  );
}

export default Home;
