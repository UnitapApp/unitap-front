"use client";

import { useState } from "react";
import { unitapPassSupportedNetworks } from "@/constants/chains";

const UnitapPassPage = () => {
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
  const [copyMessage, setCopyMessage] = useState("");

  const selectNetwork = (index: number) => {
    setSelectedNetworkIndex(index);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);

    setCopyMessage("Copied");

    setTimeout(() => {
      if (setCopyMessage) setCopyMessage("");
    }, 3000);
  };
  const selectedNetwork = unitapPassSupportedNetworks[selectedNetworkIndex];

  return (
    <>
      <div className={"flex items-center justify-center px-4 py-8"}>
        <div
          className={
            "uni-card mt-9 px-4 py-6 after:top-0 after:h-56 after:w-60 after:bg-donate-texture-p sm:mt-0"
          }
        >
          <div className={"mb-12 flex h-72 flex-col items-center justify-end"}>
            {selectedNetwork.name && (
              <p className={"relative z-10 text-lg font-semibold text-white"}>
                Unitap Wallet
              </p>
            )}
            <img
              src={`/assets/images/donate/${
                selectedNetwork.qr ? selectedNetwork.qr : "donate-img.png"
              }`}
              className={`${
                selectedNetwork.qr ? "w-52" : "w-36"
              } relative z-10 m-auto`}
            />
            {selectedNetwork.name && (
              <div className={"flex gap-2"}>
                <p className={"text-[11px] text-space-green sm:text-base"}>
                  {selectedNetwork.address}{" "}
                </p>
                <div className="relative">
                  <img
                    onClick={() => copyToClipboard(selectedNetwork.address)}
                    src={"/assets/images/donate/copy-green.svg"}
                    className={"inline-block cursor-pointer"}
                  />
                  {copyMessage && (
                    <div className="absolute -left-10 bottom-full mb-3 w-16 rounded-md border border-gray70 bg-gray10 py-2 text-center text-xs text-gray100">
                      {copyMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <h2 className={"mb-4 text-white"}>Donate to Unitap</h2>

          <p className={"mb-8 text-xs text-gray100"}>
            Select a network to view Unitap wallet address and easily donate to
            Unitap.
          </p>
          <label className={"mb-2 inline-block text-xs text-gray90"}>
            Select network
          </label>
          <div className={"flex flex-col justify-between gap-2 sm:flex-row"}>
            {unitapPassSupportedNetworks.map((network, index) => (
              <div
                onClick={() => selectNetwork(index)}
                key={network.name}
                className={`${
                  selectedNetworkIndex === index
                    ? "gradient-outline-button bg-gray00 before:inset-[0.1rem] before:rounded-[11px]"
                    : "border-2 border-gray50 bg-gray30"
                } flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-white transition-colors duration-200 hover:bg-gray00 sm:w-36`}
              >
                <img src={`/assets/images/donate/${network.icon}`} />

                <p className={"text-xs"}>{network.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitapPassPage;
