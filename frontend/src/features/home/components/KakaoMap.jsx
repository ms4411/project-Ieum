import { useEffect, useRef } from 'react';
import { createKakaoMap } from '../../../infrastructure/kakao/kakaoMap';
import './KakaoMap.css';

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };
const DEFAULT_ZOOM_LEVEL = 3;

function KakaoMap({ onMapReady }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !containerRef.current) return;

    const map = createKakaoMap(containerRef.current, {
      center: DEFAULT_CENTER,
      level: DEFAULT_ZOOM_LEVEL,
    });

    onMapReady(map);
  }, [onMapReady]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default KakaoMap;
