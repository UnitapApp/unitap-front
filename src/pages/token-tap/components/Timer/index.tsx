import { FC, useEffect, useMemo, useState } from 'react';

const TokenDeadlineTimer: FC<{ deadline: string }> = ({ deadline }) => {
	const expireDate = useMemo(() => new Date(deadline), [deadline]);

	const [now, setNow] = useState(new Date());

	const [days, setDays] = useState('00');
	const [hours, setHours] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [seconds, setSeconds] = useState('00');

	useEffect(() => {
		const diffTime = Math.ceil((expireDate.getTime() - now.getTime()) / 1000);

		setSeconds(String(diffTime % 60).padStart(2, '0'));
		setMinutes(String(Math.floor(diffTime / 60) % 60).padStart(2, '0'));
		setHours(String(Math.floor(diffTime / 3600) % 24).padStart(2, '0'));
		setDays(String(Math.floor(diffTime / 86400)).padStart(2, '0'));
	}, [expireDate, now]);

	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="bg-gray20 flex items-center justify-center px-5 py-2 absolute top-0 bottom-0 left-1/2 -translate-x-1/2">
			<p className="text-xs text-white">
				{days}:{hours}:{minutes}:{seconds}
			</p>
		</div>
	);
};

export default TokenDeadlineTimer;
