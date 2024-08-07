"use client"

import { useState } from "react"
import { unitapPassSupportedNetworks } from "@/constants/chains"

const UnitapPassPage = () => {
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0)
  const [copyMessage, setCopyMessage] = useState("")

  const selectNetwork = (index: number) => {
    setSelectedNetworkIndex(index)
  }

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address)

    setCopyMessage("Copied")

    setTimeout(() => {
      if (setCopyMessage) setCopyMessage("")
    }, 3000)
  }
  const selectedNetwork = unitapPassSupportedNetworks[selectedNetworkIndex]

  return (
    <>
      <div className={"flex justify-center items-center px-4 py-8"}>
        <div
          className={
            "uni-card mt-9 sm:mt-0 after:bg-donate-texture-p  after:w-60 after:top-0 after:h-56 px-4 py-6"
          }
        >
          <div className={"h-72 flex flex-col justify-end items-center mb-12"}>
            {selectedNetwork.name && (
              <p className={"text-white font-semibold text-lg z-10 relative"}>
                Unitap Wallet
              </p>
            )}
            <img
              src={`/assets/images/donate/${
                selectedNetwork.qr ? selectedNetwork.qr : "donate-img.png"
              }`}
              className={`${
                selectedNetwork.qr ? "w-52" : "w-36"
              } relative  m-auto z-10`}
            />
            {selectedNetwork.name && (
              <div className={"flex gap-2"}>
                <p className={"text-space-green text-[11px] sm:text-base"}>
                  {selectedNetwork.address}{" "}
                </p>
                <div className="relative">
                  <img
                    onClick={() => copyToClipboard(selectedNetwork.address)}
                    src={"/assets/images/donate/copy-green.svg"}
                    className={"cursor-pointer inline-block"}
                  />
                  {copyMessage && (
                    <div className="absolute bottom-full mb-3 w-16 -left-10 py-2 bg-gray10 text-gray100 text-center border-gray70 border rounded-md text-xs">
                      {copyMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <h2 className={"text-white mb-4"}>Donate to Unitap</h2>

          <p className={"text-gray100 mb-8 text-xs"}>
            Select a network to view Unitap wallet address and easily donate to
            Unitap.
          </p>
          <label className={"text-gray90 text-xs mb-2 inline-block"}>
            Select network
          </label>
          <div className={"flex flex-col sm:flex-row justify-between gap-2 "}>
            {unitapPassSupportedNetworks.map((network, index) => (
              <div
                onClick={() => selectNetwork(index)}
                key={network.name}
                className={`${
                  selectedNetworkIndex === index
                    ? "gradient-outline-button bg-gray00 before:rounded-[11px] before:inset-[0.1rem] "
                    : "border-gray50 bg-gray30 border-2"
                } sm:w-36 cursor-pointer  text-white rounded-xl transition-colors hover:bg-gray00 duration-200 flex gap-2 flex-col justify-center items-center px-2 py-3`}
              >
                <img src={`/assets/images/donate/${network.icon}`} />

                <p className={"text-xs"}>{network.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default UnitapPassPage
