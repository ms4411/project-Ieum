import { useState } from 'react';

// 카카오톡 공지사항처럼 평소엔 한 줄로 작게 보이다가, 클릭하면 모집글 전체
// 내용을 펼쳐서 보여주는 아코디언 컴포넌트.
function GroupNotice({ title, content }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group-notice">
      <button
        type="button"
        className="group-notice__summary"
        onClick={() => setIsExpanded((prev) => !prev)}
        aria-expanded={isExpanded}
      >
        <span className="group-notice__icon" aria-hidden="true">📌</span>
        <span className="group-notice__title">{title}</span>
        <span className="group-notice__chevron" aria-hidden="true">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && <p className="group-notice__content">{content}</p>}
    </div>
  );
}

export default GroupNotice;
