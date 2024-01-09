"use client";

import { LineaRaffleEntry, Prize, UserEntryInRaffle } from "@/types";
import { NullCallback } from "@/utils";
import {
  getEnrollmentApi,
  getMuonApi,
  getRafflesListAPI,
  updateClaimPrizeFinished,
  updateEnrolledFinished,
} from "@/utils/api";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useUserProfileContext } from "./userProfile";
import { useRefreshWithInitial } from "@/utils/hooks/refresh";
import { FAST_INTERVAL } from "@/constants";
import { Address, useContractWrite } from "wagmi";
import { prizeTap721ABI, prizeTapABI } from "@/types/abis/contracts";
import { useWalletAccount } from "@/utils/wallet";
import { waitForTransaction } from "wagmi/actions";
import { useGlobalContext } from "./globalProvider";

export const PrizeTapContext = createContext<{
  rafflesList: Prize[];
  claimOrEnrollSignatureLoading: boolean;
  handleClaimPrize: () => void;
  handleEnroll: () => void;
  selectedRaffleForEnroll: Prize | null;
  setSelectedRaffleForEnroll: (raffle: Prize | null) => void;
  claimOrEnrollLoading: boolean;
  openEnrollModal: (raffle: Prize, method: string | null) => void;
  closeEnrollModal: () => void;
  claimError: string | null;
  claimOrEnrollWalletResponse: any | null;
  method: string | null;
  setMethod: (method: string | null) => void;
  isLineaWinnersOpen: boolean;
  setIsLineaWinnersOpen: (arg: boolean) => void;
  lineaEnrolledUsers: LineaRaffleEntry[];
  setLineaEnrolledUsers: (arg: LineaRaffleEntry[]) => void;
  isLineaCheckEnrolledModalOpen: boolean;
  setIsLineaCheckEnrolledModalOpen: (arg: boolean) => void;
}>({
  claimError: null,
  rafflesList: [],
  claimOrEnrollSignatureLoading: false,
  handleClaimPrize: NullCallback,
  handleEnroll: NullCallback,
  selectedRaffleForEnroll: null,
  setSelectedRaffleForEnroll: NullCallback,
  claimOrEnrollLoading: false,
  openEnrollModal: NullCallback,
  closeEnrollModal: NullCallback,
  claimOrEnrollWalletResponse: null,
  method: null,
  setMethod: NullCallback,
  setIsLineaWinnersOpen: NullCallback,
  isLineaWinnersOpen: false,
  lineaEnrolledUsers: [],
  setLineaEnrolledUsers: NullCallback,
  isLineaCheckEnrolledModalOpen: false,
  setIsLineaCheckEnrolledModalOpen: NullCallback,
});

export const usePrizeTapContext = () => useContext(PrizeTapContext);

const PrizeTapProvider: FC<PropsWithChildren & { raffles: Prize[] }> = ({
  children,
  raffles,
}) => {
  const [rafflesList, setRafflesList] = useState<Prize[]>(raffles);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimOrEnrollLoading, setClaimOrEnrollLoading] =
    useState<boolean>(false);
  const [isLineaWinnersOpen, setIsLineaWinnersOpen] = useState(false);
  const [lineaEnrolledUsers, setLineaEnrolledUsers] = useState<
    LineaRaffleEntry[]
  >([]);
  const [isLineaCheckEnrolledModalOpen, setIsLineaCheckEnrolledModalOpen] =
    useState(false);
  const [claimOrEnrollSignatureLoading, setClaimOrEnrollSignatureLoading] =
    useState(false);
  const [selectedRaffleForEnroll, setSelectedRaffleForEnroll] =
    useState<Prize | null>(null);
  const [claimOrEnrollWalletResponse, setClaimOrEnrollWalletResponse] =
    useState<any | null>(null);
  const [method, setMethod] = useState<string | null>(null);

  const { userToken } = useUserProfileContext();
  const { setIsWalletPromptOpen } = useGlobalContext();

  const { isConnected, address } = useWalletAccount();

  const { writeAsync } = useContractWrite({
    account: address,
    functionName: method == "Claim" ? "claimPrize" : "participateInRaffle",
    chainId: Number(selectedRaffleForEnroll?.chain.chainId),
    abi: prizeTapABI,
    address: selectedRaffleForEnroll?.isPrizeNft
      ? "0xDB7bA3A3cbEa269b993250776aB5B275a5F004a0"
      : "0x57b2BA844fD37F20E9358ABaa6995caA4fCC9994",
  });

  const getRafflesList = useCallback(async () => {
    try {
      const response = await getRafflesListAPI(userToken ?? undefined);
      setRafflesList(response);
    } catch (e: any) {
      setClaimError(e.response?.data.message);
      console.log(e);
    }
  }, [userToken]);

  const getSignature = useCallback(async () => {
    if (
      !selectedRaffleForEnroll ||
      selectedRaffleForEnroll.isExpired ||
      !userToken ||
      !address
    )
      return;

    if (method === "Claim") {
      return {
        result: {
          data: { init: { nonceAddress: "1" } },
          reqId: "1",
          signatures: [{ owner: "1", signature: "1" }],
          shieldSignature: "1",
        },
        multiplier: undefined,
      };
    }

    setClaimOrEnrollSignatureLoading(true);

    let raffleEntryId, userEntry: UserEntryInRaffle | undefined;

    if (!selectedRaffleForEnroll?.userEntry) {
      const enrollInApi = await getEnrollmentApi(
        userToken,
        selectedRaffleForEnroll.pk,
        address
      );
      setSelectedRaffleForEnroll({
        ...selectedRaffleForEnroll,
        userEntry: enrollInApi.signature,
      });
      userEntry = enrollInApi.signature;
      raffleEntryId = enrollInApi.signature.pk;
    } else {
      raffleEntryId = selectedRaffleForEnroll?.userEntry.pk;
      userEntry = selectedRaffleForEnroll.userEntry;
    }

    let response;

    try {
      response = await getMuonApi(raffleEntryId);
    } catch (e: any) {
      setClaimError(e.response?.data.message);
    } finally {
      setClaimOrEnrollSignatureLoading(false);
    }

    return {
      result: response?.result,
      multiplier: userEntry?.multiplier,
      userEntry,
    };
  }, [method, selectedRaffleForEnroll, userToken]);

  const claimOrEnroll = useCallback(async () => {
    if (!userToken || !selectedRaffleForEnroll) return;

    const args: any = [BigInt(selectedRaffleForEnroll!.raffleId)];

    const claimMethod = method;

    const chainId = Number(selectedRaffleForEnroll?.chain.chainId);

    const setClaimHashId = selectedRaffleForEnroll?.pk;

    const enrollOrClaimPayload = await getSignature();

    const id = enrollOrClaimPayload?.userEntry?.pk;

    console.log(id);
    setClaimOrEnrollLoading(true);

    if (claimMethod !== "Claim") {
      args.push(
        enrollOrClaimPayload?.multiplier,
        enrollOrClaimPayload?.result?.reqId,
        {
          signature: enrollOrClaimPayload?.result?.signatures[0].signature,
          owner: enrollOrClaimPayload?.result?.signatures[0].owner,
          nonce: enrollOrClaimPayload?.result?.data.init.nonceAddress,
        },
        enrollOrClaimPayload?.result?.shieldSignature
      );
    }

    try {
      const response = await writeAsync({
        args,
      });

      if (response) {
        await waitForTransaction({
          hash: response.hash,
          confirmations: 1,
          chainId,
        })
          .then(async (res) => {
            setClaimOrEnrollWalletResponse({
              success: true,
              state: "Done",
              txHash: res.transactionHash,
              message:
                method === "Claim"
                  ? "Claimed successfully."
                  : "Enrolled successfully",
            });

            await (method === "Enroll"
              ? updateEnrolledFinished(userToken, id, res.transactionHash)
              : updateClaimPrizeFinished(
                  userToken,
                  setClaimHashId,
                  res.transactionHash
                ));
          })
          .catch((e) => {
            setClaimOrEnrollWalletResponse({
              success: false,
              state: "Retry",
              message: "Something went wrong. Please try again!",
            });
          });
        // .finally(() => {
        //   setClaimOrEnrollLoading(false);
        // });
      }
    } finally {
      setClaimOrEnrollLoading(false);
      console.log("-");
    }
  }, [getSignature, method, selectedRaffleForEnroll, userToken, writeAsync]);

  const openEnrollModal = useCallback(
    (raffle: Prize, method: string | null) => {
      if (!isConnected) {
        setIsWalletPromptOpen(true);
        return;
      }
      setClaimOrEnrollWalletResponse(null);
      setMethod(method);
      setSelectedRaffleForEnroll(raffle);
    },
    [isConnected, setIsWalletPromptOpen]
  );

  const closeEnrollModal = useCallback(() => {
    setClaimOrEnrollWalletResponse(null);
    setSelectedRaffleForEnroll(null);
  }, []);

  const handleClaimPrize = useCallback(async () => {
    if (!selectedRaffleForEnroll || claimOrEnrollLoading) return;
    claimOrEnroll();
  }, [selectedRaffleForEnroll, claimOrEnrollLoading, claimOrEnroll]);

  const handleEnroll = useCallback(async () => {
    if (!selectedRaffleForEnroll || claimOrEnrollLoading) return;
    claimOrEnroll();
  }, [selectedRaffleForEnroll, claimOrEnrollLoading, claimOrEnroll]);

  useRefreshWithInitial(getRafflesList, FAST_INTERVAL, [
    userToken,
    getRafflesList,
  ]);

  return (
    <PrizeTapContext.Provider
      value={{
        rafflesList,
        openEnrollModal,
        closeEnrollModal,
        claimError,
        handleClaimPrize,
        claimOrEnrollLoading,
        claimOrEnrollSignatureLoading,
        method,
        setMethod,
        selectedRaffleForEnroll,
        setIsLineaWinnersOpen,
        setLineaEnrolledUsers,
        setSelectedRaffleForEnroll,
        setIsLineaCheckEnrolledModalOpen,
        handleEnroll,
        claimOrEnrollWalletResponse,
        isLineaWinnersOpen,
        lineaEnrolledUsers,
        isLineaCheckEnrolledModalOpen,
      }}
    >
      {children}
    </PrizeTapContext.Provider>
  );
};

export default PrizeTapProvider;
