"use client";

import Icon from "@/components/ui/Icon";
import { useQuizContext } from "@/context/quizProvider";

const Timer = () => {
  const { timer } = useQuizContext();

  const formatTime = (time: number) => {
    const totalSeconds = Math.floor(time / 1000);
    const seconds = totalSeconds % 60;
    const milliseconds = time % 60000;

    const formattedMilliseconds = String(milliseconds).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return {
      seconds,
      formattedSeconds: formattedSeconds,
      formattedMilliSeconds: formattedMilliseconds.slice(-3, -1),
    };
  };

  const time = formatTime(timer);

  return (
    <div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-3 rounded-xl border-2 border-gray20 bg-[#1E1E2C33] p-2">
      <Icon
        alt="timer"
        iconSrc="/assets/images/quizTap/timer.png"
        width="30px"
        height="31px"
      />

      <p
        className={`font-digital-numbers text-2xl ${time.seconds > 5 ? "text-white" : time.seconds > 2 ? "text-warn" : "text-error"} `}
      >
        {`${time.formattedSeconds}:${time.formattedMilliSeconds}`}
      </p>
    </div>
  );
};

export default Timer;
