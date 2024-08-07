"use client";

import Image from "next/image";
import TextField from "./text-field";
import RangeInput from "./range-input";
import { useState } from "react";

const OrderPlace = () => {
  const [sliderValue, setSliderValue] = useState(0);
  return (
    <div className="background-dashboard rounded-4xl overflow-hidden border-2  border-gray60">
      <header className="flex items-center">
        <button className="flex-1 border-b-2 border-white bg-gray40 px-10 py-5 text-center text-white">
          Order
        </button>
        <button className="flex-1 px-10 py-5 text-center text-gray90">
          Market Price
        </button>
      </header>

      <main className="p-5">
        <div className="flex font-semibold">
          <button className="relative flex-1 bg-[url('/assets/images/offer-token/button-bg.svg')] bg-cover bg-no-repeat py-3 pr-3 text-center text-white">
            Buy
          </button>
          <button className="relative flex-1 bg-[url('/assets/images/offer-token/button-right.svg')] bg-cover bg-no-repeat py-3 pl-3 text-center text-white">
            Sell
          </button>
        </div>

        <div className="mt-5">
          <TextField label="Price">
            <div className="absolute bottom-0 right-0 top-0 flex items-center gap-4">
              <button className="font-semibold text-[#4079BC] placeholder:text-gray80">
                USDC
              </button>

              <div className="flex h-full flex-col text-gray100">
                <button className="bg-[#1B1B29] px-1">+</button>
                <button className="bg-[#1B1B29] px-1">-</button>
              </div>
            </div>
          </TextField>
          <TextField label="Amount" className="mt-5">
            <div className="absolute bottom-0 right-0 top-0 flex items-center gap-4">
              <button className="bg-g-primary bg-clip-text font-semibold text-transparent placeholder:text-gray80">
                UXP
              </button>

              <div className="flex h-full flex-col text-gray100">
                <button className="bg-[#1B1B29] px-1">+</button>
                <button className="bg-[#1B1B29] px-1">-</button>
              </div>
            </div>
          </TextField>

          <div className="mt-8">
            <RangeInput
              value={sliderValue}
              maxLeverage={100}
              onChange={setSliderValue}
              mixedColor="#4CE6A1"
            />
          </div>

          <TextField className="mt-10" label="Total Amount">
            <div className="absolute bottom-0 right-0 top-0 flex items-center gap-4">
              <button className="font-semibold text-[#4079BC] placeholder:text-gray80">
                USDC
              </button>

              <div className="flex h-full flex-col text-gray100">
                <button className="bg-[#1B1B29] px-1">+</button>
                <button className="bg-[#1B1B29] px-1">-</button>
              </div>
            </div>
          </TextField>
        </div>

        <div className="mt-4 rounded-3xl border-2 border-gray60 bg-gray20">
          <div className="flex items-center justify-between p-2 px-4 text-gray90">
            <span>Maximum Fee</span>

            <div>
              0 <span className="font-semibold text-[#4079BC]">USDC</span>
            </div>
          </div>

          <div className="h-[2px] bg-gray60"></div>
          <div className="flex items-center justify-between p-2 px-4 text-gray100">
            <span className="font-semibold">Your Receipt</span>

            <div>
              0{" "}
              <span className="bg-g-primary bg-clip-text font-semibold text-transparent">
                UXP
              </span>
            </div>
          </div>
        </div>

        <button className="mt-7 w-full rounded-2xl border-2 bg-dark-space-green px-5 py-3 text-center font-semibold text-space-green">
          Buy UXP
        </button>
      </main>

      <footer className="-mt-5 bg-[url('/assets/images/offer-token/bg-blur.png')] bg-cover bg-no-repeat">
        <Image
          width={360}
          className="mx-auto"
          height={360}
          src="/assets/images/offer-token/image.png"
          alt="charts"
        />
      </footer>
    </div>
  );
};

export default OrderPlace;
