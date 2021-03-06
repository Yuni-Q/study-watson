import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { Link } from '../../routes';
import { LOG_OUT_REQUEST } from '../../reducers/user';

const StyledPhoto = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #595959;
  margin: 1.5rem 0 1rem 0;
`;

const StyledName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4D5256;
`;

const StyledText = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: #878D91;
`;

const StyledItem = styled.li`
  width: 100%;
  padding: 0.8rem 0;
  & :last-child {
    border-top: 1px solid #EDEDED;
  }
`;

const StyledLabel = styled.span`
  font-size: 0.9rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #4D5256;
`;

const StyledProfile = styled.div`
  width: calc(100vw - 2rem);
  margin: auto;
  height: calc(100vh - 56px);
`;

const StyledContainer = styled.ul`
  width: 100%;
  margin-top: 2rem;
`;

const StyledIcon = styled.img`
  margin-right: 1rem;
`;

const ProfileForm = ({ user }) => {
  const { nickname, email, phoneNumber, imgProfile } = user;
  const dispatch = useDispatch();
  const onClick = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <StyledProfile>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <StyledPhoto src={imgProfile} alt="" />
        <StyledName>{nickname}</StyledName>
        <StyledText>{email}</StyledText>
        <StyledText>{phoneNumber}</StyledText>
        <StyledContainer>
          <StyledItem>
            <Link route="/editProfile" href="/editProfile">
              <a>
                <StyledLabel>
                  <StyledIcon
                    src="/static/icon-edit.svg"
                    alt="edit icon"
                  />
                  프로필 수정
                  </StyledLabel>
              </a>
            </Link>
          </StyledItem>
          <StyledItem>
            <div onClick={onClick}>
              <StyledLabel>
                <StyledIcon
                  src="/static/icon-logout.svg"
                  alt="logout icon"
                />
                로그아웃
                </StyledLabel>
            </div>
          </StyledItem>
          <StyledItem>
            <Link route="/withdraw" href="/withdraw">
              <a>
                <StyledLabel>
                  <StyledIcon
                    src="/static/icon-withdraw.svg"
                    alt="withdraw icon"
                  />
                  회원탈퇴
                  </StyledLabel>
              </a>
            </Link>
          </StyledItem>
        </StyledContainer>
      </div>
    </StyledProfile>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileForm;
