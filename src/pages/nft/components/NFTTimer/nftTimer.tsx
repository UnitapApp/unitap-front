import { useEffect, useState } from 'react';

interface NFTTimerProps {
	className?: string;
	deadline: Date;
}

const NFTTimer = ({ className, deadline }: NFTTimerProps) => {
	const [now, setNow] = useState(new Date());
	const [days, setDays] = useState('00');
	const [hours, setHours] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [seconds, setSeconds] = useState('00');

	useEffect(() => {
		// calculate time difference between now and deadline
		const diff = deadline.getTime() - now.getTime();
		// time calculations for days, hours, minutes and seconds
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		// set the state with the time difference
		setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
		setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
		setHours(hours < 10 ? `0${hours}` : hours.toString());
		setDays(days < 10 ? `0${days}` : days.toString());
	}, [now, deadline]);

	useEffect(() => {
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => {
			clearInterval(interval);
		};
	}, []);

	if (deadline.getTime() < now.getTime()) {
		return null;
	}

	return (
		<div className={`nft-timer w-full bg-gray10 border-2 border-gray40 rounded-2xl py-2 ${className}`}>
			<div className="nft-timer__time flex justify-evenly text-xl font-semibold px-14 mb-1.5">
				<p className="time flex-1 text-center text-gradient-primary">{days}</p>
				<p className="time flex-1 text-center text-gradient-primary">:</p>
				<p className="time flex-1 text-center text-gradient-primary">{hours}</p>
				<p className="time flex-1 text-center text-gradient-primary">:</p>
				<p className="time flex-1 text-center text-gradient-primary">{minutes}</p>
				<p className="time flex-1 text-center text-gradient-primary">:</p>
				<p className="time flex-1 text-center text-gradient-primary">{seconds}</p>
			</div>
			<div className="nft-timer__label flex justify-evenly text-gray90 text-xs px-8">
				<p className="label flex-1 text-center">days</p>
				<p className="label flex-1 text-center">hours</p>
				<p className="label flex-1 text-center">minutes</p>
				<p className="label flex-1 text-center">seconds</p>
			</div>
		</div>
	);
};

export default NFTTimer;
