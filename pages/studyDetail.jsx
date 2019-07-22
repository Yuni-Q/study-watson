import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Link } from '../routes';
import Header from '../containers/Header';
import {
  LOAD_SCHEDULES_REQUEST,
  DELETE_SCHEDULE_REQUEST,
} from '../reducers/schedule';
import {
  WITHDRAW_STUDY_REQUEST,
  LOAD_STUDY_MEMBERSHIPS_REQUEST,
} from '../reducers/study';

const studyDetail = ({ studyId, token }) => {
  const { schedules } = useSelector(state => state.schedule);
  const { pk: memberId, role } = useSelector(state => state.study.memberships);

  const filterSchedules =
    schedules &&
    schedules.filter(schedule => {
      return schedule.startAt > new Date().toISOString();
    });

  const recentSchedules = [...filterSchedules];
  recentSchedules.sort((a, b) => {
    if (a.startAt > b.startAt) {
      return 1;
    }
    return -1;
  });

  const dispatch = useDispatch();

  const deleteSchedule = event => {
    if (window.confirm('스케쥴을 삭제 하시겠습니까?')) {
      const { pk } = event.currentTarget.dataset;
      dispatch({
        type: DELETE_SCHEDULE_REQUEST,
        data: {
          pk,
          token,
        },
      });
    }
  };

  const modifySchedule = pk => async () => {
    console.log('temp:', pk);
  };

  const onClickWithdrawStudy = () => {
    if (window.confirm('스터디를 탈퇴 하시겠습니까?')) {
      dispatch({
        type: WITHDRAW_STUDY_REQUEST,
        data: {
          token,
          memberId,
        },
      });
    }
  };

  return (
    <div>
      <Header />
      <Link route={`/addSchedule/${studyId}`} href={`/addSchedule/${studyId}`}>
        <a>일정 생성</a>
      </Link>
      <div>
        {recentSchedules && recentSchedules.length > 0 && (
          <div
            key={recentSchedules[0].pk}
            style={{ border: '1px solid', margin: '30px 0' }}
          >
            <div>location</div>
            <div>{recentSchedules[0].location}</div>
            <div>description</div>
            <div>{recentSchedules[0].description}</div>
            <div>투표 만료 시간</div>
            <div>{recentSchedules[0].voteEndAt}</div>
            <div>스터디 시작 시간</div>
            <div>{recentSchedules[0].startAt}</div>
            <div>스터디 시간</div>
            <div>{recentSchedules[0].studyingTime}</div>
            <div data-pk={recentSchedules[0].pk} onClick={modifySchedule}>
              [수정]
            </div>
            <div data-pk={recentSchedules[0].pk} onClick={deleteSchedule}>
              [삭제]
            </div>
            {(role === 'manager' || role === 'sub_manager') && (
              <Link
                route={`/schedule/${recentSchedules[0].pk}`}
                href={`/schedule/${recentSchedules[0].pk}`}
              >
                <a>
                  <div>[출결 관리]</div>
                </a>
              </Link>
            )}
          </div>
        )}
      </div>
      <Link
        route={`/studyMembers/${studyId}`}
        href={`/studyMembers/${studyId}`}
      >
        <a>
          <div>출석 관리</div>
        </a>
      </Link>
      <Link
        route={`/studyMembersInfo/${studyId}`}
        href={`/studyMembersInfo/${studyId}`}
      >
        <a>
          <div>멤버 정보</div>
        </a>
      </Link>
      <Link
        route={`/studyDetail/${studyId}/beforeStudy`}
        href={`/studyDetail/${studyId}/beforeStudy`}
      >
        <a>
          <div>이전 스터디</div>
        </a>
      </Link>
      <Link
        route={`/studyDetail/${studyId}/afterStudy`}
        href={`/studyDetail/${studyId}/afterStudy`}
      >
        <a>
          <div>이후 스터디</div>
        </a>
      </Link>
      <div onClick={onClickWithdrawStudy}>스터디 나가기</div>
    </div>
  );
};

studyDetail.getInitialProps = ({ ctx, token, pk }) => {
  const { studyId = 0 } = ctx.query;
  ctx.store.dispatch({
    type: LOAD_SCHEDULES_REQUEST,
    data: {
      studyId,
      token,
    },
  });
  ctx.store.dispatch({
    type: LOAD_STUDY_MEMBERSHIPS_REQUEST,
    data: {
      studyId,
      pk,
      token,
    },
  });
  return {
    studyId,
    token,
  };
};

studyDetail.propTypes = {
  studyId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
};

export default studyDetail;
