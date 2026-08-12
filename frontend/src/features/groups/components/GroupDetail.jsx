import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button/Button';
import {
  getGroupById,
  createReservation,
  getGroupJoinRequests,
  updateJoinRequestStatus,
} from '../api/groupsApi';
import { useAuthUser } from '../../auth';
import { ApiError } from '../../../infrastructure/api/apiClient';
import './GroupDetail.css';

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

function formatMeetAt(meetAt) {
  if (!meetAt) return '시간 정보 없음';
  const parsed = new Date(meetAt);
  if (Number.isNaN(parsed.getTime())) return meetAt;
  const period = parsed.getHours() < 12 ? '오전' : '오후';
  const hour12 = ((parsed.getHours() + 11) % 12) + 1;
  const minutes = String(parsed.getMinutes()).padStart(2, '0');
  return `${parsed.getMonth() + 1}월 ${parsed.getDate()}일(${WEEKDAY[parsed.getDay()]}) ${period} ${hour12}:${minutes}`;
}

function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuthUser();

  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 로그인한 내가 이 모임을 만든 본인(호스트)인지. group.createUser.id와
  // 내 user.id를 비교한다 — 로그인 정보/모임 정보가 둘 다 준비된 뒤에만 판단한다.
  const isHost = Boolean(user && group?.createUser?.id === user.id);

  const [joinRequests, setJoinRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  // 신청 카드를 눌렀을 때만 메시지를 펼쳐서 보여준다 (아코디언).
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  // 수락/거절 처리 중인 신청 id — 처리 중엔 그 카드의 버튼만 비활성화한다.
  const [processingRequestId, setProcessingRequestId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError('');
    getGroupById(groupId)
      .then((data) => {
        if (!cancelled) setGroup(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err instanceof ApiError ? err.message : '모임 정보를 불러오지 못했습니다.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [groupId]);

  // 본인이 만든 모임일 때만 신청 목록(대기 중)을 불러온다.
  useEffect(() => {
    if (!isHost) return;
    let cancelled = false;
    setIsLoadingRequests(true);
    setRequestsError('');
    getGroupJoinRequests(groupId, 'PENDING')
      .then((data) => {
        if (!cancelled) setJoinRequests(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) {
          setRequestsError(
            err instanceof ApiError ? err.message : '신청 목록을 불러오지 못했습니다.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingRequests(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isHost, groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      // role은 항상 MEMBER — createReservation이 기본값으로 채워준다.
      await createReservation(groupId, { message: message.trim() || undefined });
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : '참여 신청에 실패했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestDecision = async (reservationId, status) => {
    setActionError('');
    setProcessingRequestId(reservationId);
    try {
      await updateJoinRequestStatus(groupId, reservationId, status);
      // 처리된 신청은 대기 목록에서 바로 빼준다.
      setJoinRequests((prev) => prev.filter((req) => req.id !== reservationId));
      // 수락한 경우 참여 인원 수가 바뀌므로 모임 정보를 다시 불러온다.
      if (status === 'APPROVED') {
        getGroupById(groupId).then(setGroup).catch(() => {});
      }
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : '처리 중 오류가 발생했습니다.'
      );
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <div className="group-detail-screen">
      <div className="group-detail-screen__header">
        <button
          type="button"
          className="group-detail-screen__back"
          aria-label="뒤로 가기"
          onClick={() => navigate(-1)}
        >
          ←
        </button>
        <h1 className="group-detail-screen__header-title">모임 정보</h1>
      </div>

      {isLoading ? (
        <div className="group-detail-screen__empty">
          <p>불러오는 중...</p>
        </div>
      ) : loadError ? (
        <div className="group-detail-screen__empty">
          <p>{loadError}</p>
        </div>
      ) : (
        group && (
          <div className="group-detail-screen__body">
            {group.imgUrl && (
              <div className="group-detail-screen__cover">
                <img
                  src={`http://localhost:8080/upload_imgs/${group.imgUrl}`}
                  alt={group.title}
                />
              </div>
            )}

            {/* 모임 제목 */}
            <h2 className="group-detail-screen__title">{group.title}</h2>

            {/* 방장의 프로필 */}
            <div className="group-detail-screen__host box">
              <span className="group-detail-screen__host-avatar" aria-hidden="true">
                {group.createUser?.nickname?.charAt(0) ?? '?'}
              </span>
              <div>
                <p className="group-detail-screen__host-label">방장</p>
                <p className="group-detail-screen__host-name">
                  {group.createUser?.nickname ?? '알 수 없음'}
                </p>
              </div>
            </div>

            {/* 모임 만나는 시간 / 모임 장소 / 현재 참여 인원 */}
            <ul className="group-detail-screen__meta box">
              <li>
                <span aria-hidden="true">🕒</span>
                <span>{formatMeetAt(group.meetAt)}</span>
              </li>
              <li>
                <span aria-hidden="true">📍</span>
                <span>{group.address || '장소 정보 없음'}</span>
              </li>
              <li>
                <span aria-hidden="true">👥</span>
                <span>
                  참여 인원 {group.currentMemberCount ?? 0} / {group.maxPeople ?? '-'}명
                </span>
              </li>
            </ul>

            {/* 모임 내용 */}
            <section className="group-detail-screen__section">
              <h3>모임 소개</h3>
              <p className="group-detail-screen__content">{group.content}</p>
            </section>

            {/* 모임 참여 신청 폼 — 본인이 만든 모임이면 신청 폼 대신 들어온 신청 목록을 보여준다 */}
            <section className="group-detail-screen__section">
              {isHost ? (
                <>
                  <h3>모임 신청 목록</h3>
                  {isLoadingRequests ? (
                    <div className="group-detail-screen__notice box">
                      <p>불러오는 중...</p>
                    </div>
                  ) : requestsError ? (
                    <div className="group-detail-screen__notice box">
                      <p>{requestsError}</p>
                    </div>
                  ) : joinRequests.length === 0 ? (
                    <div className="group-detail-screen__notice box">
                      <p>아직 들어온 신청이 없습니다.</p>
                    </div>
                  ) : (
                    <>
                      {actionError && (
                        <p className="group-detail-screen__error">{actionError}</p>
                      )}
                      <ul className="group-detail-screen__requests">
                        {joinRequests.map((req) => {
                          const isExpanded = expandedRequestId === req.id;
                          const isProcessing = processingRequestId === req.id;
                          return (
                            <li key={req.id} className="group-detail-screen__request box">
                              <button
                                type="button"
                                className="group-detail-screen__request-row"
                                aria-expanded={isExpanded}
                                onClick={() =>
                                  setExpandedRequestId((prev) =>
                                    prev === req.id ? null : req.id
                                  )
                                }
                              >
                                <span
                                  className="group-detail-screen__request-avatar"
                                  aria-hidden="true"
                                >
                                  {req.userNickname?.charAt(0) ?? '?'}
                                </span>
                                <div className="group-detail-screen__request-body">
                                  <p className="group-detail-screen__request-name">
                                    {req.userNickname ?? '알 수 없음'}
                                  </p>
                                  {/* 메시지는 평소엔 숨겨두고, 카드를 눌렀을 때만 펼쳐서 보여준다 */}
                                  {isExpanded && req.message && (
                                    <p className="group-detail-screen__request-message">
                                      {req.message}
                                    </p>
                                  )}
                                  {isExpanded && !req.message && (
                                    <p className="group-detail-screen__request-message group-detail-screen__request-message--empty">
                                      남긴 메시지가 없습니다.
                                    </p>
                                  )}
                                </div>
                                <span
                                  className="group-detail-screen__request-chevron"
                                  aria-hidden="true"
                                >
                                  {isExpanded ? '▲' : '▼'}
                                </span>
                              </button>

                              <div className="group-detail-screen__request-actions">
                                <Button
                                  name={isProcessing ? '처리 중...' : '거절'}
                                  variant="outline"
                                  disabled={isProcessing}
                                  onClick={() => handleRequestDecision(req.id, 'REJECTED')}
                                />
                                <Button
                                  name={isProcessing ? '처리 중...' : '수락'}
                                  disabled={isProcessing}
                                  onClick={() => handleRequestDecision(req.id, 'APPROVED')}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h3>참여 신청</h3>
                  {isAuthLoading ? null : !user ? (
                    <div className="group-detail-screen__notice box">
                      <p>참여 신청은 로그인 후 가능합니다.</p>
                      <Button name="로그인하러 가기" onClick={() => navigate('/login')} />
                    </div>
                  ) : isSubmitted ? (
                    <div className="group-detail-screen__notice box">
                      <p>🎉 신청이 접수됐어요! 모임장의 승인을 기다려주세요.</p>
                    </div>
                  ) : (
                    <form className="group-detail-screen__join-form" onSubmit={handleSubmit}>
                      <textarea
                        rows={4}
                        placeholder="간단한 소개나 하고 싶은 말을 남겨보세요 (선택)"
                        style={{ resize: 'none' }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      {submitError && (
                        <p className="group-detail-screen__error">{submitError}</p>
                      )}
                      <Button
                        name={isSubmitting ? '신청 중...' : '참여 신청하기'}
                        type="submit"
                        disabled={isSubmitting}
                      />
                    </form>
                  )}
                </>
              )}
            </section>
          </div>
        )
      )}
    </div>
  );
}

export default GroupDetail;
