import React, { useEffect, useState } from 'react';

import { diffToNextMonday } from 'utils';

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
    <div className="timer-wrapper flex mt-2 items-center">
      <p className={'text-gray mr-2 text-sm'}>Next Round:</p>
      <p className={'text-white font-medium text-md lg:text-2xl'}>
        {days} : {hours} : {minutes} : {seconds}
      </p>
    </div>
  );
};

export default Timer;
