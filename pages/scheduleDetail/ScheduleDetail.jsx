import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';

import checkMember from '../../common/checkMember';
import checkLogin from '../../common/checkLogin';
import Header from '../../components/Header';
import redirect from '../../common/redirect'
import ScheduleDetailForm from './ScheduleDetailForm';


const ScheduleDetail = ({ schedule, attendList, lateList, absentList, noneList, user }) => {
  return (
    <>
      <Header user={user} />
      <ScheduleDetailForm schedule={schedule} attendList={attendList} lateList={lateList} absentList={absentList} noneList={noneList} />
    </>
  );
};

ScheduleDetail.getInitialProps = async ({ ctx, token, res, pk }) => {
  const user = await checkLogin({ res, token })
  const { studyId, scheduleId } = ctx.query;
  if (!scheduleId) {
    redirect({ res });
  }
  const membership = await checkMember({ res, token, studyId, pk });
  if (membership.role !== 'manager' && membership.role !== 'sub_manager') {
    studyDetail({ res, studyId });
  }
  try {
    const result = await axios.get(
      `https://study-watson.lhy.kr/api/v1/study/schedules/${scheduleId}/`,
      { headers: { Authorization: `Token ${token}` } },
    );
    const schedule = result.data;
    const attendList = [];
    const lateList = [];
    const absentList = [];
    const noneList = [];
    schedule.attendanceSet.forEach(attendance => {
      if (attendance.att === 'attend') {
        attendList.push(attendance);
      } else if (attendance.att === 'late') {
        lateList.push(attendance);
      } else if (attendance.att === 'absent') {
        absentList.push(attendance);
      } else {
        noneList.push(attendance);
      }
    });
    return {
      schedule: result.data,
      attendList,
      lateList,
      absentList,
      noneList,
      user,
    };
  } catch (error) {
    console.log(error);
    redirect({ res });
  }
};

ScheduleDetail.propTypes = {
  user: PropTypes.object.isRequired,
  schedule: PropTypes.object.isRequired,
  attendList: PropTypes.array.isRequired,
  lateList: PropTypes.array.isRequired,
  absentList: PropTypes.array.isRequired,
  noneList: PropTypes.array.isRequired,
}

export default ScheduleDetail;
