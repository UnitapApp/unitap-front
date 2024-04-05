import { FC } from "react";

const WaitingIdle: FC<{}> = () => {
  return (
    <div className="mt-20 text-center">
      <p className="text-lg font-semibold text-white">Waiting for start</p>

      <p className="mt-5 text-gray100">
        please wait for everyone joins and the quiz starts
      </p>
    </div>
  );
};

export default WaitingIdle;
