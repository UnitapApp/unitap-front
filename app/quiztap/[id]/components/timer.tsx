import Icon from "@/components/ui/Icon";

const Timer = () => {
  return (
    <div className="mb-5 flex items-center gap-3 rounded-xl border-2 border-gray20 bg-[#1E1E2C33] p-2">
      <Icon
        alt="timer"
        iconSrc="/assets/images/quizTap/timer.png"
        width="30px"
        height="31px"
      />

      <p className="font-digital-numbers text-2xl text-white">00:00</p>
    </div>
  );
};

export default Timer;
