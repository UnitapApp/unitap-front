"use client";

import Icon from "@/components/ui/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { WalletWinner } from "@/app/prizetap/components/Linea/LineaWinnersModal";
import Modal from "@/components/ui/Modal/modal";
import { prizeTap721Abi, prizeTapAbi } from "@/types/abis/contracts";
import { useReadContracts } from "wagmi";
import { CSVLink } from "react-csv";
import { UserRafflesProps } from "@/types";
import { useProvider, useWalletProvider } from "@/utils/wallet";

interface Props {
  winnersResultRaffle: UserRafflesProps | null;
}

const WinnersModalBody = ({ winnersResultRaffle }: Props) => {
  const [searchPhraseInput, setSearchPhraseInput] = useState("");
  const [enrollmentWallets, setEnrollmentWallets] = useState<[]>([]);

  const provider = useWalletProvider();

  const exportEnrollmentWallets = useCallback(async () => {
    const isNft = winnersResultRaffle!.isPrizeNft;
    const raffleId = Number(winnersResultRaffle!.raffleId);
    const entriesNumber = winnersResultRaffle!.numberOfOnchainEntries;
    const contracts = [];

    for (let i = 0; i <= entriesNumber / 100; i++) {
      contracts.push({
        abi: isNft ? prizeTap721Abi : prizeTapAbi,
        address: winnersResultRaffle!.contract as Address,
        functionName: "getParticipants",
        args: [BigInt(raffleId), BigInt(i * 100), BigInt(i * 100 + 100)],
        chainId: Number(winnersResultRaffle?.chain.chainId ?? 1),
      });
    }

    const data = await (provider?.multicall as any)({
      contracts,
    });

    const allWallet = (data.map((item: any) => item.result) as any)
      .flat(2)
      .map((item: string) => {
        return {
          wallet: item,
        };
      });
    setEnrollmentWallets(allWallet);
  }, [provider, winnersResultRaffle]);

  const userEnrollments = useMemo(() => {
    const items = !searchPhraseInput
      ? winnersResultRaffle?.winnerEntries
      : winnersResultRaffle?.winnerEntries?.filter((item) =>
          item.userWalletAddress
            .toLocaleLowerCase()
            .includes(searchPhraseInput.toLocaleLowerCase())
        ) ?? [];

    return items ?? [];
  }, [searchPhraseInput, winnersResultRaffle?.winnerEntries]);

  useEffect(() => {
    exportEnrollmentWallets();
  }, [exportEnrollmentWallets]);

  useEffect(() => {
    exportEnrollmentWallets();
  }, [exportEnrollmentWallets]);

  if (!winnersResultRaffle) return null;

  return (
    <div>
      <div className="sm:flex sm:flex-row items-center sm:justify-between w-full px-1  mt-2 mb-2">
        <p className="text-xs  text-gray90">Winners</p>
        {!!winnersResultRaffle.numberOfOnchainEntries && (
          <CSVLink
            className="text-gray90 bg-none text-xs m-0 p-0 w-full underline max-w-[204px]"
            filename={`${winnersResultRaffle.prizeName}_raffleEntry_wallets.csv`}
            data={enrollmentWallets}
          >
            Export Enrolled People List (CSV file)
          </CSVLink>
        )}
      </div>
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
            claimingPrizeTx={item.claimingPrizeTx}
            id={item.pk}
            walletAddress={item.userWalletAddress}
            isWinner
            claimTx={item.txHash}
            key={key}
            raffle={winnersResultRaffle.pk}
          />
        ))}

        {searchPhraseInput && !userEnrollments.length && (
          <p className="text-white">No users found</p>
        )}
      </div>
    </div>
  );
};

interface ModalProps {
  winnersResultRaffle: UserRafflesProps | null;
  handleWinnersResult: (raffle: UserRafflesProps | null) => void;
}

const WinnersModal = ({
  winnersResultRaffle,
  handleWinnersResult,
}: ModalProps) => {
  return (
    <Modal
      isOpen={!!winnersResultRaffle}
      closeModalHandler={() => handleWinnersResult(null)}
      className="provider-dashboard__modal"
    >
      <WinnersModalBody winnersResultRaffle={winnersResultRaffle} />
    </Modal>
  );
};

export default WinnersModal;
