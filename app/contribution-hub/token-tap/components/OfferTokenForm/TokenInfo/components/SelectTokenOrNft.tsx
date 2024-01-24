"use client";

import Lottie from "react-lottie";
import AddNftIdListModal from "./AddNftIdListModal";
interface Prop {
  showErrors: boolean;
  isRightChain: boolean;
}

import { loadAnimationOption } from "@/constants/lottieCode";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";
import { ZERO_ADDRESS } from "@/constants";
import { useState } from "react";
import { ContractValidationStatus } from "@/types";

const SelectTokenOrNft = ({ showErrors, isRightChain }: Prop) => {
  const {
    data,
    handleSelectTokenOrNft,
    handleSelectNativeToken,
    handleChange,
    openAddNftIdListModal,
    isShowingDetails,
    handleClearNfts,
    insufficientBalance,
    tokenContractStatus,
    nftContractStatus,
    numberOfNfts,
    setNumberOfNfts,
  } = useTokenTapFromContext();

  const isTokenFieldDisabled =
    isShowingDetails ||
    data.isNativeToken ||
    !data.selectedChain ||
    tokenContractStatus.checking ||
    !isRightChain ||
    isShowingDetails;

  const isNftFieldDisabled =
    isShowingDetails ||
    !data.selectedChain ||
    nftContractStatus.checking ||
    !isRightChain ||
    data.nftTokenIds.length > 0;

  const isAmountFieldsDisabled =
    isShowingDetails ||
    tokenContractStatus.checking ||
    tokenContractStatus.isValid === ContractValidationStatus.NotValid ||
    tokenContractStatus.isValid === ContractValidationStatus.Empty ||
    !data.tokenContractAddress;

  const totalAmountError =
    insufficientBalance ||
    Number(data.winnersCount) > 500 ||
    (showErrors && (!data.totalAmount || Number(data.totalAmount) <= 0));

  const tokenAddressError =
    (showErrors && !data.tokenContractAddress) ||
    tokenContractStatus.isValid === ContractValidationStatus.NotValid;

  const nftAddressError =
    (showErrors && !data.nftContractAddress) ||
    nftContractStatus.isValid === ContractValidationStatus.NotValid;

  const nftNumberFieldDisabled =
    isShowingDetails ||
    !data.selectedChain ||
    nftContractStatus.checking ||
    !isRightChain ||
    !data.nftContractAddress;

  const handleKeyDown = (event: any) => {
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };

  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  return (
    <div
      className={
        data.selectedChain && isRightChain ? "w-full" : "setOpacity w-full"
      }
    >
      <section className="flex text-gray80 text-xs bg-gray30 border border-gray50 rounded-xl h-[43px] items-center w-full max-w-[452px] overflow-hidden">
        <div
          className={`
          ${!data.isNft && "text-white font-medium bg-gray40 border-gray50"}
           flex cursor-pointer items-center justify-center border-r border-r-gray50 w-[50%] h-full `}
          onClick={() => handleSelectTokenOrNft(false)}
        >
          Token
        </div>
        <div
          className={`
          ${data.isNft && "text-white font-medium  bg-gray40 border-gray50"}
           flex cursor-pointer items-center justify-center border-l border-l-gray50 w-[50%] h-full`}
          // onClick={() => handleSelectTokenOrNft(true)}
        >
          NFT
        </div>
      </section>
      {!data.isNft ? (
        <div className="flex flex-col gap-5 w-full mt-4">
          <div className="relative">
            <div
              className="flex items-center justify-center gap-1 text-white text-2xs mb-[9px] cursor-pointer max-w-[140px]"
              onClick={() => handleSelectNativeToken(data.isNativeToken)}
            >
              <Icon
                height="16px"
                width="16px"
                iconSrc={
                  !data.isNativeToken
                    ? "/assets/images/provider-dashboard/checkbox.svg"
                    : "/assets/images/provider-dashboard/check-true.svg"
                }
              />
              <p className="text-sm text-gray100 ml-1">use native token</p>
            </div>

            <div
              className={`flex text-gray80 text-xs bg-gray40 border-[1.4px] 
              rounded-xl h-[43px] max-w-[452px] overflow-hidden 
              ${data.isNativeToken ? "opacity-[.5]" : "opacity-1"} 
              ${tokenAddressError ? "border-error" : "border-gray50"}`}
            >
              <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center text-center justify-center">
                <p>Token address</p>
              </div>
              <div className="w-full max-w-[254px] overflow-hidden px-2">
                <input
                  disabled={isTokenFieldDisabled}
                  name="tokenContractAddress"
                  placeholder="paste here"
                  value={
                    data.tokenContractAddress &&
                    data.tokenContractAddress != ZERO_ADDRESS
                      ? data.tokenContractAddress
                      : ""
                  }
                  className="provider-dashboard-input w-full "
                  type="text"
                  onChange={handleChange}
                />
              </div>
              {tokenContractStatus.checking && (
                <div className="w-[50px] h-full bg-gray30 p-0 m-0 flex items-center">
                  <Lottie
                    width={45}
                    height={45}
                    options={loadAnimationOption}
                  ></Lottie>
                </div>
              )}
              {tokenContractStatus.isValid ===
                ContractValidationStatus.NotValid && (
                <div className="w-[70px] h-full bg-gray30 p-0 m-0 flex items-center justify-center">
                  <Icon iconSrc="/assets/images/provider-dashboard/invalidAddress.svg" />
                </div>
              )}
              {tokenContractStatus.isValid ===
                ContractValidationStatus.Valid && (
                <div className="w-[70px] h-full bg-gray30 p-0 m-0 flex items-center justify-center">
                  <Icon iconSrc="/assets/images/provider-dashboard/validAddress.svg" />
                </div>
              )}
            </div>
            {tokenContractStatus.isValid ===
              ContractValidationStatus.NotValid && (
              <p className="text-error text-2xs m-0 p-0 mt-[2px] absolute ">
                Invalid Token Contract Address
              </p>
            )}

            {showErrors && !data.tokenContractAddress && (
              <p className="text-error text-2xs m-0 p-0 mt-[2px] absolute left-1">
                Required
              </p>
            )}
          </div>

          <div className="relative total_amount_box">
            <div
              className={`relative border-2  p-5 rounded-2xl ${
                totalAmountError ? "border-error" : "border-gray50"
              } `}
            >
              <div
                className={`flex gap-2 text-gray80 text-xs bg-gray40 border-gray50 border-2 rounded-xl h-[43px] pr-4 items-center justify-between overflow-hidden w-full max-w-[452px]`}
              >
                <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center justify-center text-center">
                  Number of claims
                </div>
                <input
                  name="winnersCount"
                  value={data.winnersCount}
                  className="provider-dashboard-input"
                  type="text"
                  inputMode="numeric"
                  onChange={handleChange}
                  min={1}
                  max={500}
                  disabled={isAmountFieldsDisabled}
                  step={1}
                  pattern="[0-9]"
                />
              </div>
              <Icon
                iconSrc="/assets/images/provider-dashboard/cross.png"
                height="16px"
                width="16px"
                className="py-2"
              />
              <div
                className={`flex gap-2 text-gray80 text-xs bg-gray40 border border-gray50 rounded-xl h-[43px] pr-4 items-center justify-between overflow-hidden w-full max-w-[452px]`}
              >
                <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center justify-center text-center">
                  <p>Amount per claim</p>
                </div>
                <input
                  disabled={isAmountFieldsDisabled}
                  onChange={handleChange}
                  value={data.tokenAmount}
                  name="tokenAmount"
                  className="provider-dashboard-input"
                  type="number"
                  min={0}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Icon
                iconSrc="/assets/images/provider-dashboard/equal.svg"
                height="16px"
                width="16px"
                className="py-2"
              />
              <div
                className={`flex gap-2 text-gray80 opacity-50 text-xs bg-gray40 border border-gray50 rounded-xl h-[43px] pr-4 items-center justify-between overflow-hidden w-full max-w-[452px]`}
              >
                <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center justify-center text-center">
                  <p>Total Amount</p>
                </div>
                <input
                  disabled={true}
                  value={data.totalAmount}
                  name="totalAmount"
                  className="provider-dashboard-input"
                  type="number"
                />
              </div>
            </div>

            {showErrors &&
            (!data.totalAmount || Number(data.totalAmount) <= 0) ? (
              <p className="text-error text-2xs mt-[2px] m-0 p-0 absolute -bottom-4">
                Required
              </p>
            ) : Number(data.winnersCount) > 500 ? (
              <p className="text-error text-2xs mt-[2px] m-0 p-0 absolute -bottom-4">
                The maximum number of winners is 500.
              </p>
            ) : (
              insufficientBalance && (
                <p className="text-error text-2xs mt-[2px] m-0 p-0 absolute -bottom-4">
                  Insufficient Balance
                </p>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full mt-5">
          <div className="relative">
            <div
              className={`
							 flex text-gray80 text-xs bg-gray40 border-[1.4px] ${
                 nftAddressError ? "border-error" : "border-gray50"
               } ${
                data.nftTokenIds.length >= 1 ? "opacity-[0.5]" : "opacity-1"
              } rounded-xl h-[43px]  max-w-[452px] overflow-hidden`}
            >
              <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center text-center justify-center">
                <p>NFT Contract address</p>
              </div>
              <div className="w-full max-w-[254px] overflow-hidden px-2">
                <input
                  disabled={isNftFieldDisabled}
                  name="nftContractAddress"
                  placeholder="paste here"
                  value={data.nftContractAddress ? data.nftContractAddress : ""}
                  className="provider-dashboard-input w-full "
                  type="text"
                  onChange={handleChange}
                />
              </div>
              {nftContractStatus.checking && (
                <div className="w-[50px] h-full bg-gray30 p-0 m-0 flex items-center">
                  <Lottie
                    width={45}
                    height={45}
                    options={loadAnimationOption}
                  ></Lottie>
                </div>
              )}
              {nftContractStatus.isValid ===
                ContractValidationStatus.NotValid && (
                <div className="w-[70px] h-full bg-gray30 p-0 m-0 flex items-center justify-center">
                  <Icon iconSrc="/assets/images/provider-dashboard/invalidAddress.svg" />
                </div>
              )}
              {nftContractStatus.isValid === ContractValidationStatus.Valid && (
                <div className="w-[70px] h-full bg-gray30 p-0 m-0 flex items-center justify-center">
                  <Icon iconSrc="/assets/images/provider-dashboard/validAddress.svg" />
                </div>
              )}
            </div>
            {showErrors && !data.nftContractAddress && (
              <p className="text-error text-2xs m-0 p-0 mt-[2px] absolute left-1">
                Required
              </p>
            )}
            {nftContractStatus.isValid ===
              ContractValidationStatus.NotValid && (
              <p className="text-error text-2xs m-0 p-0 mt-[2px] absolute ">
                Invalid NFT Contract Address
              </p>
            )}
          </div>

          <div className="relative mt-1">
            <div className={`tooltip ${showTooltip ? "flex" : "hidden"}`}>
              <div className="absolute flex items-center justify-center -right-6 z-100 rounded-sm -top-4 w-[100px] h-[20px] text-xs bg-gray100">
                tooltip message
              </div>
              <div className="absolute w-[5px] h-[5px] right-6 rotate-45 top-[1px]  bg-green-100"></div>
            </div>
            <div
              className={`
							 flex text-gray80 text-xs bg-gray40 border ${
                 Number(numberOfNfts) > 500 ||
                 (data.nftTokenIds.length > 0 &&
                   data.nftTokenIds.length != Number(numberOfNfts))
                   ? "border-error"
                   : "border-gray50"
               } rounded-xl h-[43px]  max-w-[452px] overflow-hidden items-center justify-between pr-4`}
            >
              <div className="bg-gray30 flex h-full w-full max-w-[148px] items-center text-center justify-center">
                <p>Number of Nfts</p>
              </div>
              <div className="w-full max-w-[254px] overflow-hidden px-2 h-full">
                <input
                  disabled={nftNumberFieldDisabled}
                  name="NumberOfNfts"
                  placeholder="Number Of Nfts"
                  value={numberOfNfts}
                  className="provider-dashboard-input w-full h-full"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  onChange={(e) =>
                    setNumberOfNfts(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              <div className="min-w-[20px] relative">
                <Icon
                  iconSrc="/assets/images/provider-dashboard/exclamation.svg"
                  className="cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </div>
              {Number(numberOfNfts) > 500 && (
                <p className="absolute text-error text-2xs m-0 p-0 -bottom-4 left-0">
                  Maximum is 500
                </p>
              )}
            </div>
            {data.nftTokenIds.length > 0 &&
              data.nftTokenIds.length != Number(numberOfNfts) && (
                <p className="absolute text-error text-2xs m-0 p-0 -bottom-4 left-0">
                  Number of NFTs are not equal with Number of NFts you added.
                </p>
              )}
          </div>
          {data.nftTokenIds.length > 0 ? (
            <div className="flex relative justify-between items-center mt-[4px] bg-gray50 border max-h-[44px] border-gray60 rounded-xl p-2 px-5">
              <div className="text-white text-xs">
                <p>{data.nftTokenIds.length} NFT ID added</p>
                <div className="flex text-gray90 text-2xs">
                  <p>
                    {data.nftTokenIds.length > 1
                      ? data.nftTokenIds.join(", ")
                      : data.nftTokenIds}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => openAddNftIdListModal()}
                  className="text-gray90 text-2xs w-[60px] h-[20px] rounded bg-gray70 border border-gray80 flex items-center justify-center"
                >
                  Edit
                </button>
                <Icon
                  className="cursor-pointer"
                  iconSrc="/assets/images/modal/exit.svg"
                  onClick={() => handleClearNfts()}
                />
              </div>
            </div>
          ) : (
            <div className="relative mt-[4px]">
              <div
                onClick={() => {
                  if (!numberOfNfts) return;
                  openAddNftIdListModal();
                }}
                className={`flex text-white text-xs ${
                  nftContractStatus.isValid ===
                    ContractValidationStatus.NotValid ||
                  !numberOfNfts ||
                  Number(numberOfNfts) > 500
                    ? "opacity-[0.4]"
                    : "cursor-pointer"
                } ${
                  data.nftTokenIds.length == 0 && showErrors
                    ? "border-error"
                    : "border-gray50"
                } bg-gray40 border  rounded-xl h-[44px] items-center  overflow-hidden w-full max-w-[452px]`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center gap-2 p-3">
                  <Icon
                    width="16px"
                    height="16px"
                    iconSrc="/assets/images/provider-dashboard/add-requirement.svg"
                  />
                  <p>Add NFT ID</p>
                </div>
              </div>
              {data.nftTokenIds.length == 0 && showErrors && (
                <p className="absolute text-error text-2xs m-0 p-0 mt-[2px] ml-1">
                  Required
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <AddNftIdListModal />
    </div>
  );
};

export default SelectTokenOrNft;
