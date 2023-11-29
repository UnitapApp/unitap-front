"use client";

import {
  Chain,
  ConstraintParamValues,
  ConstraintProps,
  NftStatusProp,
  ProviderDashboardFormDataProp,
  UserRafflesProps,
} from "@/types";
import { NullCallback, fromWei } from "@/utils";
import {
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUserProfileContext } from "./userProfile";
import {
  useWalletAccount,
  useWalletNetwork,
  useWalletProvider,
  useWalletSigner,
} from "@/utils/wallet";
import { getErc721TokenContract } from "@/components/containers/provider-dashboard/helpers/getErc721NftContract";
import { getErc20TokenContract } from "@/components/containers/provider-dashboard/helpers/getErc20TokenContract";
import { isAddress } from "viem";
import { FAST_INTERVAL, ZERO_ADDRESS } from "@/constants";
import {
  getConstraintsApi,
  getProviderDashboardValidChain,
  getUserRaffles,
} from "@/utils/api";
import { createErc721Raffle } from "@/components/containers/provider-dashboard/helpers/createErc721Raffle";
import { createErc20Raffle } from "@/components/containers/provider-dashboard/helpers/createErc20Raffle";
import { approveErc721Token } from "@/components/containers/provider-dashboard/helpers/approveErc721Token";
import { approveErc20Token } from "@/components/containers/provider-dashboard/helpers/approveErc20Token";
import { checkNftsAreValid } from "@/components/containers/provider-dashboard/helpers/checkAreNftsValid";
import { useRefreshWithInitial } from "@/utils/hooks/refresh";

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

  const [data, setData] =
    useState<ProviderDashboardFormDataProp>(formInitialData);

  // validation states
  const [isTokenContractAddressValid, setIsTokenContractAddressValid] =
    useState<boolean>(false);

  const [isNftContractAddressValid, setIsNftContractAddressValid] =
    useState<boolean>(false);

  const [constraintsList, setConstraintsList] = useState<ConstraintProps[]>([]);

  // hooks
  const { userToken } = useUserProfileContext();
  const signer = useWalletSigner();
  const provider = useWalletProvider();
  const { address } = useWalletAccount();
  const { chain } = useWalletNetwork();

  const refController = useRef<any>();

  const filterChainList = useMemo(() => {
    return chainList.filter((chain) =>
      chain.chainName
        .toLocaleLowerCase()
        .includes(searchPhrase.toLocaleLowerCase())
    );
  }, [chainList, searchPhrase]);

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

  const isValidContractAddress = useCallback(
    async (contractAddress: string) => {
      try {
        const res = await provider?.getBytecode({
          address: contractAddress as any,
        });
        return res != "0x";
      } catch {
        return false;
      }
    },
    [provider]
  );

  const checkContractInfo = useCallback(async () => {
    if (!data.isNft && provider && address) {
      getErc20TokenContract(
        data,
        address,
        provider,
        setCheckingContractInfo,
        setIsTokenContractAddressValid,
        setData,
        setIsErc20Approved,
        setCanDisplayErrors
      );
    }

    if (data.isNft && provider && address) {
      getErc721TokenContract(
        data,
        address,
        provider,
        setCheckingContractInfo,
        setIsNftContractAddressValid,
        setData,
        setIsApprovedAll,
        setCanDisplayErrors
      );
    }
  }, [address, data, provider]);

  const checkContractAddress = useCallback(
    async (contractAddress: string) => {
      const step1Check = isAddress(contractAddress);
      const step2Check = await isValidContractAddress(contractAddress);
      const isValid = !!step1Check && step2Check;
      if (isValid) {
        checkContractInfo();
      } else {
        setCheckingContractInfo(false);
        data.isNft
          ? setIsNftContractAddressValid(false)
          : setIsTokenContractAddressValid(false);
        setCanDisplayErrors(true);
      }
    },
    [checkContractInfo, data.isNft, isValidContractAddress]
  );

  const handleSetDate = (timeStamp: number, label: string) => {
    label == "startTime"
      ? setData((prevData) => ({ ...prevData, startTimeStamp: timeStamp }))
      : setData((prevData) => ({ ...prevData, endTimeStamp: timeStamp }));
  };

  const canGoStepTwo = () => {
    if (isShowingDetails) return true;
    const {
      provider,
      description,
      selectedChain,
      tokenAmount,
      nftContractAddress,
      isNativeToken,
      tokenContractAddress,
      nftTokenIds,
    } = data;

    const checkToken = () => {
      if (!data.isNft) {
        const isValid =
          tokenContractAddress == ZERO_ADDRESS
            ? true
            : isTokenContractAddressValid;
        if (!isValid || !tokenAmount || Number(tokenAmount) <= 0) return false;
        if (!isNativeToken && !tokenContractAddress) return false;
        if (isNativeToken && tokenAmount && tokenContractAddress) return true;
      }
      return true;
    };

    const checkNft = () => {
      if (data.isNft) {
        const isValid = isNftContractAddressValid;
        return !!(nftContractAddress && nftTokenIds.length >= 1 && isValid);
      }
      return true;
    };

    return !!(
      provider &&
      description &&
      selectedChain &&
      checkNft() &&
      checkToken()
    );
  };

  const canGoStepThree = () => {
    const errorObject: ErrorObjectProp = {
      startDateStatus: true,
      statDateStatusMessage: null,
      endDateStatus: true,
      endDateStatusMessage: null,
      numberOfDurationStatus: true,
      numberOfDurationMessage: null,
      maximumLimitationStatus: true,
      maximumLimitationMessage: null,
      numberOfWinnersStatus: true,
      numberOfWinnersMessage: null,
    };

    const { startTimeStamp, endTimeStamp } = data;
    if (!startTimeStamp) {
      errorObject.startDateStatus = false;
      errorObject.statDateStatusMessage = errorMessages.required;
    }
    const sevenDaysLaterAfterNow: Date = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
    const sevenDaysLaterAfterNowTimeStamp = Math.round(
      sevenDaysLaterAfterNow.getTime() / 1000
    );

    if (startTimeStamp && startTimeStamp < sevenDaysLaterAfterNowTimeStamp) {
      errorObject.startDateStatus = false;
      errorObject.statDateStatusMessage = errorMessages.startTimeDuration;
    }
    if (!setDuration && !endTimeStamp) {
      errorObject.endDateStatus = false;
      errorObject.endDateStatusMessage = errorMessages.required;
    }

    if (!setDuration && endTimeStamp && startTimeStamp) {
      if (endTimeStamp <= startTimeStamp) {
        errorObject.endDateStatus = false;
        errorObject.endDateStatusMessage = errorMessages.endLessThanStart;
      }
    }

    if (setDuration && !data.numberOfDuration) {
      errorObject.numberOfDurationStatus = false;
      errorObject.numberOfDurationMessage = errorMessages.required;
    }

    if (data.limitEnrollPeopleCheck && !data.maxNumberOfEntries) {
      errorObject.maximumLimitationStatus = false;
      errorObject.maximumLimitationMessage = errorMessages.required;
    }

    if (data.maxNumberOfEntries && Number(data.maxNumberOfEntries) <= 0) {
      errorObject.maximumLimitationStatus = false;
      errorObject.maximumLimitationMessage = errorMessages.required;
    }

    if (
      data.winnersCount &&
      Math.floor(data.winnersCount) != data.winnersCount
    ) {
      console.log(data.winnersCount, Math.floor(data.winnersCount));
      errorObject.numberOfWinnersStatus = false;
      errorObject.numberOfWinnersMessage = errorMessages.invalidInput;
    }

    if (data.winnersCount && data.winnersCount <= 0) {
      console.log("----+");
      errorObject.numberOfWinnersStatus = false;
      errorObject.numberOfWinnersMessage = errorMessages.invalidInput;
    }

    if (!data.winnersCount) {
      console.log("---++");
      errorObject.numberOfWinnersStatus = false;
      errorObject.numberOfWinnersMessage = errorMessages.required;
    }

    return errorObject;
  };

  const canGoStepFive = () => {
    if (isShowingDetails) return true;
    const { email, twitter } = data;
    return !!(email && twitter);
  };

  const handleSelectNativeToken = (e: boolean) => {
    setCanDisplayErrors(false);
    if (!data.selectedChain || isShowingDetails) return;
    setIsErc20Approved(!e);
    setData((prevData) => ({
      ...prevData,
      isNativeToken: !e,
      tokenContractAddress: !e ? ZERO_ADDRESS : "",
      decimal: !e ? 18 : null,
    }));
  };

  const handleSelectDurationUnitTime = (unit: string) => {
    setData((prevData) => ({
      ...prevData,
      ["durationUnitTime"]: unit,
    }));
  };

  const handleSelectAllowListPrivate = () => {
    setAllowListPrivate(!allowListPrivate);
  };

  const handleSelectTokenOrNft = (e: boolean) => {
    if (!data.selectedChain || isShowingDetails) return;
    setData((prevData) => ({
      ...prevData,
      ["isNft"]: e,
    }));
  };

  const handleGetUserRaffles = useCallback(async () => {
    console.log(userToken);
    if (!userToken) return;
    setUserRafflesLoading(true);
    refController.current = new AbortController();
    try {
      const raffles = await getUserRaffles(
        userToken,
        refController.current.signal
      );
      refController.current = null;
      setUserRaffles(raffles);
      setUserRafflesLoading(false);
    } catch (e: any) {
      if (e?.message !== "canceled" || !e?.message) {
        console.log(e);
      }
      setUserRafflesLoading(false);
    }
  }, [userToken]);

  const updateChainList = useCallback(async () => {
    try {
      const newChainList = await getProviderDashboardValidChain();
      setChainList(newChainList);
    } catch (e) {}
  }, []);

  const handleSearchChain = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setChainName(e.target.value);
    setSearchPhrase(e.target.value);
  };

  const handleSelectChain = (chain: Chain) => {
    setSelectedChain(chain);
    setChainName(chain.chainName);
    setSearchPhrase("");
  };

  const handleSelectSatisfy = (satisfy: string) => {
    setData((prevData) => ({
      ...prevData,
      ["satisfy"]: satisfy,
    }));
  };

  const handleGetConstraints = async () => {
    if (constraintsList.length != 0) return;
    const res = await getConstraintsApi();
    setConstraintsList(res);
  };

  const handleSelectLimitEnrollPeopleCheck = () => {
    if (isShowingDetails) return true;
    setData((prevData) => ({
      ...prevData,
      limitEnrollPeopleCheck: !data.limitEnrollPeopleCheck,
      maxNumberOfEntries: null,
    }));
  };

  const handleChange = (e: {
    target: { type: any; name: any; checked: any; value: any };
  }) => {
    if (isShowingDetails) return;
    setCanDisplayWrongAddress(false);
    const type = e.target.type;
    const name = e.target.name;
    if (name == "tokenContractAddress" || name == "nftContractAddress") {
      setCanDisplayErrors(false);
    }
    const value = type == "checkbox" ? e.target.checked : e.target.value;
    if (name == "provider" && value.length > 30) return;
    if (name == "description" && value.length > 100) return;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectConstraint = (constraint: ConstraintProps) => {
    setSelectedConstraintTitle(constraint.title);
    setSelectedConstrains(constraint);
  };

  const handleBackToRequirementModal = () => {
    setSelectedConstrains(null);
    setSelectedConstraintTitle(null);
  };

  const closeRequirementModal = () => {
    setSelectedConstrains(null);
    setSelectedConstraintTitle(null);
    setIsModalOpen(false);
  };

  const closeAddNftIdListModal = () => {
    setIsModalOpen(false);
  };

  const closeCreateRaffleModal = () => {
    setIsCreateRaffleModalOpen(false);
  };

  const openCreteRaffleModal = () => {
    setIsCreateRaffleModalOpen(true);
  };

  const openRequirementModal = () => {
    if (isShowingDetails) return;
    setIsModalOpen(true);
  };

  const openAddNftIdListModal = () => {
    if (isShowingDetails) return;
    setIsModalOpen(true);
  };

  const closeShowPreviewModal = () => {
    setIsModalOpen(false);
  };

  const openShowPreviewModal = () => {
    setIsModalOpen(true);
  };

  const handleGOToDashboard = () => {
    setSelectNewOffer(false);
    setIsShowingDetails(false);
    setPage(0);
    setData(formInitialData);
    setChainName("");
    setSelectedChain(null);
    setCreteRaffleResponse(null);
    setRequirementList([]);
    setIsModalOpen(false);
  };

  const handleApproveErc20Token = () => {
    if (!provider || !address || !signer) return;

    approveErc20Token(
      data,
      provider,
      signer,
      address,
      setApproveLoading,
      setIsErc20Approved
    );
  };

  const handleApproveErc721Token = () => {
    if (!provider || !address || !signer) return;
    approveErc721Token(
      data,
      provider,
      signer,
      address,
      setApproveLoading,
      setIsApprovedAll
    );
  };

  const handleSetCreateRaffleLoading = () => {
    setCreateRaffleLoading(true);
  };

  const handleCreateRaffle = () => {
    if (!address || !address || !provider || !userToken || !signer) return;

    if (!data.isNft) {
      createErc20Raffle(
        data,
        provider,
        signer,
        requirementList,
        address,
        userToken,
        setCreateRaffleLoading,
        setCreteRaffleResponse
      );
    } else {
      createErc721Raffle(
        data,
        provider,
        signer,
        requirementList,
        address,
        userToken,
        setCreateRaffleLoading,
        setCreteRaffleResponse
      );
    }
  };

  const insertRequirement = (
    requirement: ConstraintParamValues | null,
    id: number,
    name: string
  ) => {
    setRequirementList([
      ...requirementList,
      {
        pk: id,
        values: !requirement ? null : { 1: "test", 2: "name", 3: "lastName" },
        name,
      },
    ]);
  };

  const handleCheckForReason = (raffle: UserRafflesProps) => {
    setPage(5);
    setSelectNewOffer(true);
    setSelectedRaffleForCheckReason(raffle);
  };

  const handleShowUserDetails = async (raffle: UserRafflesProps) => {
    setCanDisplayErrors(false);
    setChainName(raffle.chain.chainName);
    setData((prev) => ({
      ...prev,
      provider: raffle.name,
      selectedChain: raffle.chain,
      description: raffle.description,
      isNft: raffle.isPrizeNft,
      isNativeToken: raffle.prizeAsset == ZERO_ADDRESS,
      tokenAmount: fromWei(BigInt(raffle.prizeAmount), raffle.decimals),
      tokenContractAddress: raffle.isPrizeNft ? "" : raffle.prizeAsset,
      startTimeStamp: Date.parse(raffle.startAt) / 1000,
      endTimeStamp: Date.parse(raffle.deadline) / 1000,
      limitEnrollPeopleCheck:
        raffle.maxNumberOfEntries != 1000000000 ? true : false,
      maxNumberOfEntries:
        raffle.maxNumberOfEntries != 1000000000
          ? raffle.maxNumberOfEntries.toString()
          : null,
      winnersCount: raffle.winnersCount,
      nftTokenIds: raffle.nftIds ? raffle.nftIds.split(",") : [],
      twitter: raffle.twitterUrl,
      discord: raffle.discordUrl,
      creatorUrl: raffle.creatorUrl,
      telegram: raffle.telegramUrl,
      email: raffle.emailUrl,
      necessaryInfo: raffle.necessaryInformation,
    }));
    setIsShowingDetails(true);
    setSelectNewOffer(true);
    raffle.isPrizeNft
      ? setIsNftContractAddressValid(true)
      : setIsTokenContractAddressValid(true);
    setConstraintsList(await getConstraintsApi());
    setRequirementList(raffle.constraints);
  };

  const handleCheckOwnerOfNfts = async (nftIds: string[]) => {
    if (provider && address) {
      setNftStatus([]);
      const res = await checkNftsAreValid(data, provider, nftIds, address);
      const invalidNfts = res?.filter((item) => !item.isOwner);
      if (invalidNfts && invalidNfts.length > 0) {
        setNftStatus(invalidNfts);
      }
      return !res?.find((item) => !item.isOwner);
    }
    return false;
  };

  const handleAddNftToData = async (nftIds: string[]) => {
    setData((prev) => ({
      ...prev,
      nftTokenIds: nftIds,
    }));
  };

  const handleClearNfts = () => {
    if (isShowingDetails) return;
    setUploadedFile(null);
    setData((prev) => ({ ...prev, nftTokenIds: [], nftContractAddress: "" }));
  };

  useEffect(() => {
    if (isShowingDetails) return;
    setCheckingContractInfo(true);
    setCanDisplayErrors(false);
    if (!data.isNft && data.tokenContractAddress == ZERO_ADDRESS) {
      setIsTokenContractAddressValid(true);
      setCheckingContractInfo(false);
      return;
    }
    checkContractAddress(data.tokenContractAddress);
  }, [
    data.tokenContractAddress,
    chainId,
    isShowingDetails,
    data.isNft,
    checkContractAddress,
  ]);

  useEffect(() => {
    if (isShowingDetails) return;
    setCheckingContractInfo(true);
    setCanDisplayErrors(false);
    checkContractAddress(data.nftContractAddress);
  }, [
    data.nftContractAddress,
    chainId,
    isShowingDetails,
    checkContractAddress,
  ]);

  useEffect(() => {
    if (isShowingDetails) return;
    if (data.tokenAmount && data.tokenContractAddress != ZERO_ADDRESS) {
      const debounce = setTimeout(() => {
        checkContractInfo();
      }, 700);

      return () => clearTimeout(debounce);
    }
  }, [
    checkContractInfo,
    data.tokenAmount,
    data.tokenContractAddress,
    isShowingDetails,
  ]);

  useEffect(() => {
    return () => refController.current?.abort();
  }, []);

  useEffect(() => {
    if (selectedChain) {
      setChainName(selectedChain?.chainName);
      setData((prevData) => ({
        ...prevData,
        ["selectedChain"]: selectedChain,
      }));
    }
  }, [selectedChain]);

  useEffect(() => {
    updateChainList();
  }, [updateChainList]);

  useEffect(() => {
    let newEndTimeStamp: any;
    if (setDuration && data.startTimeStamp && data.numberOfDuration > 0) {
      if (data.durationUnitTime == "Day") {
        newEndTimeStamp =
          data.startTimeStamp + data.numberOfDuration * 24 * 60 * 60;
      }
      if (data.durationUnitTime == "Week") {
        newEndTimeStamp =
          data.startTimeStamp + data.numberOfDuration * 7 * 24 * 60 * 60;
      }
      if (data.durationUnitTime == "Month") {
        const currentDate = new Date(data.startTimeStamp * 1000);

        newEndTimeStamp = Math.round(
          currentDate.setMonth(
            Number(currentDate.getMonth()) + Number(data.numberOfDuration)
          ) / 1000
        );
      }
    }
    if (newEndTimeStamp) {
      setData((prevData) => ({
        ...prevData,
        ["endTimeStamp"]: newEndTimeStamp,
      }));
    }
  }, [
    setDuration,
    data.durationUnitTime,
    data.numberOfDuration,
    setData,
    data.startTimeStamp,
  ]);

  useRefreshWithInitial(
    () => {
      console.log(userToken);

      if (userRaffles.length > 0) return;
      handleGetUserRaffles();
    },
    FAST_INTERVAL,
    [handleGetUserRaffles, userToken, userRaffles]
  );

  return (
    <ProviderDashboardContext.Provider
      value={{
        page,
        setPage,
        data,
        title,
        handleChange,
        handleSelectTokenOrNft,
        handleSelectLimitEnrollPeopleCheck,
        openRequirementModal,
        closeRequirementModal,
        openAddNftIdListModal,
        closeAddNftIdListModal,
        isModalOpen,
        selectedConstrains,
        handleSelectConstraint,
        selectedConstraintTitle,
        handleBackToRequirementModal,
        chainList,
        selectedChain,
        setSelectedChain,
        chainName,
        handleSearchChain,
        setChainName,
        filterChainList,
        setSearchPhrase,
        handleSelectChain,
        handleSelectSatisfy,
        allowListPrivate,
        handleSelectAllowListPrivate,
        canGoStepTwo,
        canGoStepThree,
        canGoStepFive,
        setDuration,
        handleSetDuration,
        handleSelectDurationUnitTime,
        closeShowPreviewModal,
        openShowPreviewModal,
        selectNewOffer,
        handleSelectNewOffer,
        handleGOToDashboard,
        insertRequirement,
        requirementList,
        deleteRequirement,
        updateRequirement,
        handleSelectNativeToken,
        handleCreateRaffle,
        closeCreateRaffleModal,
        isCreateRaffleModalOpen,
        openCreteRaffleModal,
        createRaffleResponse,
        createRaffleLoading,
        handleSetCreateRaffleLoading,
        checkingContractInfo,
        isTokenContractAddressValid,
        isNftContractAddressValid,
        handleSetDate,
        handleApproveErc20Token,
        isErc20Approved,
        approveLoading,
        constraintsList,
        isApprovedAll,
        handleApproveErc721Token,
        canDisplayErrors,
        userRaffles,
        userRafflesLoading,
        handleGetConstraints,
        updateChainList,
        canDisplayWrongAddress,
        handleCheckForReason,
        handleShowUserDetails,
        handleAddNftToData,
        setUploadedFile,
        uploadedFile,
        isShowingDetails,
        handleCheckOwnerOfNfts,
        nftStatus,
        handleClearNfts,
        selectedRaffleForCheckReason,
      }}
    >
      {children}
    </ProviderDashboardContext.Provider>
  );
};

export const usePrizeOfferFormContext = () => {
  return useContext(ProviderDashboardContext);
};

export default ProviderDashboard;
