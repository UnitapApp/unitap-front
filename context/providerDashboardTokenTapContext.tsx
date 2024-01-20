"use client";

import {
  Chain,
  RequirementProps,
  ConstraintProps,
  ContractStatus,
  ContractValidationStatus,
  EnrollmentDurationsProps,
  ErrorObjectProp,
  NftRangeProps,
  NftStatusProp,
  Prize,
  ProviderDashboardFormDataProp,
  UploadedFileProps,
  UserRafflesProps,
} from "@/types";
import { fromWei, toWei } from "@/utils/numbersBigNumber";
import {
  FC,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useUserProfileContext } from "./userProfile";
import {
  useWalletAccount,
  useWalletBalance,
  useWalletNetwork,
  useWalletProvider,
  useWalletSigner,
} from "@/utils/wallet";
import { getErc721TokenContract } from "@/components/containers/provider-dashboard/helpers/getErc721NftContract";
import { getErc20TokenContract } from "@/components/containers/provider-dashboard/helpers/getErc20TokenContract";
import { isAddress, zeroAddress } from "viem";
import { ZERO_ADDRESS } from "@/constants";
import {
  getConstraintsApi,
  getProviderDashboardValidChain,
  getTokenTapValidChain,
} from "@/utils/api";
import { createErc721Raffle } from "@/components/containers/provider-dashboard/helpers/createErc721Raffle";
import { createErc20TokenDistribution } from "@/components/containers/provider-dashboard/helpers/createErc20TokenDistribution";
import { approveErc721Token } from "@/components/containers/provider-dashboard/helpers/approveErc721Token";
import { approveErc20Token } from "@/components/containers/provider-dashboard/helpers/approveErc20Token";
import { checkNftsAreValid } from "@/components/containers/provider-dashboard/helpers/checkAreNftsValid";

import { checkSocialMediaValidation } from "@/components/containers/provider-dashboard/helpers/checkSocialMediaValidation";
import Big from "big.js";
import { NullCallback } from "@/utils";
import { isValidContractAddress } from "@/components/containers/provider-dashboard/helpers/isValidContractAddress";
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
  maxNumberOfEntries: null,
  email: "",
  twitter: "",
  discord: "",
  telegram: "",
  creatorUrl: "",
  necessaryInfo: "",
  satisfy: "satisfyAll",
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
  totalAmount: "",
};

const enrollmentDurationsInit: EnrollmentDurationsProps[] = [
  {
    id: 0,
    name: "1 Week",
    selected: false,
    time: null,
    value: 1,
    status: "week",
  },
  {
    id: 1,
    name: "2 Week",
    selected: false,
    time: null,
    value: 2,
    status: "week",
  },
  {
    id: 2,
    name: "1 Month",
    selected: false,
    time: null,
    value: 1,
    status: "month",
  },
  {
    id: 3,
    name: "2 Month",
    selected: false,
    time: null,
    value: 2,
    status: "month",
  },
];

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
export const TokenTapContext = createContext<{
  page: number;
  setPage: (page: number) => void;
  data: ProviderDashboardFormDataProp;
  selectedConstrains: ConstraintProps | null;
  title: any;
  handleChange: (e: any) => void;
  handleSelectTokenOrNft: (e: boolean) => void;
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
  handleBackToConstraintListModal: () => void;
  chainList: Chain[];
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain) => void;
  chainName: string;
  handleSearchChain: (e: any) => void;
  setChainName: (e: string) => void;
  filterChainList: Chain[];
  setSearchPhrase: (e: string) => void;
  handleSelectChain: (chain: Chain) => void;
  canGoStepTwo: () => boolean;
  canGoStepThree: () => void;
  canGoStepFive: () => boolean;
  selectNewOffer: boolean;
  handleSelectNewOffer: (select: boolean) => void;
  insertRequirement: (
    pk: number,
    name: string,
    title: string,
    isNotSatisfy: boolean,
    requirementValues: any
  ) => void;
  requirementList: RequirementProps[];
  deleteRequirement: (id: number) => void;
  updateRequirement: (
    requirement: RequirementProps,
    isNotSatisfy: boolean,
    requirementValues: any
  ) => void;
  handleSelectNativeToken: (e: boolean) => void;
  handleCreateRaffle: () => void;
  isCreateRaffleModalOpen: boolean;
  createRaffleResponse: any | null;
  createRaffleLoading: boolean;
  handleSetCreateRaffleLoading: () => void;
  handleSetDate: (timeStamp: number, label: string) => void;
  handleApproveErc20Token: () => void;
  isErc20Approved: boolean;
  isApprovedAll: boolean;
  approveLoading: boolean;
  constraintsListApi: ConstraintProps[] | undefined;
  handleApproveErc721Token: () => void;
  updateChainList: () => void;
  handleCheckForReason: (raffle: UserRafflesProps) => void;
  handleShowUserDetails: (raffle: UserRafflesProps) => void;
  handleAddNftToData: (nftIds: string[]) => void;
  setUploadedFile: (file: any) => void;
  uploadedFile: UploadedFileProps | null;
  isShowingDetails: boolean;
  handleCheckOwnerOfNfts: (nftIds: string[]) => Promise<boolean>;
  nftStatus: NftStatusProp[];
  handleClearNfts: () => void;
  selectedRaffleForCheckReason: UserRafflesProps | null;
  insufficientBalance: boolean;
  userBalance: string | null;
  socialMediaValidation: {
    creatorUrl: boolean;
    twitter: boolean;
    discord: boolean;
    email: boolean;
    telegram: boolean;
  };
  tokenContractStatus: ContractStatus;
  nftContractStatus: ContractStatus;
  nftRange: NftRangeProps;
  setNftStatus: (e: NftStatusProp[]) => void;
  setNftRange: (e: any) => void;
  numberOfNfts: string;
  setNumberOfNfts: (number: string) => void;
  handleSetEnrollDuration: (id: number) => void;
  enrollmentDurations: EnrollmentDurationsProps[];
  handleWinnersResult: (raffle: UserRafflesProps | null) => void;
  winnersResultRaffle: UserRafflesProps | null;
  endDateState: any;
  setEndDateState: (date: any) => void;
  userRaffle: UserRafflesProps | undefined;
  handleSetClaimPeriodic: (e: boolean) => void;
  claimPeriodic: boolean;
  allChainList: Chain[] | undefined;
}>({
  page: 0,
  setPage: NullCallback,
  data: formInitialData,
  selectedConstrains: null,
  title: {
    ...title,
  },
  handleChange: NullCallback,
  handleSelectTokenOrNft: NullCallback,
  closeRequirementModal: NullCallback,
  closeAddNftIdListModal: NullCallback,
  closeCreateRaffleModal: NullCallback,
  openRequirementModal: NullCallback,
  openAddNftIdListModal: NullCallback,
  openCreteRaffleModal: NullCallback,
  handleSelectConstraint: NullCallback,
  isModalOpen: false,
  selectedConstraintTitle: null,
  handleBackToConstraintListModal: NullCallback,
  chainList: [],
  selectedChain: null,
  setSelectedChain: NullCallback,
  chainName: "",
  handleSearchChain: NullCallback,
  setChainName: NullCallback,
  filterChainList: [],
  setSearchPhrase: NullCallback,
  handleSelectChain: NullCallback,
  canGoStepTwo: () => false,
  canGoStepThree: NullCallback,
  canGoStepFive: () => false,
  openShowPreviewModal: NullCallback,
  closeShowPreviewModal: NullCallback,
  selectNewOffer: false,
  handleSelectNewOffer: NullCallback,
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
  handleSetDate: NullCallback,
  handleApproveErc20Token: NullCallback,
  isErc20Approved: false,
  approveLoading: false,
  constraintsListApi: [] as any,
  isApprovedAll: false,
  handleApproveErc721Token: NullCallback,
  updateChainList: NullCallback,
  handleCheckForReason: NullCallback,
  handleShowUserDetails: NullCallback,
  handleAddNftToData: NullCallback,
  setUploadedFile: NullCallback,
  uploadedFile: { fileName: "", fileContent: null },
  isShowingDetails: false,
  handleCheckOwnerOfNfts: async () => false,
  nftStatus: [],
  handleClearNfts: NullCallback,
  selectedRaffleForCheckReason: null,
  insufficientBalance: false,
  userBalance: null,
  socialMediaValidation: {
    creatorUrl: true,
    twitter: false,
    discord: true,
    email: false,
    telegram: true,
  },
  tokenContractStatus: {
    checking: false,
    isValid: ContractValidationStatus.Empty,
    canDisplayStatus: false,
  },
  nftContractStatus: {
    checking: false,
    isValid: ContractValidationStatus.Empty,
    canDisplayStatus: false,
  },
  setNftStatus: NullCallback,
  nftRange: { from: "", to: "" },
  setNftRange: NullCallback,
  numberOfNfts: "",
  setNumberOfNfts: NullCallback,
  enrollmentDurations: enrollmentDurationsInit,
  handleSetEnrollDuration: NullCallback,
  handleWinnersResult: NullCallback,
  winnersResultRaffle: null,
  endDateState: null,
  setEndDateState: NullCallback,
  userRaffle: {} as any,
  claimPeriodic: false,
  handleSetClaimPeriodic: NullCallback,
  allChainList: [] as any,
});

const TokenTapProvider: FC<
  PropsWithChildren & {
    rafflesInitial?: UserRafflesProps;
    allChains?: Chain[];
    constraintListApi?: ConstraintProps[];
  }
> = ({ children, rafflesInitial, allChains, constraintListApi }) => {
  const [requirementList, setRequirementList] = useState<RequirementProps[]>(
    []
  );

  const [allChainList] = useState<Chain[] | undefined>(allChains);

  const [selectNewOffer, setSelectNewOffer] = useState<boolean>(false);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedChain, setSelectedChain] = useState<any | null>(null);

  const [chainName, setChainName] = useState<string>("");

  const [page, setPage] = useState<number>(0);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isCreateRaffleModalOpen, setIsCreateRaffleModalOpen] =
    useState<boolean>(false);

  const [chainList, setChainList] = useState<Chain[]>([]);

  const [isErc20Approved, setIsErc20Approved] = useState<boolean>(false);

  const [endDateState, setEndDateState] = useState<any>(null);

  const [tokenContractStatus, setTokenContractStatus] =
    useState<ContractStatus>({
      checking: false,
      isValid: ContractValidationStatus.Empty,
      canDisplayStatus: false,
    });

  const [nftContractStatus, setNftContractStatus] = useState<ContractStatus>({
    checking: false,
    isValid: ContractValidationStatus.Empty,
    canDisplayStatus: false,
  });

  const [approveAllowance, setApproveAllowance] = useState<number>(0);

  const [insufficientBalance, setInsufficientBalance] =
    useState<boolean>(false);

  const [createRaffleResponse, setCreteRaffleResponse] = useState<any | null>(
    null
  );

  const [createRaffleLoading, setCreateRaffleLoading] =
    useState<boolean>(false);

  const [isApprovedAll, setIsApprovedAll] = useState<boolean>(false);

  const [selectedConstrains, setSelectedConstrains] =
    useState<ConstraintProps | null>(null);

  const [selectedConstraintTitle, setSelectedConstraintTitle] = useState<
    string | null
  >(null);

  const [userRaffle, setUserRaffle] = useState<UserRafflesProps | undefined>(
    rafflesInitial
  );

  const [approveLoading, setApproveLoading] = useState<boolean>(false);

  const [selectedRaffleForCheckReason, setSelectedRaffleForCheckReason] =
    useState<UserRafflesProps | null>(null);

  const [winnersResultRaffle, setWinnersResultRaffle] =
    useState<UserRafflesProps | null>(null);

  const [uploadedFile, setUploadedFile] = useState<UploadedFileProps | null>(
    null
  );
  const [isShowingDetails, setIsShowingDetails] = useState<boolean>(false);
  const [nftStatus, setNftStatus] = useState<NftStatusProp[]>([]);

  const [nftRange, setNftRange] = useState({ from: "", to: "" });

  const [numberOfNfts, setNumberOfNfts] = useState<string>("");

  const [claimPeriodic, setClaimPeriodic] = useState(false);

  const [data, setData] =
    useState<ProviderDashboardFormDataProp>(formInitialData);

  const [socialMediaValidation, setSocialMediaValidation] = useState({
    creatorUrl: true,
    twitter: true,
    discord: true,
    email: true,
    telegram: true,
  });

  const [enrollmentDurations, setEnrollmentDurations] = useState(
    enrollmentDurationsInit
  );

  const handleSetEnrollDuration = (id: number) => {
    setEnrollmentDurations(
      enrollmentDurations.map((item) =>
        item.id == id
          ? { ...item, selected: true }
          : { ...item, selected: false }
      )
    );
  };

  const [constraintsListApi, setConstraintsListApi] = useState<
    ConstraintProps[] | undefined
  >(constraintListApi);

  const { userToken } = useUserProfileContext();
  const signer = useWalletSigner();
  const provider = useWalletProvider();
  const { address } = useWalletAccount();
  const { chain } = useWalletNetwork();

  const { data: userBalance } = useWalletBalance({
    address,
    chainId: chain?.id,
  });

  const filterChainList = useMemo(() => {
    return chainList.filter((chain) =>
      chain.chainName
        .toLocaleLowerCase()
        .includes(searchPhrase.toLocaleLowerCase())
    );
  }, [chainList, searchPhrase]);

  const deleteRequirement = (id: number) => {
    setRequirementList((prev) => prev.filter((item) => item.pk != id));
  };

  const handleSelectNewOffer = (select: boolean) => {
    setSelectNewOffer(select);
  };

  const updateRequirement = (
    requirement: RequirementProps,
    isNotSatisfy: boolean,
    requirementValues: any
  ) => {
    if (!requirement) return;
    const newItem = requirementList.map((item) => {
      if (item.pk == requirement.pk) {
        return { ...requirement, isNotSatisfy, params: requirementValues };
      }
      return item;
    });

    setRequirementList(newItem);
  };

  const checkContractInfo = useCallback(async () => {
    if (!data.isNft && provider && address) {
      await getErc20TokenContract(
        data,
        address,
        provider,
        setData,
        setIsErc20Approved,
        setTokenContractStatus,
        setApproveAllowance
      );
    }

    if (data.isNft && provider && address) {
      getErc721TokenContract(
        data,
        address,
        provider,
        setData,
        setIsApprovedAll,
        setNftContractStatus
      );
    }
  }, [address, data, provider]);

  const checkContractAddress = useCallback(
    async (contractAddress: string) => {
      const step1Check = isAddress(contractAddress);
      const step2Check = await isValidContractAddress(
        contractAddress,
        provider
      );
      const isValid = !!(step1Check && step2Check);
      if (isValid) {
        checkContractInfo();
      } else {
        data.isNft
          ? setNftContractStatus((prev) => ({
              ...prev,
              isValid: ContractValidationStatus.NotValid,
              checking: false,
            }))
          : setTokenContractStatus((prev) => ({
              ...prev,
              isValid: ContractValidationStatus.NotValid,
              checking: false,
            }));
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
      nftContractAddress,
      tokenContractAddress,
      nftTokenIds,
      winnersCount,
      totalAmount,
    } = data;

    const checkToken = () => {
      if (data.isNft) return true;
      const isValid =
        !insufficientBalance &&
        tokenContractStatus.isValid === ContractValidationStatus.Valid &&
        tokenContractAddress &&
        Number(winnersCount) <= 500 &&
        Number(totalAmount) > 0;
      return isValid;
    };

    const checkNft = () => {
      if (!data.isNft) return true;
      const isValid =
        nftContractStatus.isValid === ContractValidationStatus.Valid &&
        Number(numberOfNfts) === data.nftTokenIds.length &&
        Number(numberOfNfts) <= 500 &&
        nftTokenIds.length >= 1;
      return !!isValid;
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
      Date.now() + 7 * 24 * 60 * 59 * 1000
    );
    const sevenDaysLaterAfterNowTimeStamp = Math.round(
      sevenDaysLaterAfterNow.getTime() / 1000
    );

    // if (startTimeStamp && startTimeStamp < sevenDaysLaterAfterNowTimeStamp) {
    //   errorObject.startDateStatus = false;
    //   errorObject.statDateStatusMessage = errorMessages.startTimeDuration;
    // }

    if (!endTimeStamp) {
      errorObject.endDateStatus = false;
      errorObject.endDateStatusMessage = errorMessages.required;
    }

    // if (
    //   endTimeStamp &&
    //   startTimeStamp &&
    //   (endTimeStamp <= startTimeStamp ||
    //     endTimeStamp - startTimeStamp < 60 * 60)
    // ) {
    //   errorObject.endDateStatus = false;
    //   errorObject.endDateStatusMessage = errorMessages.endLessThanStart;
    // }

    if (data.maxNumberOfEntries && Number(data.maxNumberOfEntries) <= 0) {
      errorObject.maximumLimitationStatus = false;
      errorObject.maximumLimitationMessage = errorMessages.required;
    }

    if (
      data.winnersCount &&
      Math.floor(data.winnersCount) != data.winnersCount
    ) {
      errorObject.numberOfWinnersStatus = false;
      errorObject.numberOfWinnersMessage = errorMessages.invalidInput;
    }

    if (data.winnersCount && data.winnersCount <= 0) {
      errorObject.numberOfWinnersStatus = false;
      errorObject.numberOfWinnersMessage = errorMessages.invalidInput;
    }

    if (!data.winnersCount) {
      errorObject.numberOfWinnersStatus = false;
      errorObject.numberOfWinnersMessage = errorMessages.required;
    }

    if (Number(data.maxNumberOfEntries) > 0) {
      if (
        (data.isNft &&
          Number(data.maxNumberOfEntries) <= data.nftTokenIds.length) ||
        (!data.isNft &&
          Number(data.maxNumberOfEntries) <= Number(data.winnersCount))
      ) {
        errorObject.maximumLimitationStatus = false;
        errorObject.maximumLimitationMessage = (
          <p>
            The maximum number of enrollees cannot be less than or equal to the
            number of winners.
            <br />
            Number of winners:{" "}
            {!data.isNft ? data.winnersCount : data.nftTokenIds.length}
          </p>
        );
      }
    }

    return errorObject;
  };

  const canGoStepFive = () => {
    if (isShowingDetails) return true;
    const { email, twitter, creatorUrl, discord, telegram } = data;
    if (!email) {
      return false;
    }
    const {
      isUrlVerified,
      isTwitterVerified,
      isDiscordVerified,
      isEmailVerified,
      isTelegramVerified,
    } = checkSocialMediaValidation(
      creatorUrl,
      twitter,
      discord,
      email,
      telegram
    );
    setSocialMediaValidation({
      creatorUrl: isUrlVerified,
      twitter: isTwitterVerified,
      discord: isDiscordVerified,
      email: isEmailVerified,
      telegram: isTelegramVerified,
    });
    return !!(
      isUrlVerified &&
      isTwitterVerified &&
      isDiscordVerified &&
      isEmailVerified &&
      isTelegramVerified
    );
  };

  //check NFT contract address
  useEffect(() => {
    if (
      isShowingDetails ||
      !data.isNft ||
      data.nftContractAddress === zeroAddress
    )
      return;
    if (!data.nftContractAddress) {
      setIsApprovedAll(false);
      setNftContractStatus((prev) => ({
        ...prev,
        isValid: ContractValidationStatus.Empty,
        checking: false,
      }));
      setInsufficientBalance(false);
      return;
    } else {
      setNftContractStatus((prev) => ({
        ...prev,
        isValid: ContractValidationStatus.Empty,
        checking: true,
      }));
      checkContractAddress(data.nftContractAddress);
    }
  }, [data.isNft, data.nftContractAddress, isShowingDetails]);

  //check token contract address
  useEffect(() => {
    if (isShowingDetails || data.isNft) return;
    if (!data.tokenContractAddress) {
      setIsErc20Approved(false);
      setTokenContractStatus((prev) => ({
        ...prev,
        isValid: ContractValidationStatus.Empty,
        checking: false,
      }));
      setInsufficientBalance(false);
      return;
    }
    if (data.tokenContractAddress == zeroAddress) {
      setIsErc20Approved(true);
      setTokenContractStatus((prev) => ({
        ...prev,
        isValid: ContractValidationStatus.Valid,
        checking: false,
      }));
    } else {
      setTokenContractStatus((prev) => ({
        ...prev,
        isValid: ContractValidationStatus.Empty,
        checking: true,
      }));
      checkContractAddress(data.tokenContractAddress);
    }
  }, [data.isNft, data.tokenContractAddress, isShowingDetails]);

  // set Insufficient balance
  useEffect(() => {
    if (
      isShowingDetails ||
      !data.tokenContractAddress ||
      tokenContractStatus.isValid === ContractValidationStatus.NotValid
    )
      return;
    if (
      data.totalAmount &&
      data.tokenContractAddress &&
      tokenContractStatus.isValid === ContractValidationStatus.Valid
    ) {
      setInsufficientBalance(
        data.isNativeToken
          ? Number(data.totalAmount) >= Number(userBalance?.formatted)
          : Number(data.totalAmount) >= Number(data.userTokenBalance!)
      );
    }
  }, [
    data.totalAmount,
    data.tokenContractAddress,
    data.userTokenBalance,
    userBalance,
    isShowingDetails,
    data.isNativeToken,
    tokenContractStatus.isValid,
  ]);

  //set total amount
  useEffect(() => {
    if (data.tokenAmount && data.winnersCount) {
      const totalAmount = Number.isSafeInteger(Number(data.tokenAmount))
        ? Number(data.tokenAmount) * Number(data.winnersCount)
        : fromWei(toWei(data.tokenAmount) * Number(data.winnersCount));
      setData((prev) => ({
        ...prev,
        totalAmount: new Big(totalAmount).toFixed(),
      }));
      setIsErc20Approved(approveAllowance >= Number(totalAmount));
    } else {
      setData((prev) => ({
        ...prev,
        totalAmount: new Big(0).toFixed(),
      }));
    }
  }, [data.tokenAmount, data.winnersCount]);

  const handleSelectNativeToken = (e: boolean) => {
    if (!data.selectedChain || isShowingDetails || !address) return;
    setData((prevData) => ({
      ...prevData,
      isNativeToken: !e,
      tokenContractAddress: !e ? ZERO_ADDRESS : "",
      decimal: !e ? 18 : null,
    }));
  };

  const handleSelectTokenOrNft = (e: boolean) => {
    if (!data.selectedChain || isShowingDetails) return;
    setData((prevData) => ({
      ...prevData,
      ["isNft"]: e,
    }));
  };

  const updateChainList = useCallback(async () => {
    try {
      const newChainList = await getTokenTapValidChain();
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

  const handleChange = (e: {
    target: { type: any; name: any; checked: any; value: any };
  }) => {
    if (isShowingDetails) return;
    const type = e.target.type;
    const name = e.target.name;
    if (page == 3) {
      setSocialMediaValidation({
        creatorUrl: true,
        twitter: true,
        discord: true,
        email: true,
        telegram: true,
      });
    }
    let value = type == "checkbox" ? e.target.checked : e.target.value;
    if (name === "provider" && value.length > 30) return;
    if (name === "description" && value.length > 100) return;
    if (name === "winnersCount" || name === "maxNumberOfEntries") {
      value = value.replace(/[^0-9]/g, "");
    }
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectConstraint = (constraint: ConstraintProps) => {
    setSelectedConstraintTitle(constraint.title);
    setSelectedConstrains(constraint);
  };

  const handleBackToConstraintListModal = () => {
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
    !isShowingDetails &&
      data.nftContractAddress &&
      nftContractStatus.isValid === ContractValidationStatus.Valid &&
      Number(numberOfNfts) <= 500 &&
      setIsModalOpen(true);
  };

  const closeShowPreviewModal = () => {
    setIsModalOpen(false);
  };

  const openShowPreviewModal = () => {
    setIsModalOpen(true);
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
      createErc20TokenDistribution(
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
    pk: number,
    name: string,
    title: string,
    isNotSatisfy: boolean,
    requirementValues: any
  ) => {
    setRequirementList([
      ...requirementList,
      {
        pk: pk,
        params: requirementValues,
        name: name,
        title: title,
        isNotSatisfy: isNotSatisfy,
        isReversed: isNotSatisfy,
      },
    ]);
  };

  const handleCheckForReason = (raffle: UserRafflesProps) => {
    setPage(5);
    setSelectedRaffleForCheckReason(raffle);
  };

  const handleShowUserDetails = async (raffle: UserRafflesProps) => {
    setChainName(raffle.chain.chainName);
    setData((prev) => ({
      ...prev,
      provider: raffle.creatorName,
      selectedChain: raffle.chain,
      description: raffle.description,
      isNft: raffle.isPrizeNft,
      isNativeToken: raffle.prizeAsset == ZERO_ADDRESS,
      tokenAmount: new Big(
        fromWei(raffle.prizeAmount, raffle.decimals)
      ).toFixed(),
      tokenContractAddress: raffle.isPrizeNft ? "" : raffle.prizeAsset,
      nftContractAddress: raffle.isPrizeNft ? raffle.prizeAsset : "",
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
      tokenSymbol: raffle.prizeSymbol,
      nftName: raffle.prizeName,
    }));
    setIsShowingDetails(true);
    setSelectNewOffer(true);
    setNumberOfNfts(
      raffle.nftIds ? raffle.nftIds.split(",").length.toString() : ""
    );
    setConstraintsListApi(await getConstraintsApi());
    setRequirementList(
      raffle.constraints.map((constraint) =>
        constraint.isReversed
          ? { ...constraint, isNotSatisfy: true }
          : { ...constraint, isNotSatisfy: false }
      )
    );
    handleSetEnrollDuration(-1);
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
    setNftRange({ from: "", to: "" });
    setData((prev) => ({ ...prev, nftTokenIds: [] }));
  };

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
    if (isShowingDetails) return;
    let newEndTimeStamp: any;

    if (data.startTimeStamp) {
      let selectedDuration: EnrollmentDurationsProps =
        enrollmentDurations.filter((item) => item.selected == true)[0];
      if (!selectedDuration) return;
      if (selectedDuration.status == "week") {
        newEndTimeStamp =
          data.startTimeStamp + selectedDuration.value * 7 * 24 * 60 * 60;
      }

      if (selectedDuration.status == "month") {
        const currentDate = new Date(data.startTimeStamp * 1000);

        newEndTimeStamp = Math.round(
          currentDate.setMonth(
            Number(currentDate.getMonth()) + selectedDuration.value
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
  }, [enrollmentDurations, data.startTimeStamp]);

  return (
    <TokenTapContext.Provider
      value={{
        page,
        setPage,
        data,
        title,
        handleChange,
        handleSelectTokenOrNft,
        openRequirementModal,
        closeRequirementModal,
        openAddNftIdListModal,
        closeAddNftIdListModal,
        isModalOpen,
        selectedConstrains,
        handleSelectConstraint,
        selectedConstraintTitle,
        handleBackToConstraintListModal,
        chainList,
        selectedChain,
        setSelectedChain,
        chainName,
        handleSearchChain,
        setChainName,
        filterChainList,
        setSearchPhrase,
        handleSelectChain,
        canGoStepTwo,
        canGoStepThree,
        canGoStepFive,
        closeShowPreviewModal,
        openShowPreviewModal,
        selectNewOffer,
        handleSelectNewOffer,
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
        handleSetDate,
        handleApproveErc20Token,
        isErc20Approved,
        approveLoading,
        constraintsListApi,
        isApprovedAll,
        handleApproveErc721Token,
        updateChainList,
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
        socialMediaValidation,
        insufficientBalance,
        userBalance: userBalance?.formatted.toString() ?? null,
        tokenContractStatus,
        nftContractStatus,
        setNftStatus,
        nftRange,
        setNftRange,
        numberOfNfts,
        setNumberOfNfts,
        enrollmentDurations,
        handleSetEnrollDuration,
        winnersResultRaffle,
        handleWinnersResult: setWinnersResultRaffle,
        endDateState,
        setEndDateState,
        userRaffle,
        claimPeriodic,
        handleSetClaimPeriodic: setClaimPeriodic,
        allChainList,
      }}
    >
      {children}
    </TokenTapContext.Provider>
  );
};

export const useTokenTapFromContext = () => {
  return useContext(TokenTapContext);
};

export default TokenTapProvider;
