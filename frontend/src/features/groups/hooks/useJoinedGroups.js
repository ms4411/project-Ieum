import { useState, useEffect, useCallback } from 'react';
import { getMyGroups } from '../api/groupsApi';
import { getAccessToken } from '../../../infrastructure/api/tokenStorage';

export function useJoinedGroups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    // 로그인 전에는 호출해봐야 401만 나므로 조용히 건너뛴다.
    if (!getAccessToken()) {
      setGroups([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // role을 넘기지 않으면 HOST/MEMBER 상관없이 참여 중인 모임을 모두 가져온다.
      const result = await getMyGroups();
      setGroups(result ?? []);
    } catch (err) {
      setError(err);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { groups, isLoading, error, refetch: load };
}
