"use client"

import { ClaimAndEnrollButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { useEffect, useMemo, useState } from "react";
import { getAssetUrl, replacePlaceholders, shortenAddress } from "@/utils";
import Image from "next/image";

const QuizRaffleList = () => {
	return (
		<div><QuizCard /></div>
	)
}

const QuizCard = () => {
	const [showAllPermissions, setShowAllPermissions] = useState(false);
	const sponsors: any = ['test', 'test', 'test'];
	const prize_amount = 1200.00;
	const prize_symbol = 'USDT';
	const constraints = ['Aura Authentication', 'Connected Metamask', 'Owner', 'Aura Authentication', 'Connected Metamask']
	const peopleEnrolled = 1398
	const maxUserEntry = 1400
	const title = 'Optimism Quiz Tap'
	const description = 'Get ready for a fun ride into the future'

	return (
		<div className="quiz_card_wrap relative bg-quiz-header-bg rounded-2xl flex items-center justify-center border-2 border-gray60 lg:border-l-gray10 ">
			<div className="left-side flex items-center relative min-w-[165px] min-h-[175px] lg:bg-[#10101B] lg:shadow-[inset_-2px_0px_0_2px_#242431] rounded-tr-[100px] rounded-br-[100px] before:content-[''] lg:before:absolute lg:before:bg-[#1e1e273a] lg:before:top-[-17px] before:w-5 before:h-5 lg:before:shadow-[-26px_-0px_0_15px_#10101B,inset_1px_1px_0_1px_#242431] before:rounded-tl-[150px] before:rounded-bl-[150px] lg:before:left-20  after:content-['']  after:absolute  lg:after:bg-[#1d1d27a4]  lg:after:bottom-[-17px]  after:w-5  after:h-5  lg:after:shadow-[-23px_-0px_0_15px_#10101B,inset_1px_0px_0_1px_#242431]  after:rounded-tl-[100px]  after:rounded-bl-[100px]  lg:after:left-[79px]">
				<div className="relative h-[135px] w-[135px] rounded-[100%] lg:before:absolute lg:before:content-[''] lg:before:bg-[#10101B] lg:before:w-[60px] lg:before:h-[30px] lg:before:bottom-[-45px] lg:after:absolute content-[''] lg:after:bg-[#10101B] lg:after:w-[60px] lg:after:h-[30px] lg:after:top-[-45px]">
					<svg width="135" height="133" viewBox="0 0 135 133" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M67.9194 132.459C104.967 132.459 135 102.86 135 66.3482C135 29.8364 104.967 0.237671 67.9194 0.237671C30.8716 0.237671 0.838379 29.8364 0.838379 66.3482C0.838379 102.86 30.8716 132.459 67.9194 132.459Z" fill="#42C79D" />
						<path d="M50.1631 85.9986C46.0133 85.9986 42.6154 85.0499 39.9695 83.1525C37.3515 81.228 36.0425 78.4633 36.0425 74.9125C36.0425 74.1535 36.126 73.2591 36.2931 72.1749C36.7388 69.7354 37.3793 66.808 38.2149 63.3656C40.5823 54.0414 46.7096 49.3793 56.5689 49.3793C59.2427 49.3793 61.6657 49.813 63.7824 50.7074C65.8991 51.5477 67.5702 52.8488 68.7957 54.5835C70.0211 56.2911 70.6339 58.324 70.6339 60.6822C70.6339 61.3869 70.5503 62.2814 70.3832 63.3656C69.854 66.3743 69.2413 69.3288 68.4893 72.1749C67.2639 76.8099 65.175 80.3064 62.1671 82.6104C59.187 84.8872 55.1764 85.9986 50.1631 85.9986ZM50.9151 78.6801C52.8647 78.6801 54.5079 78.1109 55.8726 76.9996C57.2652 75.8883 58.2679 74.1807 58.8527 71.8496C59.6604 68.6512 60.2732 65.8864 60.6909 63.5011C60.8302 62.7964 60.9137 62.0646 60.9137 61.3056C60.9137 58.2156 59.2705 56.6706 55.9562 56.6706C54.0066 56.6706 52.3355 57.2398 50.943 58.3511C49.5782 59.4625 48.6034 61.1701 48.0186 63.5011C47.378 65.778 46.7653 68.5427 46.1247 71.8496C45.9854 72.5272 45.9019 73.232 45.9019 73.9909C45.874 77.1351 47.5729 78.6801 50.9151 78.6801Z" fill="#F3F4F8" />
						<path d="M73.0587 85.5105C72.6688 85.5105 72.3903 85.402 72.1675 85.1581C72.0004 84.887 71.9447 84.5889 72.0004 84.2365L79.2139 51.168C79.2696 50.7885 79.4645 50.4904 79.7988 50.2464C80.1051 50.0025 80.4393 49.894 80.8014 49.894H94.6992C98.5706 49.894 101.662 50.6801 104.002 52.2251C106.369 53.7972 107.567 56.047 107.567 59.0014C107.567 59.8417 107.455 60.7362 107.26 61.6578C106.397 65.5609 104.642 68.4341 101.968 70.3044C99.3504 72.1746 95.7576 73.0962 91.19 73.0962H84.1436L81.7484 84.2365C81.6648 84.616 81.4977 84.9141 81.1635 85.1581C80.8571 85.402 80.5229 85.5105 80.1608 85.5105H73.0587ZM91.552 66.0759C93.0282 66.0759 94.2815 65.6965 95.3677 64.9104C96.4817 64.1243 97.2059 63.013 97.5679 61.5493C97.6793 60.9801 97.735 60.4651 97.735 60.0314C97.735 59.0556 97.4287 58.2967 96.8438 57.7817C96.2589 57.2396 95.2284 56.9685 93.808 56.9685H87.5414L85.564 66.0759H91.552Z" fill="#F3F4F8" />
						<path d="M66.2294 0C102.803 0 132.459 28.8649 132.459 64.4625C132.459 100.06 102.803 128.925 66.2294 128.925C29.6561 128.925 0 100.078 0 64.4625C0 28.847 29.6561 0 66.2294 0Z" fill="url(#paint0_linear_11015_109918)" />
						<path d="M75.0552 53.1195V53.2142L75.1499 53.2186C83.7235 53.6155 91.2279 54.6636 96.5884 56.1198C99.2694 56.8481 101.409 57.677 102.876 58.5742C104.35 59.4749 105.117 60.4258 105.121 61.3891C105.121 62.352 104.357 63.3025 102.886 64.2032C101.421 65.1002 99.2835 65.9291 96.6035 66.6575C91.2452 68.1137 83.7408 69.1618 75.1671 69.5587L75.0725 69.563V69.6578V99.1653H59.9791V69.6578V69.563L59.8844 69.5587C51.3021 69.1618 43.7847 68.1137 38.4156 66.6574C35.7303 65.9291 33.588 65.1002 32.1193 64.2031C30.6445 63.3023 29.8786 62.3516 29.8786 61.3886C29.8786 60.4257 30.6445 59.475 32.1193 58.5742C33.588 57.6771 35.7303 56.8481 38.4156 56.1198C43.7847 54.6636 51.3021 53.6155 59.8844 53.2186L59.9791 53.2142V53.1195V43.8663V43.767H59.8798H38.8362V29.8786H96.1981V43.767H75.1545H75.0552V43.8663V53.1195ZM75.1757 67.2538L75.1762 67.2538C82.7482 66.9083 89.3654 66.0749 94.0963 64.9313C96.461 64.3597 98.3599 63.7094 99.6721 63.0008C100.328 62.6466 100.842 62.2752 101.194 61.888C101.547 61.5002 101.742 61.0911 101.747 60.6647V60.6636C101.747 60.2369 101.556 59.8275 101.206 59.4395C100.857 59.0521 100.346 58.6808 99.6919 58.3266C98.3842 57.6183 96.488 56.9685 94.1243 56.398C89.3955 55.2566 82.774 54.4274 75.1934 54.0906L75.0897 54.086V54.1898V64.4241C74.4744 64.4857 72.1215 64.6557 67.6638 64.6557C63.8466 64.6557 61.0698 64.4932 59.9963 64.4206V54.2243V54.1205L59.8927 54.1251C52.2949 54.4619 45.6604 55.2911 40.9229 56.4325C38.555 57.003 36.6555 57.6528 35.3457 58.3611C34.6909 58.7153 34.1786 59.0866 33.829 59.474C33.4788 59.862 33.2873 60.2714 33.2873 60.6981C33.2873 61.1248 33.4792 61.5343 33.8298 61.9222C34.1798 62.3096 34.6927 62.6809 35.3482 63.0351C36.6593 63.7434 38.5604 64.3932 40.9294 64.9637C45.669 66.1051 52.3035 66.9342 59.8927 67.271L59.9963 67.2757V67.2591C61.0631 67.3124 63.7727 67.4093 67.5948 67.4093C71.9826 67.4093 74.2174 67.3002 74.9637 67.2637C75.0574 67.2592 75.1276 67.2557 75.1757 67.2538Z" fill="url(#paint1_linear_11015_109918)" stroke="#07B67E" stroke-width="0.198529" />
						<defs>
							<linearGradient id="paint0_linear_11015_109918" x1="66.2294" y1="0" x2="66.2294" y2="128.925" gradientUnits="userSpaceOnUse">
								<stop stop-color="#26A17B" />
								<stop offset="1" stop-color="#20795D" />
							</linearGradient>
							<linearGradient id="paint1_linear_11015_109918" x1="67.4999" y1="29.7793" x2="67.4999" y2="99.2646" gradientUnits="userSpaceOnUse">
								<stop stop-color="white" />
								<stop offset="0.66" stop-color="#D5FFF2" />
							</linearGradient>
						</defs>
					</svg>
				</div>
			</div>
			<div className="right-side w-full p-5 rounded-2xl">
				<div className="top flex flex-col lg:flex-row gap-3 lg:gap-0 items-start justify-between mb-3 lg:mb-0">
					<div className="title-wrap flex flex-col md:flex-row md:items-center justify-center gap-1">
						<div className="title flex items-center gap-1 text-white text-base font-semibold leading-5">
							{title}
							<div className="h-1 w-1 bg-[#D9D9D9] rounded-full"></div>
						</div>
						<div className="text-gray100 text-sm font-normal leading-5">{description}
						</div>
					</div>
					{sponsors.length ?
						<div className="sponsors flex items-center justify-between bg-gray10 rounded-xl h-[38px] gap-5 px-5">
							<p className="text-gray90 text-xs font-medium leading-[22px]">Sponsored By</p>
							{sponsors.map((sponsor: any, index: any) => <div key={index}>{sponsor}</div>)}
						</div> : <></>
					}
				</div>
				<div className="prize_amount  flex gap-[10px] bg-gray50 border border-gray70 h-[30px] rounded-md max-w-[149px] justify-center items-center">
					<p className="text-xs text-gray100 font-normal leading-[22px]">Prize</p>
					<p className="text-sm bg-prize-text-gradient bg-clip-text text-transparent font-semibold leading-[20px]">{prize_amount + ' ' + prize_symbol} </p>
				</div>
				<div className="requirements flex mt-4 gap-2 h-[22px]">
					{(showAllPermissions
						? constraints
						: constraints
						// .filter((permission) => permission.type === "VER")
						// .slice(0, 6)
					).map((permission, key) => (
						<Tooltip
							// onClick={openEnrollModal.bind(null, raffle, "Verify")}
							onClick={() => { console.log('') }}
							className={
								"rounded-lg border border-gray70 bg-gray50 px-3 py-2 transition-colors hover:bg-gray10 "
							}
							key={key}
							// text={replacePlaceholders(
							// 	(permission.isReversed
							// 		? permission.negativeDescription
							// 		: permission.description)!,
							// 	params[permission.name],
							// )}
							text={''}
						>
							<div className="flex items-center gap-3">
								{/* {permission.isReversed && "Not "} */}
								{/* {permission.title} */}
							</div>
						</Tooltip>
					))}

					{constraints.length > 6 && (
						<button
							onClick={setShowAllPermissions.bind(
								null,
								!showAllPermissions,
							)}
							className="z-10 flex items-center rounded-lg border border-gray70 bg-gray60 px-3 py-2 transition-colors"
						>
							<span>
								{showAllPermissions ? "Show less" : "Show more"}
							</span>
							<Image
								width={12}
								height={7}
								alt="angle down"
								src="/assets/images/token-tap/angle-down.svg"
								className={`ml-2 ${showAllPermissions ? "rotate-180" : ""
									} transition-transform`}
							/>
						</button>
					)}

				</div>

				<div className="footer flex flex-col lg:flex-row w-full justify-between lg:items-center mt-3 gap-4 ">
					<div className="counter flex flex-col md:flex-row px-4 py-2 md:items-center justify-between bg-gray10 border-2 rounded-xl border-gray60 w-full max-w-[520px] md:p-0 md:pl-16 md:pr-12">
						<p className="font-medium text-2xs leading-[13.62px] text-gray100">
							{peopleEnrolled + '/' + maxUserEntry} people enrolled
						</p>
						<CardTimer startTime={'0'} FinishTime={'0'} />
					</div>
					<ClaimAndEnrollButton
						height="48px"
						$fontSize="14px"
						$width="252px"
						// disabled={!start}
						className="!w-full min-w-[552px] md:!w-[352px]"
					>
						{" "}
						<div className="relative w-full">
							<p className="bg-g-primary bg-clip-text text-transparent">
								Enroll
							</p>
						</div>
					</ClaimAndEnrollButton>
				</div>
			</div>
		</div>
	)
}

type RaffleCardTimerProps = {
	startTime: string;
	FinishTime: string;
};

const CardTimer = ({
	startTime,
	FinishTime,
}: RaffleCardTimerProps) => {
	const [now, setNow] = useState(new Date());
	const [days, setDays] = useState("00");
	const [hours, setHours] = useState("00");
	const [minutes, setMinutes] = useState("00");
	const [seconds, setSeconds] = useState("00");
	const [start, setStarted] = useState<boolean>(true);

	const startTimeDate = useMemo(() => new Date(startTime), [startTime]);

	const FinishTimeDate = useMemo(
		() => new Date(start ? FinishTime : new Date()),
		[FinishTime, start],
	);

	const deadline = useMemo(
		() =>
			startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
		[startTimeDate, FinishTimeDate, now],
	);

	useEffect(() => {
		const diff = deadline.getTime() - now.getTime();
		if (diff <= 0) {
			setDays("00");
			setHours("00");
			setMinutes("00");
			setSeconds("00");

			return;
		}
		// time calculations for days, hours, minutes and seconds
		const newDays = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);

		setSeconds(seconds < 10 ? `0${seconds}` : seconds.toString());
		setMinutes(minutes < 10 ? `0${minutes}` : minutes.toString());
		setHours(hours < 10 ? `0${hours}` : hours.toString());
		setDays(newDays < 10 ? `0${newDays}` : newDays.toString());
	}, [now, deadline]);

	useEffect(() => {
		const interval = setInterval(() => {
			setStarted(new Date(startTime) < new Date());
			setNow(new Date());
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [startTime]);

	return (
		<div className="flex items-center justify-between gap-4 rounded-xl py-2 md:px-3">
			<div className="flex flex-col items-center justify-between text-2xs">
				<p className="font-semibold text-white">
					{days}
				</p>
				<p className="text-gray90">d</p>
			</div>
			<p className="text-sm text-white">:</p>
			<div className=" flex flex-col items-center justify-between text-2xs">
				<p className="font-semibold text-white">
					{hours}
				</p>
				<p className=" text-gray90">h</p>
			</div>
			<p className="text-sm text-white">:</p>
			<div className=" flex flex-col items-center justify-between text-2xs">
				<p className="font-semibold text-white">
					{minutes}
				</p>
				<p className="text-gray90">m</p>
			</div>
			<p className="text-sm text-white">:</p>
			<div className=" flex flex-col items-center justify-between text-2xs">
				<p className="font-semibold text-white">
					{seconds}
				</p>
				<p className="text-gray90">s</p>
			</div>
		</div>
	);
};


export default QuizRaffleList