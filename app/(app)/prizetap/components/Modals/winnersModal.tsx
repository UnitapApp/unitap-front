"use client";

import Icon from "@/components/ui/Icon";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WalletWinner } from "../Linea/LineaWinnersModal";
import { useWalletAccount } from "@/utils/wallet";
import { shortenAddress } from "@/utils";
import UButton from "@/components/ui/Button/UButton";
import { WinnerEntry } from "@/types";
import { Address, isAddressEqual } from "viem";
import { useGlobalContext } from "@/context/globalProvider";
import { prizeTap721Abi, prizeTapAbi } from "@/types/abis/contracts";
import { useReadContracts } from "wagmi";
import { contractAddresses } from "@/constants";
import { config } from "@/utils/wallet/wagmi";
import { FaSearch } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";

export const getRaffleEntry = (
  entryWallets: WinnerEntry[],
  userWallet?: Address,
) => {
  return (
    !!userWallet &&
    entryWallets.find((entry) =>
      isAddressEqual(entry.userWalletAddress, userWallet),
    )
  );
};

const WinnersModal = () => {
  const [searchPhraseInput, setSearchPhraseInput] = useState("");

  const { selectedRaffleForEnroll } = usePrizeTapContext();

  const { address, isConnected } = useWalletAccount();

  const { setIsWalletPromptOpen } = useGlobalContext();

  const enrollment = useMemo(
    () => getRaffleEntry(selectedRaffleForEnroll!.winnerEntries, address),
    [selectedRaffleForEnroll, address],
  );

  const fetchEnrollmentWallets = useCallback(() => {
    if (!selectedRaffleForEnroll) return [];

    const isNft = selectedRaffleForEnroll.isPrizeNft;
    const raffleId = Number(selectedRaffleForEnroll.raffleId);
    const entriesNumber = selectedRaffleForEnroll.numberOfOnchainEntries;

    const contracts = [];

    for (let i = 0; i <= entriesNumber / 100; i++) {
      const address = selectedRaffleForEnroll.isPrizeNft
        ? contractAddresses.prizeTap[selectedRaffleForEnroll.chain.chainId]
          ?.erc721
        : contractAddresses.prizeTap[selectedRaffleForEnroll.chain.chainId]
          ?.erc20 || selectedRaffleForEnroll.contract;

      if (!address) continue;

      contracts.push({
        abi: isNft ? prizeTap721Abi : prizeTapAbi,
        address,
        functionName: "getParticipants",
        args: [BigInt(raffleId), BigInt(i * 100), BigInt(i * 100 + 100)],
        chainId: Number(selectedRaffleForEnroll.chain.chainId ?? 1),
      });
    }

    return contracts;
    // const data = await readContracts({
    //   contracts,
    // });
  }, [selectedRaffleForEnroll]);

  const { data } = useReadContracts({
    contracts: fetchEnrollmentWallets(),
    config: config,
  }) as any;

  const enrollmentWallets = useMemo(() => {
    if (!data) return {};

    const allWallet = (data.map((item: any) => item.result) as any[])
      .flat(2)
      .reduce(
        (prev, curr: string) => {
          if (!curr) return prev;
          prev[curr.toLowerCase()] = true;

          return prev;
        },
        {} as { [key: string]: true },
      );
    return allWallet;
  }, [data]);

  const userEnrollments = useMemo(() => {
    const items = !searchPhraseInput
      ? selectedRaffleForEnroll?.winnerEntries
      : selectedRaffleForEnroll?.winnerEntries.filter((item) =>
        item.userWalletAddress
          .toLocaleLowerCase()
          .includes(searchPhraseInput.toLocaleLowerCase()),
      );

    return items ?? [];
  }, [searchPhraseInput, selectedRaffleForEnroll?.winnerEntries]);

  useEffect(() => {
    fetchEnrollmentWallets();
  }, [fetchEnrollmentWallets]);

  if (!selectedRaffleForEnroll) return null;

  return (
    <>
      <p className="w-full px-4 text-xs text-gray90">Winners</p>
      <div className="mt-1 flex w-full items-center rounded-xl border-2 dark:border-gray30 dark:bg-gray50 bg-stone-100 border-stone-300 p-4 py-3.5">
        <CiSearch size={20} className="mr-2 text-gray90" />
        <input
          className="z-1 w-full bg-transparent placeholder:text-gray90"
          value={searchPhraseInput}
          onChange={(e) => setSearchPhraseInput(e.target.value)}
          placeholder="Search Wallet"
        />
      </div>

      <div className="styled-scroll mt-4 h-72 w-full overflow-auto text-sm">
        {userEnrollments.map((item, key) => (
          <WalletWinner
            id={item.pk}
            walletAddress={item.userWalletAddress}
            isWinner
            claimingPrizeTx={item.claimingPrizeTx}
            claimTx={item.txHash}
            key={key}
            raffle={selectedRaffleForEnroll.pk}
          />
        ))}

        {searchPhraseInput && !userEnrollments.length && (
          <p className="">No users found</p>
        )}
      </div>
      <div className="w-full">
        {!isConnected ? (
          <div className="mt-5 flex items-center rounded-xl border-2 border-gray70 bg-stone-300 dark:bg-gray20 px-5 py-3 text-white">
            <p className="text-base text-gray80">0xYour...Wallet</p>
            <UButton
              onClick={() => setIsWalletPromptOpen(true)}
              size="small"
              className="gradient-outline-button ml-auto bg-g-primary px-3 py-[6px] text-center text-xs font-semibold text-gray100 before:inset-[1px]"
            >
              <p className="bg-g-primary bg-clip-text text-transparent">
                Connect Wallet
              </p>
            </UButton>
          </div>
        ) : enrollment ? (
          <div className="mt-5 flex items-center rounded-xl bg-gray20 px-5 py-4 text-white">
            {shortenAddress(enrollment.userWalletAddress)}

            <button className="border-mid-dark-space-green ml-auto flex items-center gap-1 rounded-lg border-2 bg-dark-space-green px-2 py-1 text-xs text-space-green">
              Winner <span className="ml-1">&#x1F604;&#xfe0f;</span>
            </button>
          </div>
        ) : !address || !enrollmentWallets[address?.toLowerCase()] ? null : (
          <div className="mt-5 flex items-center rounded-xl bg-gray20 px-5 py-4 text-white">
            {shortenAddress(address) ?? ""}

            <button className="ml-auto flex items-center gap-1 rounded-lg border border-[#A13744] bg-[#2C2228] px-4 py-1 text-xs text-error">
              Not a Winner &#x1F61F;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WinnersModal;
