import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

import { diffToNextMonday } from 'utils';
import { Text } from 'components/basic/Text/text.style';
import { UserProfileContext } from '../../../../hooks/useUserProfile';

const TimerWrapper = styled.div`
  font-family: 'Open Sans';
  background: #1e1e29;
  border: 1px solid #1b1b26;
  border-radius: 8px;
  align-self: flex-end;
  display: flex;
  margin-left: auto;
  width: fit-content;
  align-items: center;
  padding: ${DV.sizes.basePadding}px ${DV.sizes.basePadding * 3}px ${DV.sizes.basePadding}px
    ${DV.sizes.basePadding * 3}px;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    margin: 0 auto 1rem;
  }
`;

const TimerCount = styled(Text)`
  font-family: NotoSansMono;

  @media only screen and (max-width: ${DV.breakpoints.smallDesktop}) {
    font-size: 24px;
  }
  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    font-size: 22px;
  }
`;

const RemainingCount = styled(TimerCount)`
  text-align: center;
`;

const TimerLabel = styled(Text)`
  @media only screen and (max-width: ${DV.breakpoints.mobile}) {
    font-size: 12px;
  }
`;

const Timer = () => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const { userProfile } = useContext(UserProfileContext);

  useEffect(() => {
    const diff = diffToNextMonday(now);
    setSeconds(diff.seconds);
    setMinutes(diff.minutes);
    setHours(diff.hours);
    setDays(diff.days);
  }, [now]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="timer-wrapper flex mt-2 items-center">
      <p className={'text-gray mr-2 text-sm'}>Next Round:</p>
      <p className={'text-white font-medium text-md lg:text-2xl'}>
        {days} : {hours} : {minutes} : {seconds}
      </p>
    </div>
  );
};

export default Timer;
