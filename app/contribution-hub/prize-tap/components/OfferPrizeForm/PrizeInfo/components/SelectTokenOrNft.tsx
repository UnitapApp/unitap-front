"use client";

import Lottie from "react-lottie";
import AddNftIdListModal from "./AddNftIdListModal";
interface Prop {
  showErrors: boolean;
  isRightChain: boolean;
}

import { loadAnimationOption } from "@/constants/lottieCode";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
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
  } = usePrizeOfferFormContext();

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
        data.selectedChain && isRightChain ? "w-full" : "w-full opacity-30"
      }
    >
      <section className="flex h-[43px] w-full max-w-[452px] items-center overflow-hidden rounded-xl border border-gray50 bg-gray30 text-xs text-gray80">
        <div
          className={`
          ${!data.isNft && "border-gray50 bg-gray40 font-medium text-white"}
           flex h-full w-[50%] cursor-pointer items-center justify-center border-r border-r-gray50 `}
          onClick={() => {
            if (!isRightChain) return;
            handleSelectTokenOrNft(false);
          }}
        >
          Token
        </div>
        <div
          className={`
          ${data.isNft && "border-gray50 bg-gray40  font-medium text-white"}
           flex h-full w-[50%] cursor-pointer items-center justify-center border-l border-l-gray50`}
          onClick={() => {
            if (!isRightChain) return;
            handleSelectTokenOrNft(true);
          }}
        >
          NFT
        </div>
      </section>
      {!data.isNft ? (
        <div className="mt-4 flex w-full flex-col gap-5">
          <div className="relative">
            <div
              className="mb-[9px] flex max-w-[140px] cursor-pointer items-center justify-center gap-1 text-2xs text-white"
              onClick={() => {
                if (!isRightChain) return;
                handleSelectNativeToken(data.isNativeToken);
              }}
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
              <p className="ml-1 text-sm text-gray100">use native token</p>
            </div>

            <div
              className={`flex h-[43px] max-w-[452px] overflow-hidden rounded-xl 
              border-[1.4px] bg-gray40 text-xs text-gray100 
              ${data.isNativeToken ? "opacity-[.5]" : "opacity-1"} 
              ${tokenAddressError ? "border-error" : "border-gray50"}`}
            >
              <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
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
                <div className="m-0 flex h-full w-[50px] items-center bg-gray30 p-0">
                  <Lottie
                    width={45}
                    height={45}
                    options={loadAnimationOption}
                  ></Lottie>
                </div>
              )}
              {tokenContractStatus.isValid ===
                ContractValidationStatus.NotValid && (
                <div className="m-0 flex h-full w-[70px] items-center justify-center bg-gray30 p-0">
                  <Icon iconSrc="/assets/images/provider-dashboard/invalidAddress.svg" />
                </div>
              )}
              {tokenContractStatus.isValid ===
                ContractValidationStatus.Valid && (
                <div className="m-0 flex h-full w-[70px] items-center justify-center bg-gray30 p-0">
                  <Icon iconSrc="/assets/images/provider-dashboard/validAddress.svg" />
                </div>
              )}
            </div>
            {tokenContractStatus.isValid ===
              ContractValidationStatus.NotValid && (
              <p className="absolute m-0 mt-[2px] p-0 text-2xs text-error ">
                Invalid Token Contract Address
              </p>
            )}

            {showErrors && !data.tokenContractAddress && (
              <p className="absolute left-1 m-0 mt-[2px] p-0 text-2xs text-error">
                Required
              </p>
            )}
          </div>

          <div className="total_amount_box relative">
            <div
              className={`relative rounded-2xl  border p-5 ${
                totalAmountError ? "border-error" : "border-gray50"
              } `}
            >
              <div
                className={`flex h-[43px] w-full max-w-[452px] items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray50 bg-gray40 pr-4 text-xs text-gray100`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
                  Number of Winners
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
                className={`flex h-[43px] w-full max-w-[452px] items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray50 bg-gray40 pr-4 text-xs text-gray100`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
                  <p>Amount Per Winner</p>
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
                className={`flex h-[43px] w-full max-w-[452px] items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray50 bg-gray40 pr-4 text-xs text-gray100 opacity-50`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
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
              <p className="absolute -bottom-4 m-0 mt-[2px] p-0 text-2xs text-error">
                Required
              </p>
            ) : Number(data.winnersCount) > 500 ? (
              <p className="absolute -bottom-4 m-0 mt-[2px] p-0 text-2xs text-error">
                The maximum number of winners is 500.
              </p>
            ) : (
              insufficientBalance && (
                <p className="absolute -bottom-4 m-0 mt-[2px] p-0 text-2xs text-error">
                  Insufficient Balance
                </p>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="mt-5 flex w-full flex-col gap-4">
          <div className="relative">
            <div
              className={`
							 flex border bg-gray40 text-xs text-gray100 ${
                 nftAddressError ? "border-error" : "border-gray50"
               } ${
                 data.nftTokenIds.length >= 1 ? "opacity-[0.5]" : "opacity-1"
               } h-[43px] max-w-[452px]  overflow-hidden rounded-xl`}
            >
              <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
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
                <div className="m-0 flex h-full w-[50px] items-center bg-gray30 p-0">
                  <Lottie
                    width={45}
                    height={45}
                    options={loadAnimationOption}
                  ></Lottie>
                </div>
              )}
              {nftContractStatus.isValid ===
                ContractValidationStatus.NotValid && (
                <div className="m-0 flex h-full w-[70px] items-center justify-center bg-gray30 p-0">
                  <Icon iconSrc="/assets/images/provider-dashboard/invalidAddress.svg" />
                </div>
              )}
              {nftContractStatus.isValid === ContractValidationStatus.Valid && (
                <div className="m-0 flex h-full w-[70px] items-center justify-center bg-gray30 p-0">
                  <Icon iconSrc="/assets/images/provider-dashboard/validAddress.svg" />
                </div>
              )}
            </div>
            {showErrors && !data.nftContractAddress && (
              <p className="absolute left-1 m-0 mt-[2px] p-0 text-2xs text-error">
                Required
              </p>
            )}
            {nftContractStatus.isValid ===
              ContractValidationStatus.NotValid && (
              <p className="absolute m-0 mt-[2px] p-0 text-2xs text-error ">
                Invalid NFT Contract Address
              </p>
            )}
          </div>

          <div className="relative mt-1">
            <div className={`tooltip ${showTooltip ? "flex" : "hidden"}`}>
              <div className="absolute -right-6 -top-4 z-100 flex h-[20px] w-[100px] items-center justify-center rounded-sm bg-gray100 text-xs">
                tooltip message
              </div>
              <div className="absolute right-6 top-[1px] h-[5px] w-[5px] rotate-45  bg-green-100"></div>
            </div>
            <div
              className={`
							 flex border bg-gray40 text-xs text-gray100 ${
                 Number(numberOfNfts) > 500 ||
                 (data.nftTokenIds.length > 0 &&
                   data.nftTokenIds.length != Number(numberOfNfts))
                   ? "border-error"
                   : "border-gray50"
               } h-[43px] max-w-[452px]  items-center justify-between overflow-hidden rounded-xl pr-4`}
            >
              <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
                <p>Number of Nfts</p>
              </div>
              <div className="h-full w-full max-w-[254px] overflow-hidden px-2">
                <input
                  disabled={nftNumberFieldDisabled}
                  name="NumberOfNfts"
                  placeholder="Number Of Nfts"
                  value={numberOfNfts}
                  className="provider-dashboard-input h-full w-full"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  onChange={(e) =>
                    setNumberOfNfts(e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
              <div className="relative min-w-[20px]">
                <Icon
                  iconSrc="/assets/images/provider-dashboard/exclamation.svg"
                  className="cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
              </div>
              {Number(numberOfNfts) > 500 && (
                <p className="absolute -bottom-4 left-0 m-0 p-0 text-2xs text-error">
                  Maximum is 500
                </p>
              )}
            </div>
            {data.nftTokenIds.length > 0 &&
              data.nftTokenIds.length != Number(numberOfNfts) && (
                <p className="absolute -bottom-4 left-0 m-0 p-0 text-2xs text-error">
                  Number of NFTs are not equal with Number of NFts you added.
                </p>
              )}
          </div>
          {data.nftTokenIds.length > 0 ? (
            <div className="relative mt-[4px] flex max-h-[44px] items-center justify-between rounded-xl border border-gray60 bg-gray50 p-2 px-5">
              <div className="text-xs text-white">
                <p>{data.nftTokenIds.length} NFT ID added</p>
                <div className="flex text-2xs text-gray90">
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
                  className="flex h-[20px] w-[60px] items-center justify-center rounded border border-gray80 bg-gray70 text-2xs text-gray90"
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
                className={`flex text-xs text-white ${
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
                } h-[44px] w-full  max-w-[452px] items-center overflow-hidden  rounded-xl border bg-gray40`}
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
                <p className="absolute m-0 ml-1 mt-[2px] p-0 text-2xs text-error">
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
