import { useEffect, useState } from 'react';

import { diffToNextMonth } from 'utils';

const Timer = () => {
	const [now, setNow] = useState(new Date());
	const [days, setDays] = useState('00');
	const [hours, setHours] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [seconds, setSeconds] = useState('00');

	useEffect(() => {
		const diff = diffToNextMonth(now);
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
		<div className="timer-wrapper flex flex-col mt-2 items-center absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray20 py-2 px-4 rounded-t-2xl">
			<p className="text-gray90 text-xs mb-1.5">This Round ends in:</p>
			<span className="relative w-52 h-7 text-center">
				<p className="timer__background-number text-2xl left-0 absolute text-gray70">88:88:88:88</p>
				<p className="timer__number text-white text-2xl left-0 absolute">
					{days}:{hours}:{minutes}:{seconds}
				</p>
			</span>
		</div>
	);
};

export default Timer;
