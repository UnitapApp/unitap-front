"use client";

import { ClaimedToken, PK, Token, TokenClaimPayload } from "@/types";
import { EmptyCallback } from "@/utils";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useContractWrite } from "wagmi";
import { useUserProfileContext } from "./userProfile";
import {
  claimTokenAPI,
  getClaimedTokensListAPI,
  getTokensListAPI,
  updateClaimFinished,
} from "@/utils/api/token-tap";
import { useFastRefresh, useRefreshWithInitial } from "@/utils/hooks/refresh";
import { useWalletAccount, useWalletProvider } from "@/utils/wallet";
import { unitapEvmTokenTapABI } from "@/types/abis/contracts";
import { waitForTransaction } from "wagmi/actions";
import { useGlobalContext } from "./globalProvider";
import { FAST_INTERVAL } from "@/constants";
import { TransactionExecutionError } from "viem";

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
    []
  );
  const [selectedTokenForClaim, setSelectedTokenForClaim] =
    useState<Token | null>(null);
  const [claimingTokenPk, setClaimingTokenPk] = useState<PK | null>(null);

  const tokenListSearchResult = useMemo(() => {
    const searchPhraseLowerCase = searchPhrase.toLowerCase();
    return tokensList.filter((token) =>
      token.name.toLowerCase().includes(searchPhraseLowerCase)
    );
  }, [searchPhrase, tokensList]);

  const { address, isConnected } = useWalletAccount();

  const { setIsWalletPromptOpen } = useGlobalContext();

  // const { config, refetch } = usePrepareContractWrite({
  // abi: unitapEvmTokenTapABI,
  // account: selectedTokenForClaim?.chain.tokentapContractAddress as any,
  // address,
  // functionName: "claimToken",
  // })
  const [loading, setLoading] = useState(false);
  const provider = useWalletProvider();

  const { write, writeAsync, isLoading, reset, data, error } = useContractWrite(
    {
      abi: unitapEvmTokenTapABI,
      account: address,
      address: selectedTokenForClaim?.chain.tokentapContractAddress as any,
      functionName: "claimToken",
    }
  );

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
    ]
  );

  const claimWithWallet = async (
    claimTokenPayload?: TokenClaimPayload,
    claimId?: number
  ) => {
    if (!userToken) return;

    const chainId = Number(selectedTokenForClaim!.chain.chainId);
    setLoading(true);
    try {
      const res = await claimToken(selectedTokenForClaim!, undefined);

      const txPayload = res?.payload ?? claimTokenPayload;

      if (!txPayload || !address || !chainId) {
        return;
      }

      if (!claimId) claimId = res!.id;

      const contractGas = await provider.estimateContractGas({
        abi: unitapEvmTokenTapABI,
        account: address,
        address: selectedTokenForClaim?.chain.tokentapContractAddress as any,
        functionName: "claimToken",
        args: [
          txPayload.user,
          txPayload.token,
          BigInt(txPayload.amount),
          txPayload.nonce,
          txPayload.signature,
        ],
      });

      const claimRes = await writeAsync?.({
        args: [
          txPayload.user,
          txPayload.token,
          BigInt(txPayload.amount),
          txPayload.nonce,
          txPayload.signature,
        ],
        value: 0n,
        gas: contractGas,
      });

      if (claimRes) {
        await waitForTransaction({
          hash: claimRes.hash,
          confirmations: 1,
          chainId,
        }).then(async (res) => {
          setClaimTokenResponse({
            success: true,
            state: "Done",
            txHash: res.transactionHash,
            message: "Token claimed successfully.",
          });
          await updateClaimFinished(userToken, claimId!, res.transactionHash);
        });
      }
    } catch (e: any) {
      const error: TransactionExecutionError = e;
      setClaimTokenResponse({
        success: false,
        state: "Retry",
        message: error.shortMessage,
      });
      console.log(error.cause, error.details, error.shortMessage);
    } finally {
      setClaimingTokenPk(null);
      setLoading(false);
    }
  };

  const handleClaimToken = useCallback(async () => {
    if (!selectedTokenForClaim || isLoading) return;

    const relatedClaimedToken = claimedTokensList.find(
      (claimedToken) =>
        claimedToken.tokenDistribution.id === selectedTokenForClaim.id
    );

    claimWithWallet(relatedClaimedToken?.payload, relatedClaimedToken?.id);
  }, [selectedTokenForClaim, claimedTokensList, isLoading, claimWithWallet]);

  const openClaimModal = useCallback(
    (token: Token) => {
      if (!isConnected) {
        setIsWalletPromptOpen(true);
        return;
      }

      setClaimTokenResponse(null);
      setSelectedTokenForClaim(token);
    },
    [setSelectedTokenForClaim, setClaimTokenResponse, isConnected]
  );

  const closeClaimModal = useCallback(() => {
    setClaimTokenResponse(null);
    setSelectedTokenForClaim(null);
  }, []);

  useRefreshWithInitial(getClaimedTokensList, FAST_INTERVAL, [
    userToken,
    getClaimedTokensList,
  ]);

  useFastRefresh(getTokensList, [getTokensList]);

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
      }}
    >
      {children}
    </TokenTapContext.Provider>
  );
};

export default TokenTapProvider;
