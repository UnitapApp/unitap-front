"use client";

import Icon from "@/components/ui/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWalletAccount, useWalletProvider } from "@/utils/wallet";
import { shortenAddress } from "@/utils";
import UButton from "@/components/ui/Button/UButton";
import { WinnerEntry } from "@/types";
import { Address, isAddressEqual, getContract } from "viem";
import { useGlobalContext } from "@/context/globalProvider";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { WalletWinner } from "@/components/containers/prize-tap/Linea/LineaWinnersModal";
import Modal from "@/components/ui/Modal/modal";
import { prizeTap721ABI, prizeTapABI } from "@/types/abis/contracts";
import { readContracts } from "wagmi";

export const getRaffleEntry = (
  entryWallets: Address[],
  userWallet?: Address
) => {
  return (
    !!userWallet &&
    entryWallets.find((entry) => isAddressEqual(entry, userWallet))
  );
};

const WinnersModalBody = () => {
  const [searchPhraseInput, setSearchPhraseInput] = useState("");
  const [winnersList, setWinnersList] = useState<Address[]>([]);

  const { winnersResultRaffle } = usePrizeOfferFormContext();

  const { address, isConnected } = useWalletAccount();

  const { setIsWalletPromptOpen } = useGlobalContext();

  const exportEnrollmentWallets = useCallback(async () => {
    const isNft = winnersResultRaffle!.isPrizeNft;
    const raffleId = Number(winnersResultRaffle!.raffleId);
    const entriesNumber = winnersResultRaffle!.numberOfOnchainEntries;
    // console.log(winnersResultRaffle!.contract);

    // const data = await provider.readContract({
    //   abi: (isNft ? prizeTap721ABI : prizeTapABI) as any,
    //   address: winnersResultRaffle!.contract as Address,
    //   functionName: "getParticipants",
    //   args: [BigInt(raffleId), 1n, 1n],
    // });

    const contracts = [];

    for (let i = 0; i <= entriesNumber / 100; i++) {
      contracts.push({
        abi: isNft ? prizeTap721ABI : prizeTapABI,
        address: winnersResultRaffle!.contract as Address,
        functionName: "getParticipants",
        args: [BigInt(raffleId), BigInt(i * 100), BigInt(i * 100 + 100)],

        chainId: Number(winnersResultRaffle?.chain.chainId ?? 1),
      });
    }

    const data = await readContracts({
      contracts,
    });

    setWinnersList((data.map((item) => item.result) as any).flat(2));
    // const contract = getContract({
    //   abi: isNft ? prizeTap721ABI : prizeTapABI,
    //   address: winnersResultRaffle!.contract as Address,
    //   publicClient: provider,
    // });

    // if (!contract) return;

    // Promise.all([
    //   contract.read.getParticipants([BigInt(raffleId), 1n, 1n]),
    // ]).then(([r1]) => {
    //   console.log(r1);
    // });
  }, [winnersResultRaffle]);

  // exportEnrollmentWallets();
  const enrollment = useMemo(
    () => getRaffleEntry(winnersList, address),
    [winnersList, address]
  );

  const userEnrollments = useMemo(() => {
    const items = !searchPhraseInput
      ? winnersResultRaffle?.winnerEntries
      : winnersResultRaffle?.winnerEntries?.filter((item) =>
          item.wallet
            .toLocaleLowerCase()
            .includes(searchPhraseInput.toLocaleLowerCase())
        ) ?? [];

    return items ?? [];
  }, [searchPhraseInput, winnersResultRaffle?.winnerEntries]);

  useEffect(() => {
    exportEnrollmentWallets();
  }, [exportEnrollmentWallets]);

  if (!winnersResultRaffle) return null;

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
        {winnersList.map((item, key) => (
          <WalletWinner
            id={key}
            walletAddress={item}
            isWinner
            claimTx={""}
            key={key}
            raffle={winnersResultRaffle.pk}
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
            {shortenAddress(enrollment)}

            <button className="ml-auto text-xs border-mid-dark-space-green border-2 rounded-lg bg-dark-space-green px-2 text-space-green flex items-center gap-1 py-1">
              Winner <span className="ml-1">&#x1F604;&#xfe0f;</span>
            </button>
          </div>
        ) : (
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

const WinnersModal = () => {
  const { winnersResultRaffle, handleWinnersResult } =
    usePrizeOfferFormContext();

  return (
    <Modal
      isOpen={!!winnersResultRaffle}
      closeModalHandler={() => handleWinnersResult(null)}
    >
      <WinnersModalBody />
    </Modal>
  );
};

export default WinnersModal;
