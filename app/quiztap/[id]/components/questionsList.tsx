import {
  restPeriod,
  statePeriod,
  useQuizContext,
} from "@/context/quizProvider";
import { FC, Fragment, useEffect, useRef } from "react";

const QuestionsList = () => {
  const { quiz } = useQuizContext();
  return (
    <div className="mt-10 flex rounded-xl border-2 border-gray50 bg-gray20 p-4">
      {quiz?.questions.map((question, index) => (
        <Fragment key={index}>
          <QuestionItem index={index + 1} />
          {index < quiz.questions.length - 1 && <Separator index={index + 1} />}
        </Fragment>
      ))}
    </div>
  );
};

const Separator: FC<{ index: number }> = ({ index }) => {
  const { stateIndex, timer, isRestTime } = useQuizContext();

  const width =
    isRestTime && index === stateIndex - 1
      ? Math.min((28 * (restPeriod - timer)) / restPeriod, restPeriod)
      : 28;

  return (
    <div className="relative mx-2 my-auto h-[2px] w-7 rounded-lg bg-gray50">
      <div
        className="absolute bottom-0 left-0 top-0 h-[2px] bg-gray100"
        style={{ width: width }}
      ></div>
    </div>
  );
};

const QuestionItem: FC<{ index: number }> = ({ index }) => {
  const { stateIndex, timer, isRestTime, answersHistory, userAnswersHistory } =
    useQuizContext();

  const ref = useRef<SVGRectElement>(null);

  useEffect(() => {
    var progress: any = ref.current;

    if (!progress) return;
    let frameCount = 0;
    let anim: number;

    const timeout = setTimeout(() => {
      var borderLen = progress.getTotalLength() + 5,
        offset = borderLen;
      progress.style.strokeDashoffset = borderLen;
      progress.style.strokeDasharray = borderLen + "," + borderLen;

      const durationInSeconds =
        statePeriod / 1000 - (statePeriod / 1000 - timer / 1000);

      const framesPerSecond = 60;

      const totalFrames = durationInSeconds * framesPerSecond;
      const decrementAmount = borderLen / totalFrames;

      function progressBar() {
        offset -= decrementAmount;
        progress.style.strokeDashoffset = offset;
        frameCount++;

        // Stop animation when duration is reached
        if (frameCount < totalFrames) {
          anim = window.requestAnimationFrame(progressBar);
        } else {
          window.cancelAnimationFrame(anim);
        }
      }

      // Start animation
      anim = window.requestAnimationFrame(progressBar);
    }, 0);

    // Clean up on component unmount or state change
    return () => {
      window.cancelAnimationFrame(anim);
      clearTimeout(timeout);
    };
  }, [stateIndex]);

  if (index > stateIndex || isRestTime)
    return (
      <div
        className={`relative grid h-9 w-9 place-content-center rounded-lg border-2 ${index > stateIndex ? "border-gray50" : userAnswersHistory[index] === answersHistory[index] ? "border-dark-space-green" : "border-error/40"} bg-gray20 text-gray100`}
      >
        {index}
      </div>
    );

  return (
    <div
      className={`progress relative  h-9 w-9  rounded-lg  ${index > stateIndex ? "border-2 border-gray50" : index === stateIndex ? "" : "border-2 border-dark-space-green"} bg-gray20 text-gray100`}
    >
      <div className="absolute inset-0 grid place-content-center text-sm">
        {index}
      </div>
      {index === stateIndex && (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            ref={ref}
            x="1"
            y="1"
            width="34"
            height="34"
            rx="7"
            stroke="#b5b5c6"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
};

export default QuestionsList;
