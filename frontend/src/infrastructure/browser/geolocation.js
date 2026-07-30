// 브라우저 Geolocation API를 Promise/구독 기반으로 감싼 어댑터

// 요구사항: 위치 업데이트 간격은 최대 10초를 넘을 수 없다.
export const MAX_WATCH_INTERVAL_MS = 10000;

/**
 * 현재 위치를 한 번 조회한다.
 * enableHighAccuracy를 false로 두면 GPS 대신 Wi-Fi/기지국 기반 위치를 쓰기 때문에
 * 훨씬 빠르게 응답한다. maximumAge 덕분에 최근 10초 이내 값이 있으면 재조회 없이
 * 그 값을 즉시 반환한다 ("내 위치" 버튼 지연의 주요 원인이었다).
 */
export function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 정보를 지원하지 않습니다.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      reject,
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: MAX_WATCH_INTERVAL_MS,
        ...options,
      }
    );
  });
}

/**
 * 현재 위치를 주기적으로 구독한다. navigator.geolocation.watchPosition은 기기가
 * 실제로 움직여야 콜백이 오는 경우가 있어, 여기서는 setInterval로 intervalMs마다
 * 명시적으로 재조회해 "최대 몇 초 간격" 요구사항을 정확히 보장한다. intervalMs를
 * 더 크게 넘겨도 MAX_WATCH_INTERVAL_MS(10초)로 자동 제한된다.
 *
 * @param {(position: { lat: number, lng: number }) => void} onUpdate
 * @param {{ intervalMs?: number, onError?: (error: Error) => void }} [options]
 * @returns {() => void} 구독을 해제하는 함수 (컴포넌트 unmount 시 반드시 호출)
 */
export function watchCurrentPosition(
  onUpdate,
  { intervalMs = MAX_WATCH_INTERVAL_MS, onError } = {}
) {
  const safeIntervalMs = Math.min(intervalMs, MAX_WATCH_INTERVAL_MS);
  let isCancelled = false;

  const poll = async () => {
    try {
      const position = await getCurrentPosition();
      if (!isCancelled) onUpdate(position);
    } catch (error) {
      if (!isCancelled && onError) onError(error);
    }
  };

  poll(); // 구독 시작 시 최초 1회 즉시 조회
  const timerId = setInterval(poll, safeIntervalMs);

  return function stopWatching() {
    isCancelled = true;
    clearInterval(timerId);
  };
}
