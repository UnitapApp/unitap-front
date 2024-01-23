import { useEffect, useMemo, useState } from "react";

type RaffleCardTimerProps = {
  startTime: string;
  FinishTime: string;
  finished: boolean;
  setFinished: (e: boolean) => void;
  setIsStarted: (e: boolean) => void;
};

export const CardTimerTokenTap = ({
  startTime,
  FinishTime,
  finished,
  setFinished,
  setIsStarted,
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
    [FinishTime, start]
  );

  const deadline = useMemo(
    () =>
      startTimeDate.getTime() > now.getTime() ? startTimeDate : FinishTimeDate,
    [startTimeDate, FinishTimeDate, now]
  );

  useEffect(() => {
    const diff = deadline.getTime() - now.getTime();
    if (diff <= 0) {
      setFinished(true);
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
      setIsStarted(new Date(startTime) < new Date());
      setNow(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [startTime]);

  return (
    <div>
      <p className="text-white font-medium text-[8px] mb-2 ml-1">
        {start && finished
          ? "in"
          : start && !finished
          ? "Ends in"
          : "Starts in"}
        :
      </p>
      <div className="prize-card__timer bg-gray50 flex items-center justify-between rounded-xl gap-4 px-8 py-2">
        <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
          <p className="prize-card__timer-item-value text-white font-semibold">
            {days}
          </p>
          <p className="prize-card__timer-item-label text-gray90">d</p>
        </div>
        <p className="text-sm text-white">:</p>
        <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
          <p className="prize-card__timer-item-value text-white font-semibold">
            {hours}
          </p>
          <p className="prize-card__timer-item-label text-gray90">h</p>
        </div>
        <p className="text-sm text-white">:</p>
        <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
          <p className="prize-card__timer-item-value text-white font-semibold">
            {minutes}
          </p>
          <p className="prize-card__timer-item-label text-gray90">m</p>
        </div>
        <p className="text-sm text-white">:</p>
        <div className="prize-card__timer-item flex flex-col justify-between items-center text-[10px]">
          <p className="prize-card__timer-item-value text-white font-semibold">
            {seconds}
          </p>
          <p className="prize-card__timer-item-label text-gray90">s</p>
        </div>
      </div>
    </div>
  );
};
