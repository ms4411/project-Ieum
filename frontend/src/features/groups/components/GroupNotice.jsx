import { useState, useEffect } from 'react';
import { getGroupById } from '../api/groupsApi';

function GroupNotice({ group }) {
  // 1. 아코디언 기본값을 true로 바꿔서 테스트해보거나 버튼을 클릭해보세요.
  const [isExpanded, setIsExpanded] = useState(true); 
  const [groupContent, setGroupContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null); // 누락된 상태 정의 추가

  useEffect(() => {
    let cancelled = false;

    getGroupById(group.id)
      .then((data) => {
        if (!cancelled) {
          // 응답 데이터 구조에 맞춰 필요시 data.data 등으로 수정
          setGroupContent(data); 
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err.message || '모임 정보를 불러오지 못했습니다.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [group?.id]);

  return (
    <div className="group-notice">
      <button
        type="button"
        className="group-notice__summary"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <span className="group-notice__icon" aria-hidden="true">📌</span>
        <span className="group-notice__title">{group?.title ?? '제목 없음'}</span>
        <span className="group-notice__chevron" aria-hidden="true">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="group-notice__content">
          {isLoading && <p>로딩 중...</p>}
          {loadError && <p className="error">{loadError}</p>}
          {!isLoading && !loadError && (
            <>
              <p>{group?.content}</p>
              <hr></hr>
              <p>장소: {groupContent?.address}</p>
              <p>시간: {groupContent?.meetAt}</p>
              <p>
                인원: {groupContent?.currentMemberCount ?? 0} / {groupContent?.maxPeople ?? '-'}명
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default GroupNotice;