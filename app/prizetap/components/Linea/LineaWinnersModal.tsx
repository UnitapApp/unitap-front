"use client";

import { FC, useCallback, useMemo, useState } from "react";
import { getUserEntry } from ".";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useWalletAccount } from "@/utils/wallet";
import Modal from "@/components/ui/Modal/modal";
import Icon from "@/components/ui/Icon";
import UButton from "@/components/ui/Button/UButton";
import { useGlobalContext } from "@/context/globalProvider";
import { getTxUrl, shortenAddress } from "@/utils";
import { LineaRaffleEntry } from "@/types";

const LineaWinnersModal: FC<{}> = ({}) => {
  const { isLineaWinnersOpen, setIsLineaWinnersOpen, lineaEnrolledUsers } =
    usePrizeTapContext();

  const [searchPhraseInput, setSearchPhraseInput] = useState("");

  const closeClaimTokenModal = useCallback(() => {
    setIsLineaWinnersOpen(false);
  }, [setIsLineaWinnersOpen]);

  const { isConnected, address } = useWalletAccount();

  const { setIsWalletPromptOpen } = useGlobalContext();

  const enrollment = useMemo(
    () => getUserEntry(lineaEnrolledUsers, address),
    [lineaEnrolledUsers, address],
  );

  const userEnrollments = useMemo(() => {
    const items = !searchPhraseInput
      ? lineaEnrolledUsers
      : lineaEnrolledUsers.filter((item) =>
          item.walletAddress
            .toLocaleLowerCase()
            .includes(searchPhraseInput.toLocaleLowerCase()),
        );

    return items.sort((x, y) => {
      return x.isWinner === y.isWinner ? 0 : x.isWinner ? -1 : 1;
    });
  }, [searchPhraseInput, lineaEnrolledUsers]);

  if (!isLineaWinnersOpen) return null;

  return (
    <Modal
      title={`LINEA NFT Winners`}
      size="small"
      closeModalHandler={closeClaimTokenModal}
      isOpen={isLineaWinnersOpen}
    >
      <div className="claim-modal-wrapper flex flex-col items-center justify-center pt-5 text-left font-normal">
        <p className="w-full px-4 text-xs text-gray90">Winners</p>
        <div className="mt-1 flex w-full items-center rounded-xl border-2 !bg-stone-100 p-4 py-3.5 dark:border-gray30 dark:bg-gray50">
          <Icon
            className="mr-5"
            iconSrc="/assets/images/modal/search-icon.svg"
            width="20px"
            height="20px"
          />
          <input
            className="z-1 w-full bg-transparent text-black placeholder:text-gray90"
            value={searchPhraseInput}
            onChange={(e) => setSearchPhraseInput(e.target.value)}
            placeholder="Search Wallet"
          />
        </div>

        <div className="styled-scroll mt-4 h-72 w-full overflow-auto text-sm">
          {userEnrollments.map((item, key) => (
            <LineaWalletWinner key={key} {...item} />
          ))}

          {searchPhraseInput && !userEnrollments.length && (
            <p className="text-white">No users found</p>
          )}
        </div>
        <div className="w-full">
          {!isConnected ? (
            <div className="mt-5 flex items-center rounded-xl border-2 border-gray70 bg-gray20 px-5 py-3 text-white">
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
          ) : enrollment && enrollment.isWinner ? (
            <div className="mt-5 flex items-center rounded-xl bg-gray20 px-5 py-4 text-white">
              {shortenAddress(enrollment.walletAddress)}

              <button className="border-mid-dark-space-green ml-auto flex items-center gap-1 rounded-lg border-2 bg-dark-space-green px-2 py-1 text-xs text-space-green">
                Winner <span className="ml-1">&#x1F604;&#xfe0f;</span>
              </button>
            </div>
          ) : (
            <div className="mt-5 flex items-center rounded-xl bg-gray20 px-5 py-4 text-white">
              {shortenAddress(address) ?? ""}

              <button className="ml-auto flex items-center gap-1 rounded-lg border border-[#A13744] bg-[#2C2228] px-4 py-1 text-xs text-error">
                Not a Winner &#x1F61F;
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export const WalletWinner: FC<LineaRaffleEntry> = ({
  claimTx,
  walletAddress,
  isWinner,
  claimingPrizeTx,
  selectedRaffleCh,
}) => {
  const { selectedRaffleForEnroll } = usePrizeTapContext();
  const raffle = selectedRaffleCh ? selectedRaffleCh : selectedRaffleForEnroll;
  return (
    <div className="my-3 flex items-center rounded-xl bg-stone-100 px-5 py-2 text-black dark:bg-gray60 dark:text-gray100">
      <a
        className="flex items-center"
        target="_blank"
        href={`https://blockscan.com/address/${walletAddress}`}
      >
        {shortenAddress(walletAddress)}

        <Icon iconSrc="/assets/images/arrow-icon.svg" className="ml-3" />
      </a>

      {claimingPrizeTx ? (
        <a
          target="_blank"
          href={getTxUrl(raffle!.chain, claimingPrizeTx)}
          className="border-mid-dark-space-green ml-auto flex items-center gap-1 rounded-lg border-2 bg-dark-space-green px-2 py-1 text-xs font-semibold text-space-green underline"
        >
          Claimed
          <Icon
            iconSrc="/assets/images/prize-tap/ic_link_green.svg"
            className="ml-1"
          />
          <Icon
            height="25px"
            iconSrc="/assets/images/prize-tap/diamond.svg"
            className="ml-2"
          />
        </a>
      ) : (
        <span className="ml-auto rounded-lg border-2 border-gray70 bg-stone-200 px-4 py-2 text-xs text-gray80 dark:bg-gray50">
          Not Claimed by the winner yet
        </span>
      )}
    </div>
  );
};

export const LineaWalletWinner: FC<LineaRaffleEntry> = ({
  claimTx,
  walletAddress,
  isWinner,
  claimingPrizeTx,
}) => {
  const { selectedRaffleForEnroll } = usePrizeTapContext();
  return (
    <div className="my-3 flex items-center rounded-xl bg-gray60 px-5 py-2 text-gray100">
      <a
        className="flex items-center"
        target="_blank"
        href={`https://blockscan.com/address/${walletAddress}`}
      >
        {shortenAddress(walletAddress)}

        <Icon iconSrc="/assets/images/arrow-icon.svg" className="ml-3" />
      </a>

      {isWinner ? (
        <a
          target="_blank"
          // href={getTxUrl(selectedRaffleForEnroll!.chain, claimingPrizeTx)}
          className="border-mid-dark-space-green ml-auto flex items-center gap-1 rounded-lg border-2 bg-dark-space-green px-2 py-1 text-xs font-semibold text-space-green underline"
        >
          Claimed
          <Icon
            iconSrc="/assets/images/prize-tap/ic_link_green.svg"
            className="ml-1"
          />
          <Icon
            height="25px"
            iconSrc="/assets/images/prize-tap/diamond.svg"
            className="ml-2"
          />
        </a>
      ) : (
        <span className="ml-auto rounded-lg border-2 border-gray70 bg-gray50 px-4 py-2 text-xs text-gray80">
          Not Claimed by the winner yet
        </span>
      )}
    </div>
  );
};

export default LineaWinnersModal;
