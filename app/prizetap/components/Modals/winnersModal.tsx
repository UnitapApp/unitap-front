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

export const getRaffleEntry = (
  entryWallets: WinnerEntry[],
  userWallet?: Address
) => {
  return (
    !!userWallet &&
    entryWallets.find((entry) =>
      isAddressEqual(entry.userWalletAddress, userWallet)
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
    [selectedRaffleForEnroll, address]
  );

  const fetchEnrollmentWallets = useCallback(() => {
    if (!selectedRaffleForEnroll) return [];

    const isNft = selectedRaffleForEnroll.isPrizeNft;
    const raffleId = Number(selectedRaffleForEnroll.raffleId);
    const entriesNumber = selectedRaffleForEnroll.numberOfOnchainEntries;

    const contracts = [];

    for (let i = 0; i <= entriesNumber / 100; i++) {
      contracts.push({
        abi: isNft ? prizeTap721Abi : prizeTapAbi,
        address: (selectedRaffleForEnroll.isPrizeNft
          ? "0xDB7bA3A3cbEa269b993250776aB5B275a5F004a0"
          : "0x57b2BA844fD37F20E9358ABaa6995caA4fCC9994") as Address,
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
  }) as any;

  const enrollmentWallets = useMemo(() => {
    if (!data) return;

    const allWallet = (data.map((item: any) => item.result) as any[])
      .flat(2)
      .reduce((prev, curr: string) => {
        prev[curr.toLowerCase()] = true;

        return prev;
      }, {} as { [key: string]: true });
    return allWallet;
  }, [data]);

  const userEnrollments = useMemo(() => {
    const items = !searchPhraseInput
      ? selectedRaffleForEnroll?.winnerEntries
      : selectedRaffleForEnroll?.winnerEntries.filter((item) =>
          item.userWalletAddress
            .toLocaleLowerCase()
            .includes(searchPhraseInput.toLocaleLowerCase())
        );

    return items ?? [];
  }, [searchPhraseInput, selectedRaffleForEnroll?.winnerEntries]);

  useEffect(() => {
    fetchEnrollmentWallets();
  }, [fetchEnrollmentWallets]);

  if (!selectedRaffleForEnroll) return null;

  return (
    <>
      <p className="text-xs w-full px-4 text-gray90">Winners</p>
      <div className="flex bg-gray50 p-4 py-3.5 border-2 rounded-xl !border-gray30 items-center w-full mt-1">
        <Icon
          className="mr-5"
          iconSrc="/assets/images/modal/search-icon.svg"
          width="20px"
          height="20px"
        />
        <input
          className="bg-transparent placeholder:text-gray90 text-white w-full z-1"
          value={searchPhraseInput}
          onChange={(e) => setSearchPhraseInput(e.target.value)}
          placeholder="Search Wallet"
        />
      </div>

      <div className="mt-4 h-72 text-sm styled-scroll w-full overflow-auto">
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
          <p className="text-white">No users found</p>
        )}
      </div>
      <div className="w-full">
        {!isConnected ? (
          <div className="flex px-5 py-3 border-2 border-gray70 rounded-xl mt-5 bg-gray20 items-center text-white">
            <p className="text-gray80 text-base">0xYour...Wallet</p>
            <UButton
              onClick={() => setIsWalletPromptOpen(true)}
              size="small"
              className="gradient-outline-button text-xs ml-auto font-semibold bg-g-primary before:inset-[1px] text-gray100 text-center px-3 py-[6px]"
            >
              <p className="bg-clip-text bg-g-primary text-transparent">
                Connect Wallet
              </p>
            </UButton>
          </div>
        ) : enrollment ? (
          <div className="flex px-5 py-4 rounded-xl mt-5 bg-gray20 items-center text-white">
            {shortenAddress(enrollment.userWalletAddress)}

            <button className="ml-auto text-xs border-mid-dark-space-green border-2 rounded-lg bg-dark-space-green px-2 text-space-green flex items-center gap-1 py-1">
              Winner <span className="ml-1">&#x1F604;&#xfe0f;</span>
            </button>
          </div>
        ) : !address || !enrollmentWallets[address?.toLowerCase()] ? null : (
          <div className="flex px-5 py-4 rounded-xl mt-5 bg-gray20 items-center text-white">
            {shortenAddress(address) ?? ""}

            <button className="ml-auto text-xs border-[#A13744] border rounded-lg bg-[#2C2228] px-4 text-error flex items-center gap-1 py-1">
              Not a Winner &#x1F61F;
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WinnersModal;
