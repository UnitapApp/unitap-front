"use client";

import Icon from "@/components/ui/Icon";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WalletWinner } from "@/app/prizetap/components/Linea/LineaWinnersModal";
import Modal from "@/components/ui/Modal/modal";
import { prizeTap721Abi, prizeTapAbi } from "@/types/abis/contracts";
import { CSVLink } from "react-csv";
import { UserRafflesProps } from "@/types";
import { useProvider, useWalletProvider } from "@/utils/wallet";
import { contractAddresses } from "@/constants";
import { readContracts } from "wagmi/actions";
import { config } from "@/utils/wallet/wagmi";

interface Props {
  winnersResultRaffle: UserRafflesProps | null;
}

const WinnersModalBody = ({ winnersResultRaffle }: Props) => {
  const [searchPhraseInput, setSearchPhraseInput] = useState("");
  const [enrollmentWallets, setEnrollmentWallets] = useState<[]>([]);

  const provider = useWalletProvider();

  const exportEnrollmentWallets = useCallback(async () => {
    if (!winnersResultRaffle) return;

    const isNft = winnersResultRaffle!.isPrizeNft;
    const raffleId = Number(winnersResultRaffle!.raffleId);
    const entriesNumber = winnersResultRaffle!.numberOfOnchainEntries;
    const contracts = [];

    for (let i = 0; i <= entriesNumber / 100; i++) {
      const address = winnersResultRaffle.isPrizeNft
        ? contractAddresses.prizeTap[winnersResultRaffle.chain.chainId]?.erc721
        : contractAddresses.prizeTap[winnersResultRaffle.chain.chainId]
            ?.erc20 || winnersResultRaffle.contract;

      if (!address) continue;

      contracts.push({
        abi: isNft ? prizeTap721Abi : prizeTapAbi,
        address,
        functionName: "getParticipants",
        args: [BigInt(raffleId), BigInt(i * 100), BigInt(i * 100 + 100)],
        chainId: Number(winnersResultRaffle?.chain.chainId ?? 1),
      });
    }

    const data = await readContracts(config, {
      contracts: contracts as any,
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
      : (winnersResultRaffle?.winnerEntries?.filter((item) =>
          item.userWalletAddress
            .toLocaleLowerCase()
            .includes(searchPhraseInput.toLocaleLowerCase()),
        ) ?? []);

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
      <div className="mb-2 mt-2 w-full items-center px-1 sm:flex sm:flex-row sm:justify-between">
        <p className="text-xs text-gray90">Winners</p>
        {!!winnersResultRaffle.numberOfOnchainEntries && (
          <CSVLink
            className="m-0 w-full max-w-[204px] bg-none p-0 text-xs text-gray90 underline"
            filename={`${winnersResultRaffle.prizeName}_raffleEntry_wallets.csv`}
            data={enrollmentWallets}
          >
            Export Enrolled People List (CSV file)
          </CSVLink>
        )}
      </div>
      <div className="mt-1 flex w-full items-center rounded-xl border-2 !border-gray30 bg-gray50 p-4 py-3.5">
        <Icon
          className="mr-5"
          iconSrc="/quest/assets/images/modal/search-icon.svg"
          width="20px"
          height="20px"
        />
        <input
          className="z-1 w-full bg-transparent text-white placeholder:text-gray90"
          value={searchPhraseInput}
          onChange={(e) => setSearchPhraseInput(e.target.value)}
          placeholder="Search Wallet"
        />
      </div>

      <div className="styled-scroll mt-4 h-72 w-full overflow-auto text-sm">
        {userEnrollments.map((item, key) => (
          <WalletWinner
            claimingPrizeTx={item.claimingPrizeTx}
            id={item.pk}
            walletAddress={item.userWalletAddress}
            isWinner
            claimTx={item.txHash}
            key={key}
            raffle={winnersResultRaffle.pk}
            selectedRaffleCh={winnersResultRaffle}
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
