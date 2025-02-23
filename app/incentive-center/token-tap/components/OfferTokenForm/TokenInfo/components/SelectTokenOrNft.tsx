"use client";

import Lottie from "react-lottie";
import AddNftIdListModal from "./AddNftIdListModal";
interface Prop {
  showErrors: boolean;
  isRightChain?: boolean;
}

import { loadAnimationOption } from "@/constants/lottieCode";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";
import { ZERO_ADDRESS, tokensInformation } from "@/constants";
import { useEffect, useRef, useState } from "react";
import { ContractValidationStatus, TokenBalance, TokenOnChain } from "@/types";
import { useOutsideClick } from "@/utils/hooks/dom";
import { zeroAddress } from "viem";
import { formatNumber, fromWei } from "@/utils";
import { useWalletAccount, useWalletNetwork } from "@/utils/wallet";
import { fetchBalances } from "@/components/containers/provider-dashboard/helpers/fetchBalances";
import { getBalance } from "wagmi/actions";
import { config } from "@/utils/wallet/wagmi";

const SelectTokenOrNft = ({ showErrors, isRightChain }: Prop) => {
  const {
    data,
    handleSelectTokenOrNft,
    handleChange,
    openAddNftIdListModal,
    isShowingDetails,
    handleClearNfts,
    insufficientBalance,
    tokenContractStatus,
    nftContractStatus,
    numberOfNfts,
    setNumberOfNfts,
    selectedToken,
    // userBalance,
    setData,
    setSelectedToken,
    tokenName,
    setTokenName,
  } = useTokenTapFromContext();

  const isTokenFieldDisabled =
    isShowingDetails ||
    !data.selectedChain ||
    tokenContractStatus.checking ||
    // !isRightChain ||
    isShowingDetails;

  const isNftFieldDisabled =
    isShowingDetails ||
    !data.selectedChain ||
    nftContractStatus.checking ||
    // !isRightChain ||
    data.nftTokenIds.length > 0;

  const isAmountFieldsDisabled =
    isShowingDetails ||
    tokenContractStatus.checking ||
    tokenContractStatus.isValid === ContractValidationStatus.NotValid ||
    tokenContractStatus.isValid === ContractValidationStatus.Empty ||
    !data.tokenContractAddress;

  const totalAmountError =
    (data.tokenAmount && insufficientBalance) ||
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
    // !isRightChain ||
    !data.nftContractAddress;

  const [tokenList, setTokenList] = useState<TokenOnChain[] | null>(null);
  const { chain } = useWalletNetwork();
  const { address } = useWalletAccount();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance | null>(null);
  const [userWalletBalance, setUserWalletBalance] = useState<string>("");

  const handleGetWalletBalance = async () => {
    const chainId: number = Number(data.selectedChain.chainId);
    const balance = await getBalance(config, {
      address: address!,
      chainId: chainId,
    });
    setUserWalletBalance(balance.formatted);
  };

  useEffect(() => {
    if (data.selectedChain && address) {
      handleGetWalletBalance();
    }
  }, [data.selectedChain, address]);

  useEffect(() => {
    if (data.selectedChain) {
      handleGetTokenList();
    } else {
      setTokenList(null);
    }
  }, [data.selectedChain]);

  useEffect(() => {
    if (!data.selectedChain) return;
    let list = tokensInformation.find(
      (item) => item.chainId === data.selectedChain.chainId,
    )?.tokenList;
    if (
      tokenName &&
      tokenName.substring(0, 2) != "0x" &&
      data.selectedChain &&
      selectedToken?.tokenSymbol !== tokenName
    ) {
      let filteredList = list?.filter((item) =>
        item.tokenSymbol.toLowerCase().includes(tokenName.toLowerCase()),
      );
      setTokenList(filteredList!);
    } else {
      setTokenList(list!);
    }
  }, [tokenName]);

  const handleGetTokenList = async () => {
    // const selectedChainId = Number(data.selectedChain.chainId);
    // const currentChainId = Number(chain!.id);
    let list = tokensInformation.find(
      (item) => item.chainId === data.selectedChain.chainId,
    )?.tokenList;
    if (!list) {
      setTokenBalances(null);
      setTokenList(null);
      return;
    }
    setTokenList(list);
    const addresses = list.map((address) => address.tokenAddress);
    const res = await handleFetchBalances(addresses);

    const balances = res?.reduce(
      (
        acc: { [tokenAddress: string]: string },
        balancesResult,
        index: number,
      ) => {
        const tokenAddress = addresses[index].toLowerCase();
        if (balancesResult.error) {
          acc[tokenAddress] = "";
        } else {
          acc[tokenAddress] = fromWei(
            balancesResult.result!.toString(),
            Number(list![index].tokenDecimals),
          );
        }
        return acc;
      },
      {},
    );

    setTokenBalances(balances!);

    // }

    // if (selectedChainId !== currentChainId) {
    //   setSelectedToken(null);
    //   setData((prev: any) => ({ ...prev, tokenContractAddress: '' }))
    //   setTokenName('')
    // }
  };

  const handleFetchBalances = async (addresses: string[]) => {
    if (!address) return;
    const res = await fetchBalances(
      addresses,
      address,
      data.selectedChain.chainId,
    );
    return res;
  };

  const handleSetTokenAddress = (item: TokenOnChain) => {
    setSelectedToken(item);
    setShowItems(false);
    setTokenName(item.tokenSymbol);
    setData((prevData: any) => ({
      ...prevData,
      isNativeToken: item.tokenAddress === zeroAddress,
      tokenContractAddress: item.tokenAddress,
      decimal: item.tokenAddress === zeroAddress ? 18 : null,
      tokenSymbol: item.tokenSymbol,
    }));
  };

  const handleCheckTokenAddress = (address: string) => {
    setTokenName(address);
    if (!address) {
      setData((prev: any) => ({ ...prev, tokenContractAddress: "" }));
      setSelectedToken(null);
    }
    if (address.substring(0, 2) == "0x" && data.selectedChain) {
      setData((prev: any) => ({ ...prev, tokenContractAddress: address }));
      return;
    }
    if (address.substring(0, 2) != "0x") {
      setShowItems(true);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  };
  const [showItems, setShowItems] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <div className={data.selectedChain ? "w-full" : "w-full opacity-30"}>
      <section className="flex h-[43px] w-full max-w-[452px] items-center overflow-hidden rounded-xl border border-gray50 bg-gray30 text-xs text-gray80">
        <div
          className={` ${!data.isNft && "border-gray50 bg-gray40 font-medium text-white"} flex h-full w-[50%] cursor-pointer items-center justify-center border-r border-r-gray50`}
          onClick={() => handleSelectTokenOrNft(false)}
        >
          Token
        </div>
        <div
          className={` ${data.isNft && "border-gray50 bg-gray40 font-medium text-white"} flex h-full w-[50%] cursor-pointer items-center justify-center border-l border-l-gray50 font-semibold text-gray90`}
          // onClick={() => handleSelectTokenOrNft(true)}
        >
          NFT
          <span className="ml-1 text-2xs text-gray100">(Coming soon...)</span>
        </div>
      </section>
      {!data.isNft ? (
        <div className="mt-4 flex w-full flex-col gap-5">
          <div className="relative">
            <div
              className={`flex h-[43px] max-w-[452px] overflow-hidden rounded-xl border-[1.4px] bg-gray40 text-xs text-gray100 ${tokenAddressError ? "border-error" : "border-gray50"}`}
            >
              <div
                className={`flex w-full cursor-pointer items-center justify-between`}
                ref={ref}
                onClick={() => {
                  !isShowingDetails && setShowItems(!showItems);
                }}
              >
                <div className="min-w-[50px]">
                  {tokenName && !tokenName.includes("0x") && selectedToken && (
                    <Icon
                      iconSrc={selectedToken?.logoUrl}
                      height="24px"
                      width="24px"
                    />
                  )}
                </div>
                <input
                  disabled={isTokenFieldDisabled}
                  name="tokenContractAddress"
                  placeholder="Search or paste token contract address"
                  value={tokenName ? tokenName : ""}
                  autoComplete="off"
                  className="provider-dashboard-input w-full"
                  type="text"
                  onChange={(e) => handleCheckTokenAddress(e.target.value)}
                />
                <div className="flex pr-5">
                  <div className="flex items-center text-gray100">
                    <span className="mx-2 h-1 w-1 rounded-full bg-gray100"></span>
                    <span className="mr-1">Balance:</span>
                    {tokenContractStatus.isValid ===
                      ContractValidationStatus.Valid &&
                    !tokenContractStatus.checking
                      ? data.tokenContractAddress !== zeroAddress
                        ? fromWei(data.userTokenBalance!, data.tokenDecimals)
                        : Number(userWalletBalance) > 0
                          ? Number(userWalletBalance).toFixed(5)
                          : "0"
                      : ""}
                  </div>
                </div>

                <div className="flex h-full w-[55px] items-center justify-center">
                  <Icon
                    iconSrc="/quest/assets/images/provider-dashboard/arrow-top.svg"
                    className={`${showItems ? "" : "rotate-180"}`}
                    width="12px"
                    height="12px"
                  />
                </div>
                {showItems &&
                  tokenList &&
                  tokenList.length > 0 &&
                  tokenBalances && (
                    <div className="absolute left-0 top-[45px] z-[11] max-h-40 w-full flex-col overflow-y-scroll rounded-lg border-2 border-gray60 bg-gray40">
                      {tokenList?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg pl-2 hover:bg-gray70"
                          onClick={() => handleSetTokenAddress(item)}
                        >
                          <Icon
                            iconSrc={item.logoUrl}
                            width="24px"
                            height="24px"
                          />
                          <p className="flex h-10 w-full cursor-pointer items-center text-sm">
                            {item.tokenSymbol}
                          </p>
                          {Number(
                            tokenBalances[item.tokenAddress.toLowerCase()],
                          ) > 0 && (
                            <p className="mr-4">
                              {" "}
                              {formatNumber(
                                Number(
                                  tokenBalances[
                                    item.tokenAddress.toLowerCase()
                                  ],
                                ),
                              )}
                            </p>
                          )}
                          {item.tokenAddress === zeroAddress &&
                            Number(userWalletBalance) > 0 && (
                              <p className="mr-4">
                                {" "}
                                {Number(userWalletBalance).toFixed(5)}
                              </p>
                            )}
                        </div>
                      ))}
                    </div>
                  )}
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
                  <Icon iconSrc="/quest/assets/images/provider-dashboard/invalidAddress.svg" />
                </div>
              )}
              {tokenContractStatus.isValid ===
                ContractValidationStatus.Valid && (
                <div className="m-0 flex h-full w-[70px] items-center justify-center bg-gray30 p-0">
                  <Icon iconSrc="/quest/assets/images/provider-dashboard/validAddress.svg" />
                </div>
              )}
            </div>
            {tokenContractStatus.isValid ===
              ContractValidationStatus.NotValid && (
              <p className="absolute m-0 mt-[2px] p-0 text-2xs text-error">
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
              className={`relative rounded-2xl border-2 p-5 ${
                totalAmountError ? "border-error" : "border-gray50"
              } `}
            >
              <div
                className={`flex h-[43px] w-full max-w-[452px] items-center justify-between gap-2 overflow-hidden rounded-xl border-2 border-gray50 bg-gray40 pr-4 text-xs text-gray100`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
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
                iconSrc="/quest/assets/images/provider-dashboard/cross.png"
                height="16px"
                width="16px"
                className="py-2"
              />
              <div
                className={`flex h-[43px] w-full max-w-[452px] items-center justify-between gap-2 overflow-hidden rounded-xl border border-gray50 bg-gray40 pr-4 text-xs text-gray100`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center justify-center bg-gray30 text-center">
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
                iconSrc="/quest/assets/images/provider-dashboard/equal.svg"
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
            ) : (
              data.tokenAmount &&
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
              className={`flex border-[1.4px] bg-gray40 text-xs text-gray80 ${
                nftAddressError ? "border-error" : "border-gray50"
              } ${
                data.nftTokenIds.length >= 1 ? "opacity-[0.5]" : "opacity-1"
              } h-[43px] max-w-[452px] overflow-hidden rounded-xl`}
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
                  className="provider-dashboard-input w-full"
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
                  <Icon iconSrc="/quest/assets/images/provider-dashboard/invalidAddress.svg" />
                </div>
              )}
              {nftContractStatus.isValid === ContractValidationStatus.Valid && (
                <div className="m-0 flex h-full w-[70px] items-center justify-center bg-gray30 p-0">
                  <Icon iconSrc="/quest/assets/images/provider-dashboard/validAddress.svg" />
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
              <p className="absolute m-0 mt-[2px] p-0 text-2xs text-error">
                Invalid NFT Contract Address
              </p>
            )}
          </div>

          <div className="relative mt-1">
            <div className={`tooltip ${showTooltip ? "flex" : "hidden"}`}>
              <div className="absolute -right-6 -top-4 z-100 flex h-[20px] w-[100px] items-center justify-center rounded-sm bg-gray100 text-xs">
                tooltip message
              </div>
              <div className="absolute right-6 top-[1px] h-[5px] w-[5px] rotate-45 bg-green-100"></div>
            </div>
            <div
              className={`flex border bg-gray40 text-xs text-gray80 ${
                Number(numberOfNfts) > 500 ||
                (data.nftTokenIds.length > 0 &&
                  data.nftTokenIds.length != Number(numberOfNfts))
                  ? "border-error"
                  : "border-gray50"
              } h-[43px] max-w-[452px] items-center justify-between overflow-hidden rounded-xl pr-4`}
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
                  iconSrc="/quest/assets/images/provider-dashboard/exclamation.svg"
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
                  iconSrc="/quest/assets/images/modal/exit.svg"
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
                } h-[44px] w-full max-w-[452px] items-center overflow-hidden rounded-xl border bg-gray40`}
              >
                <div className="flex h-full w-full max-w-[148px] items-center gap-2 p-3">
                  <Icon
                    width="16px"
                    height="16px"
                    iconSrc="/quest/assets/images/provider-dashboard/add-requirement.svg"
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
