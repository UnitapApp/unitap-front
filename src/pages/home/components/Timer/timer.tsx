import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { DV } from 'components/basic/designVariables';

import { diffToNextMonday } from 'utils';
import { Text } from 'components/basic/Text/text.style';

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
  padding: ${DV.sizes.basePadding}px ${DV.sizes.basePadding * 6}px ${DV.sizes.basePadding}px
    ${DV.sizes.basePadding * 3}px;

  @media only screen and (max-width: ${DV.breakpoints.tablet}) {
    margin: 0 auto 1rem;
  }
`;

const Timer = () => {
  const [now, setNow] = useState(new Date());
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

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
    <TimerWrapper>
      <Text color="gray" fontSize="12" mb={0} mr={3}>
        next launch in
      </Text>
      <Text color="white" fontSize="24" mb={0}>
        {days}:{hours}:{minutes}:{seconds}
      </Text>
    </TimerWrapper>
  );
};

export default Timer;
