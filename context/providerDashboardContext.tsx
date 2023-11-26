"use client";

import {
  Chain,
  ConstraintParamValues,
  ConstraintProps,
  NftStatusProp,
  ProviderDashboardFormDataProp,
  UserRafflesProps,
} from "@/types";
import { NullCallback } from "@/utils";
import { FC, PropsWithChildren, createContext, useState } from "react";
import { useUserProfileContext } from "./userProfile";
import {
  useWalletAccount,
  useWalletNetwork,
  useWalletProvider,
  useWalletSigner,
} from "@/utils/wallet";

const formInitialData: ProviderDashboardFormDataProp = {
  provider: "",
  description: "",
  isNft: false,
  isNativeToken: false,
  tokenAmount: "",
  tokenContractAddress: "",
  nftContractAddress: "",
  nftTokenIds: [],
  selectedChain: null,
  startTimeStamp: null,
  endTimeStamp: null,
  limitEnrollPeopleCheck: false,
  maxNumberOfEntries: null,
  email: "",
  twitter: "",
  discord: "",
  telegram: "",
  creatorUrl: "",
  necessaryInfo: "",
  satisfy: "satisfyAll",
  allowListPrivate: false,
  setDuration: false,
  numberOfDuration: 0,
  durationUnitTime: "Month",
  NftSatisfy: false,
  decimal: null,
  tokenName: null,
  tokenSymbol: null,
  tokenDecimals: null,
  userTokenBalance: undefined,
  nftName: null,
  nftSymbol: null,
  userNftBalance: undefined,
  nftTokenUri: null,
  winnersCount: 1,
};

const title = {
  0: "Prize Info",
  1: "Time Limitation",
  2: "Requirements",
  4: "Contact Info",
  5: "Deposit Prize",
  6: "Information Verification",
};

const errorMessages = {
  required: "Required",
  invalidFormat: "Invalid Format",
  startTimeDuration: "The start time must be at least 7 days after now.",
  endDateUnacceptable: "End date is unacceptable.",
  period: "The minimum period is one week.",
  endLessThanStart: "The end time cannot be less than the start time.",
  invalidInput: "Invalid input",
};

type ErrorObjectProp = {
  startDateStatus: null | boolean;
  statDateStatusMessage: null | string;
  endDateStatus: null | boolean;
  endDateStatusMessage: null | string;
  numberOfDurationStatus: null | boolean;
  numberOfDurationMessage: null | string;
  maximumLimitationStatus: null | boolean;
  maximumLimitationMessage: null | string;
  numberOfWinnersStatus: boolean;
  numberOfWinnersMessage: null | string;
};

export const ProviderDashboardContext = createContext<{
  page: number;
  setPage: (page: number) => void;
  data: ProviderDashboardFormDataProp;
  selectedConstrains: ConstraintProps | null;
  title: any;
  handleChange: (e: any) => void;
  handleSelectTokenOrNft: (e: boolean) => void;
  handleSelectLimitEnrollPeopleCheck: () => void;
  openRequirementModal: () => void;
  openAddNftIdListModal: () => void;
  closeRequirementModal: () => void;
  closeAddNftIdListModal: () => void;
  openCreteRaffleModal: () => void;
  closeCreateRaffleModal: () => void;
  openShowPreviewModal: () => void;
  closeShowPreviewModal: () => void;
  handleSelectConstraint: (constraint: ConstraintProps) => void;
  isModalOpen: boolean;
  selectedConstraintTitle: string | null;
  handleBackToRequirementModal: () => void;
  chainList: Chain[];
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain) => void;
  chainName: string;
  handleSearchChain: (e: any) => void;
  setChainName: (e: string) => void;
  filterChainList: Chain[];
  setSearchPhrase: (e: string) => void;
  handleSelectChain: (chain: Chain) => void;
  handleSelectSatisfy: (satisfy: string) => void;
  allowListPrivate: boolean;
  handleSelectAllowListPrivate: () => void;
  canGoStepTwo: () => boolean;
  canGoStepThree: () => void;
  canGoStepFive: () => boolean;
  setDuration: boolean;
  handleSetDuration: (e: boolean) => void;
  handleSelectDurationUnitTime: (unit: string) => void;
  selectNewOffer: boolean;
  handleSelectNewOffer: (select: boolean) => void;
  handleGOToDashboard: () => void;
  insertRequirement: (
    requirement: ConstraintParamValues | null,
    id: number,
    name: string
  ) => void;
  requirementList: ConstraintParamValues[];
  deleteRequirement: (id: number) => void;
  updateRequirement: (
    id: number,
    requirements: ConstraintParamValues | null
  ) => void;
  handleSelectNativeToken: (e: boolean) => void;
  handleCreateRaffle: () => void;
  isCreateRaffleModalOpen: boolean;
  createRaffleResponse: any | null;
  createRaffleLoading: boolean;
  handleSetCreateRaffleLoading: () => void;
  checkingContractInfo: boolean;
  isTokenContractAddressValid: boolean;
  isNftContractAddressValid: boolean;
  handleSetDate: (timeStamp: number, label: string) => void;
  handleApproveErc20Token: () => void;
  isErc20Approved: boolean;
  isApprovedAll: boolean;
  approveLoading: boolean;
  constraintsList: ConstraintProps[];
  handleApproveErc721Token: () => void;
  canDisplayErrors: boolean;
  userRaffles: UserRafflesProps[];
  userRafflesLoading: boolean;
  handleGetConstraints: () => void;
  updateChainList: () => void;
  canDisplayWrongAddress: boolean;
  handleCheckForReason: (raffle: UserRafflesProps) => void;
  handleShowUserDetails: (raffle: UserRafflesProps) => void;
  handleAddNftToData: (nftIds: string[]) => void;
  setUploadedFile: (file: any) => void;
  uploadedFile: any;
  isShowingDetails: boolean;
  handleCheckOwnerOfNfts: (nftIds: string[]) => Promise<boolean>;
  nftStatus: NftStatusProp[];
  handleClearNfts: () => void;
  selectedRaffleForCheckReason: UserRafflesProps | null;
}>({
  page: 0,
  setPage: NullCallback,
  data: formInitialData,
  selectedConstrains: null,
  title,
  handleChange: NullCallback,
  handleSelectTokenOrNft: NullCallback,
  handleSelectLimitEnrollPeopleCheck: NullCallback,
  closeRequirementModal: NullCallback,
  closeAddNftIdListModal: NullCallback,
  closeCreateRaffleModal: NullCallback,
  openRequirementModal: NullCallback,
  openAddNftIdListModal: NullCallback,
  openCreteRaffleModal: NullCallback,
  handleSelectConstraint: NullCallback,
  isModalOpen: false,
  selectedConstraintTitle: null,
  handleBackToRequirementModal: NullCallback,
  chainList: [],
  selectedChain: null,
  setSelectedChain: NullCallback,
  chainName: "",
  handleSearchChain: NullCallback,
  setChainName: NullCallback,
  filterChainList: [],
  setSearchPhrase: NullCallback,
  handleSelectChain: NullCallback,
  handleSelectSatisfy: NullCallback,
  allowListPrivate: false,
  handleSelectAllowListPrivate: NullCallback,
  canGoStepTwo: () => false,
  canGoStepThree: NullCallback,
  canGoStepFive: () => false,
  setDuration: false,
  handleSetDuration: NullCallback,
  handleSelectDurationUnitTime: NullCallback,
  openShowPreviewModal: NullCallback,
  closeShowPreviewModal: NullCallback,
  selectNewOffer: false,
  handleSelectNewOffer: NullCallback,
  handleGOToDashboard: NullCallback,
  insertRequirement: NullCallback,
  requirementList: [],
  deleteRequirement: NullCallback,
  updateRequirement: NullCallback,
  handleSelectNativeToken: NullCallback,
  handleCreateRaffle: NullCallback,
  isCreateRaffleModalOpen: false,
  createRaffleResponse: null,
  createRaffleLoading: false,
  handleSetCreateRaffleLoading: NullCallback,
  checkingContractInfo: false,
  isTokenContractAddressValid: false,
  isNftContractAddressValid: false,
  handleSetDate: NullCallback,
  handleApproveErc20Token: NullCallback,
  isErc20Approved: false,
  approveLoading: false,
  constraintsList: [],
  isApprovedAll: false,
  handleApproveErc721Token: NullCallback,
  canDisplayErrors: false,
  userRaffles: [],
  userRafflesLoading: false,
  handleGetConstraints: NullCallback,
  updateChainList: NullCallback,
  canDisplayWrongAddress: false,
  handleCheckForReason: NullCallback,
  handleShowUserDetails: NullCallback,
  handleAddNftToData: NullCallback,
  setUploadedFile: NullCallback,
  uploadedFile: null,
  isShowingDetails: false,
  handleCheckOwnerOfNfts: async () => false,
  nftStatus: [],
  handleClearNfts: NullCallback,
  selectedRaffleForCheckReason: null,
});

const ProviderDashboard: FC<PropsWithChildren> = ({ children }) => {
  const [requirementList, setRequirementList] = useState<
    ConstraintParamValues[]
  >([]);

  const [canDisplayErrors, setCanDisplayErrors] = useState<boolean>(false);

  const [selectNewOffer, setSelectNewOffer] = useState<boolean>(false);

  const [checkingContractInfo, setCheckingContractInfo] =
    useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedChain, setSelectedChain] = useState<any | null>(null);

  const [chainName, setChainName] = useState<string>("");

  const [page, setPage] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isCreateRaffleModalOpen, setIsCreateRaffleModalOpen] =
    useState<boolean>(false);

  const [chainList, setChainList] = useState<Chain[]>([]);

  const [isErc20Approved, setIsErc20Approved] = useState<boolean>(false);

  const [allowListPrivate, setAllowListPrivate] = useState<boolean>(false);

  const [createRaffleResponse, setCreteRaffleResponse] = useState<any | null>(
    null
  );

  const [createRaffleLoading, setCreateRaffleLoading] =
    useState<boolean>(false);

  const [userRafflesLoading, setUserRafflesLoading] = useState<boolean>(false);

  const [isApprovedAll, setIsApprovedAll] = useState<boolean>(false);

  const [selectedConstrains, setSelectedConstrains] =
    useState<ConstraintProps | null>(null);

  const [selectedConstraintTitle, setSelectedConstraintTitle] = useState<
    string | null
  >(null);

  const [userRaffles, setUserRaffles] = useState<UserRafflesProps[]>([]);

  const [approveLoading, setApproveLoading] = useState<boolean>(false);

  const [canDisplayWrongAddress, setCanDisplayWrongAddress] =
    useState<boolean>(false);

  const [selectedRaffleForCheckReason, setSelectedRaffleForCheckReason] =
    useState<UserRafflesProps | null>(null);

  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const [isShowingDetails, setIsShowingDetails] = useState<boolean>(false);
  const [setDuration, setSetDuration] = useState<boolean>(false);
  const [nftStatus, setNftStatus] = useState<NftStatusProp[]>([]);

  // validation states
  const [isTokenContractAddressValid, setIsTokenContractAddressValid] =
    useState<boolean>(false);

  const [isNftContractAddressValid, setIsNftContractAddressValid] =
    useState<boolean>(false);

  // hooks
  const { userToken } = useUserProfileContext();
  const signer = useWalletSigner();
  const provider = useWalletProvider();
  const { address, isConnected } = useWalletAccount();
  const { chain } = useWalletNetwork();

  const chainId = chain?.id;

  const deleteRequirement = (id: number) => {
    setRequirementList((prev) => prev.filter((item) => item.pk != id));
  };

  const handleSelectNewOffer = (select: boolean) => {
    setSelectNewOffer(select);
  };

  const updateRequirement = (
    id: number,
    requirements: ConstraintParamValues | null
  ) => {
    if (!requirements) return;

    const newItem = requirementList.map((item) => {
      if (item.pk == id) {
        return { ...requirements };
      }
      return item;
    });

    setRequirementList(newItem);
  };

  const handleSetDuration = (e: boolean) => {
    if (isShowingDetails) return;
    setSetDuration(e);
  };

  const isValidContractAddress = async (contractAddress: string) => {
    // try {
    //   const res = await provider?.getCode(contractAddress);
    //   return res != "0x";
    // } catch {
    //   return false;
    // }
  };

  return (
    <ProviderDashboardContext.Provider value={{}}>
      {children}
    </ProviderDashboardContext.Provider>
  );
};

export default ProviderDashboard;
