import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Axios from 'axios';

import { Link } from '../routes';

import {
  LOAD_SCHEDULES_REQUEST,
  DELETE_SCHEDULE_REQUEST,
} from '../reducers/schedule';
import { changeFormat } from '../common/changeFormat';

const StyledScheduleCard = styled.div`
  position: relative;
  width: 100%;
  height: 196px;
  box-shadow: 10px 10px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #fff;
`;

const StyledCardTitle = styled.h2`
  font-size: 1rem;
  color: #4d5256;
  font-weight: 900;
`;

const StyledCardText = styled.div`
  font-size: 0.8rem;
  color: #878d91;
  margin-bottom: 0.5rem;
`;

const StyledAttendBtnContainer = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-direction: row;
`;

const StyledAttendBtn = styled.button`
  font-size: 0.8rem;
  color: #878d91;
  background-color: #ededed;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  border: none;
  margin-left: 0.5rem;
`;

const StyledDetailBtn = styled.button`
  position: absolute;
  z-index: 3;
  top: 1rem;
  right: 1rem;
  border: none;
  background-color: transparent;
  padding: 0;
  outline: none;
`;

const StyledDetailMenu = styled.div`
  position: fixed;
  z-index: 4;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0 1rem;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  transform: ${props => (props.show ? 'translateY(0)' : 'translateY(100%)')};
  transform-origin: bottom;
  transition: all 0.3s ease-in-out;
`;


const StyledDetailItem = styled.div`
  width: 100%;
  padding: 0.8rem 0;
  & :last-child {
    border-top: 1px solid #EDEDED;
  }
`;

const StyledBackground = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${props => (props.show ? 'block' : 'none')};
`;

const StyledLabel = styled.span`
  font-size: 0.9rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #4D5256;
`;

const StyledIcon = styled.img`
  margin-right: 1rem;
`;

const ScheduleCard = ({ studyId, token, user, role }) => {
  const [click, setClick] = useState(false);
  const { schedules } = useSelector(state => state.schedule);

  const dispatch = useDispatch();

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

  const onClickVote = async event => {
    try {
      await Axios.patch(
        `https://study-watson.lhy.kr/api/v1/study/attendances/${
        event.target.dataset.pk
        }/`,
        {
          user,
          vote: event.target.dataset.vote,
        },
      );
      dispatch({
        type: LOAD_SCHEDULES_REQUEST,
        data: {
          studyId,
          token,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onClickDetailBtn = () => {
    setClick(!click);
  };

  const closeMenu = () => {
    setClick(!click);
  }

  return (
    <>
      <StyledScheduleCard>
        <div key={recentSchedules[0].pk}>
          <StyledCardTitle style={{ marginBottom: '1rem' }}>
            {recentSchedules[0].subject}
          </StyledCardTitle>
          <StyledCardText>
            <img
              src="/static/icon-calendar.svg"
              alt="calendar icon"
              style={{ marginRight: '0.5rem' }}
            />
            {changeFormat(recentSchedules[0].startAt)}
          </StyledCardText>
          <StyledCardText>
            <img
              src="/static/icon-location.svg"
              alt="calendar icon"
              style={{ marginRight: '0.5rem' }}
            />
            {recentSchedules[0].location}
          </StyledCardText>
          <StyledCardText>
            <img
              src="/static/icon-check.svg"
              alt="check icon"
              style={{ marginRight: '0.5rem' }}
            />
            {changeFormat(recentSchedules[0].voteEndAt)}
            &nbsp;까지
          </StyledCardText>

          <StyledAttendBtnContainer>
            <StyledAttendBtn
              onClick={onClickVote}
              data-vote="attend"
              data-pk={
                recentSchedules[0].selfAttendance &&
                recentSchedules[0].selfAttendance.pk
              }
            >
              참석
            </StyledAttendBtn>
            <StyledAttendBtn
              onClick={onClickVote}
              data-vote="absent"
              data-pk={
                recentSchedules[0].selfAttendance &&
                recentSchedules[0].selfAttendance.pk
              }
            >
              불참
            </StyledAttendBtn>
            <StyledAttendBtn
              onClick={onClickVote}
              data-vote="late"
              data-pk={
                recentSchedules[0].selfAttendance &&
                recentSchedules[0].selfAttendance.pk
              }
            >
              지각
            </StyledAttendBtn>
          </StyledAttendBtnContainer>
          {(role === 'manager' || role === 'sub_manager') && (
            <StyledDetailBtn type="button" onClick={onClickDetailBtn}>
              <img src="/static/icon-detail.svg" alt="detail icon" />
            </StyledDetailBtn>
          )}
        </div>
      </StyledScheduleCard>
      <StyledDetailMenu show={click}>
        <StyledDetailItem>
          <Link
            route={`/editSchedule/${recentSchedules[0].pk}`}
            href={`/editSchedule/${recentSchedules[0].pk}`}
          >
            <a>
              <StyledLabel data-pk={recentSchedules[0].pk}>
                <StyledIcon
                  src="/static/icon-edit.svg"
                  alt="edit icon"
                />
                일정 수정
              </StyledLabel>
            </a>
          </Link>
        </StyledDetailItem>
        <StyledDetailItem>
          <StyledLabel data-pk={recentSchedules[0].pk} onClick={deleteSchedule}>
            <StyledIcon
              src="/static/icon-delete.svg"
              alt="delete icon"
            />
            일정 삭제
          </StyledLabel>
        </StyledDetailItem>
        <StyledDetailItem>
          <Link
            route={`/schedule/${recentSchedules[0].pk}`}
            href={`/schedule/${recentSchedules[0].pk}`}
          >
            <a>
              <StyledLabel>
                <StyledIcon
                  src="/static/icon-checkattend.svg"
                  alt="checkattend icon"
                />
                출결 관리
              </StyledLabel>
            </a>
          </Link>
        </StyledDetailItem>
        <StyledDetailItem onClick={closeMenu}>
          <StyledLabel>
            <StyledIcon
              src="/static/icon-close.svg"
              alt="close icon"
            />
            취소
          </StyledLabel>
        </StyledDetailItem>
      </StyledDetailMenu>
      <StyledBackground show={click} onClick={closeMenu} />
    </>
  );
};

ScheduleCard.propTypes = {
  studyId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default ScheduleCard;