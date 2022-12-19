import React from "react";

interface NFTTimerProps {
  className?: string;
}

const NFTTimer = ({ className }: NFTTimerProps) => {
  return (
    <div className={`nft-timer w-full bg-gray10 border-2 border-gray40 rounded-2xl py-2 ${className}`}>
      <div className="nft-timer__time flex justify-evenly text-xl font-semibold px-14 mb-1.5">
        <p className="time flex-1 text-center text-gradient-primary">02</p>
        <p className="time flex-1 text-center text-gradient-primary">:</p>
        <p className="time flex-1 text-center text-gradient-primary">16</p>
        <p className="time flex-1 text-center text-gradient-primary">:</p>
        <p className="time flex-1 text-center text-gradient-primary">34</p>
        <p className="time flex-1 text-center text-gradient-primary">:</p>
        <p className="time flex-1 text-center text-gradient-primary">43</p>
      </div>
      <div className="nft-timer__label flex justify-evenly text-gray90 text-xs px-8">
        <p className="label flex-1 text-center">days</p>
        <p className="label flex-1 text-center">hours</p>
        <p className="label flex-1 text-center">minutes</p>
        <p className="label flex-1 text-center">seconds</p>
      </div>
    </div>
  )
}

export default NFTTimer;