import React from "react";

export const ShouldSatisfy = ({ isSatisfy }: { isSatisfy: boolean }) => {
  return (
    <div
      className={`flex h-full w-full cursor-pointer items-center justify-center rounded-lg text-white`}
    >
      <div
        className={`relative flex h-full w-full items-center justify-center ${!isSatisfy && "border border-white"} z-100 overflow-hidden rounded-lg`}
      >
        <div
          className={`z-1 ${
            !isSatisfy ? "bg-space-green opacity-20" : "bg-gray50"
          } absolute h-full w-full`}
        ></div>
        <p className="absolute text-white">Should satisfy</p>
      </div>
    </div>
  );
};

export const ShouldNotSatisfy = ({ notSatisfy }: { notSatisfy: boolean }) => {
  return (
    <div
      className={`flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg text-white`}
    >
      <div
        className={`relative flex h-full w-full items-center justify-center ${notSatisfy && "border border-white"} z-100 overflow-hidden rounded-lg`}
      >
        <div
          className={`${
            notSatisfy ? "bg-error opacity-40" : "bg-gray50"
          } absolute h-full w-full `}
        ></div>
        <p className="absolute text-white">Should not satisfy</p>
      </div>
    </div>
  );
};
