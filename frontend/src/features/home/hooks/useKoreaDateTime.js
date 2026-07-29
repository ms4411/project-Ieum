import { useState, useCallback } from 'react';

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function getKoreaNowISOString() {
  return new Date(Date.now() + KST_OFFSET_MS).toISOString();
}

// Menubar에 있던 한국 시간 계산 + 날짜/시간 입력 상태 로직을 추출했다.
export function useKoreaDateTime() {
  const [date, setDate] = useState(() => getKoreaNowISOString().slice(0, 10));
  const [time, setTime] = useState(() => getKoreaNowISOString().slice(11, 16));

  const resetToNow = useCallback(() => {
    const now = getKoreaNowISOString();
    setDate(now.slice(0, 10));
    setTime(now.slice(11, 16));
  }, []);

  return { date, setDate, time, setTime, resetToNow };
}
