"use client";

import { ClaimedToken, PK, Token, TokenClaimPayload } from "@/types";
import { EmptyCallback, NullCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useUserProfileContext } from "./userProfile";
import {
  claimTokenAPI,
  getClaimedTokensListAPI,
  getTokensListAPI,
  tokenClaimSignatureApi,
  updateClaimFinished,
} from "@/utils/api/tokentap";
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh";
import { useWalletAccount, useWalletProvider } from "@/utils/wallet";
import { unitapEvmTokenTapAbi } from "@/types/abis/contracts";
import { useGlobalContext } from "./globalProvider";
import {
  FAST_INTERVAL,
  BASE_REFRESH_INTERVAL,
  contractAddresses,
  tokenTapContractAddressList,
} from "@/constants";
import { Address, TransactionExecutionError } from "viem";

export const TokenTapContext = createContext<{
  tokensList: Token[];
  tokensListLoading: boolean;
  claimTokenSignatureLoading: boolean;
  claimedTokensList: ClaimedToken[];
  handleClaimToken: () => void;
  selectedTokenForClaim: Token | null;
  setSelectedTokenForClaim: (token: Token | null) => void;
  claimTokenLoading: boolean;
  openClaimModal: (token: Token) => void;
  closeClaimModal: () => void;
  claimToken: (token: Token, body?: any) => void;
  claimError?: string;
  claimTokenResponse: any | null;
  searchPhrase: string;
  changeSearchPhrase: ((newSearchPhrase: string) => void) | null;
  tokenListSearchResult: Token[];
  claimingTokenPk: PK | null;
  currentRequirementIndex: number;
  setCurrentRequirementIndex: (value: number) => void;
  method: string | null;
  setMethod: (method: string | null) => void;
}>({
  claimError: undefined,
  tokensList: [],
  tokensListLoading: false,
  claimTokenSignatureLoading: false,
  claimedTokensList: [],
  handleClaimToken: EmptyCallback,
  selectedTokenForClaim: null,
  setSelectedTokenForClaim: EmptyCallback,
  claimTokenLoading: false,
  openClaimModal: EmptyCallback,
  closeClaimModal: EmptyCallback,
  claimToken: EmptyCallback,
  claimTokenResponse: null,
  searchPhrase: "",
  changeSearchPhrase: null,
  tokenListSearchResult: [],
  claimingTokenPk: null,
  setCurrentRequirementIndex: NullCallback,
  currentRequirementIndex: 0,
  method: null,
  setMethod: NullCallback,
});

export const useTokenTapContext = () => useContext(TokenTapContext);

const TokenTapProvider: FC<{ tokens: Token[] } & PropsWithChildren> = ({
  children,
  tokens,
}) => {
  const [tokensList, setTokensList] = useState<Token[]>(tokens);
  const [claimTokenResponse, setClaimTokenResponse] = useState<any>();
  const [claimTokenSignatureLoading, setClaimTokenSignatureLoading] =
    useState<boolean>(false);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [claimedTokensList, setClaimedTokensList] = useState<ClaimedToken[]>(
    [],
  );
  const [method, setMethod] = useState<string | null>(null);

  const [selectedTokenForClaim, setSelectedTokenForClaim] =
    useState<Token | null>(null);
  const [claimingTokenPk, setClaimingTokenPk] = useState<PK | null>(null);

  const tokenListSearchResult = useMemo(() => {
    const searchPhraseLowerCase = searchPhrase.toLowerCase();
    return tokensList.filter((token) =>
      token.name.toLowerCase().includes(searchPhraseLowerCase),
    );
  }, [searchPhrase, tokensList]);

  const { address, isConnected, chainId } = useWalletAccount();

  const { setIsWalletPromptOpen } = useGlobalContext();
  const [currentRequirementIndex, setCurrentRequirementIndex] =
    useState<number>(0);

  const [loading, setLoading] = useState(false);
  const provider = useWalletProvider();

  const { writeContractAsync, isPending, reset, data, error } =
    useWriteContract({});

  const { userToken } = useUserProfileContext();

  const getTokensList = useCallback(async () => {
    try {
      const response = await getTokensListAPI();
      setTokensList(response);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const getClaimedTokensList = useCallback(async () => {
    if (!userToken) return;
    try {
      const response = await getClaimedTokensListAPI(userToken);
      setClaimedTokensList(response);
    } catch (e) {
      console.log(e);
    }
  }, [userToken]);

  const claimToken = useCallback(
    async (token: Token, body?: any) => {
      if (!userToken || !address) return;
      reset();
      // refetch()

      setClaimTokenSignatureLoading(true);

      let response;

      try {
        response = await claimTokenAPI(userToken, token.id, address, body);
      } finally {
        setClaimTokenSignatureLoading(false);
      }

      return response;
    },
    [
      userToken,
      reset,
      // refetch,
      address,
      setClaimTokenSignatureLoading,
    ],
  );

  const claimWithWallet = useCallback(
    async (claimTokenPayload?: TokenClaimPayload, claimId?: number) => {
      if (!userToken || !selectedTokenForClaim || !provider) return;

      const contractAddress =
        contractAddresses.tokenTap[selectedTokenForClaim.chain.chainId].erc20;

      if (!contractAddress) return;

      const chainId = Number(selectedTokenForClaim.chain.chainId);
      setLoading(true);
      try {
        const res = await claimToken(selectedTokenForClaim);

        const txPayload = res?.payload ?? claimTokenPayload;

        if (!txPayload || !address || !chainId || !selectedTokenForClaim) {
          return;
        }

        if (!claimId) claimId = res!.id;

        const shieldRes = await tokenClaimSignatureApi(
          claimId,
          res!.tokenDistribution.id,
          contractAddress,
        );

        if (!shieldRes.success) {
          throw new Error("Error receiving shield from shield api");
        }

        const contractArgs = [
          txPayload.userWalletAddress,
          shieldRes.result.data.result.distributionId,
          shieldRes.result.data.result.claimId,
          shieldRes.result.reqId,
          {
            signature: shieldRes.result.signatures[0].signature as any,
            nonce: shieldRes.result.data.init.nonceAddress,
            owner: shieldRes.result.signatures[0].owner,
          },
          shieldRes.result.shieldSignature,
        ] as const;

        const contractGas = await provider.estimateContractGas({
          abi: unitapEvmTokenTapAbi,
          account: address,
          address: contractAddress,
          functionName: "claimToken",
          args: contractArgs,
        });

        const simulateRes = await provider.simulateContract({
          args: contractArgs,
          abi: unitapEvmTokenTapAbi,
          account: address,
          address:
            contractAddresses.tokenTap[selectedTokenForClaim.chain.chainId]
              .erc20,
          functionName: "claimToken",
          gas: contractGas,
        });

        const claimRes = await writeContractAsync?.({
          args: contractArgs,
          abi: unitapEvmTokenTapAbi,
          account: address,
          address:
            contractAddresses.tokenTap[selectedTokenForClaim.chain.chainId]
              .erc20,
          functionName: "claimToken",
          gas: contractGas,
        });

        if (claimRes) {
          const res = await provider.waitForTransactionReceipt({
            hash: claimRes,
            confirmations: 1,
          });

          setClaimTokenResponse({
            success: true,
            state: "Done",
            txHash: res.transactionHash,
            message: "Token claimed successfully.",
          });

          await updateClaimFinished(userToken, claimId, res.transactionHash);
        }
      } catch (e: any) {
        const error: TransactionExecutionError = e;
        setClaimTokenResponse({
          success: false,
          state: "Retry",
          message: error.shortMessage,
        });
        console.log(error);
      } finally {
        setClaimingTokenPk(null);
        setLoading(false);
      }
    },
    [
      address,
      claimToken,
      provider,
      selectedTokenForClaim,
      userToken,
      writeContractAsync,
    ],
  );

  const handleClaimToken = useCallback(async () => {
    if (!selectedTokenForClaim || isPending) return;

    const relatedClaimedToken = claimedTokensList.find(
      (claimedToken) =>
        claimedToken.tokenDistribution.id === selectedTokenForClaim.id,
    );

    claimWithWallet(relatedClaimedToken?.payload, relatedClaimedToken?.id);
  }, [selectedTokenForClaim, claimedTokensList, isPending, claimWithWallet]);

  const openClaimModal = useCallback(
    (token: Token) => {
      if (!isConnected) {
        setIsWalletPromptOpen(true);
        return;
      }
      setMethod("requirements");
      setClaimTokenResponse(null);
      setSelectedTokenForClaim(token);
    },
    [isConnected, setIsWalletPromptOpen],
  );

  const closeClaimModal = useCallback(() => {
    setClaimTokenResponse(null);
    setSelectedTokenForClaim(null);
  }, []);

  useRefreshWithInitial(getClaimedTokensList, BASE_REFRESH_INTERVAL, [
    userToken,
    getClaimedTokensList,
  ]);

  useRefreshWithInitial(getTokensList, BASE_REFRESH_INTERVAL, [getTokensList]);

  return (
    <TokenTapContext.Provider
      value={{
        claimError: error?.message,
        tokensList,
        tokenListSearchResult,
        claimTokenSignatureLoading,
        claimedTokensList,
        handleClaimToken,
        selectedTokenForClaim,
        setSelectedTokenForClaim,
        claimTokenLoading: loading,
        openClaimModal,
        closeClaimModal,
        claimToken,
        claimTokenResponse,
        searchPhrase,
        changeSearchPhrase: setSearchPhrase,
        claimingTokenPk,
        tokensListLoading: false,
        setCurrentRequirementIndex,
        currentRequirementIndex: currentRequirementIndex,
        method,
        setMethod,
      }}
    >
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;
