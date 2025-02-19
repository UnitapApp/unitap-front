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

const LineaWinnersModal: FC<{}> = ({ }) => {
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
    [lineaEnrolledUsers, address]
  );

  const userEnrollments = useMemo(() => {
    const items = !searchPhraseInput
      ? lineaEnrolledUsers
      : lineaEnrolledUsers.filter((item) =>
        item.walletAddress
          .toLocaleLowerCase()
          .includes(searchPhraseInput.toLocaleLowerCase())
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
      <div className="claim-modal-wrapper font-normal text-left flex flex-col items-center justify-center pt-5">
        <p className="text-xs w-full px-4 text-gray90">Winners</p>
        <div className="flex !bg-stone-100 p-4 py-3.5 border-2 rounded-xl dark:bg-gray50 dark:border-gray30 items-center w-full mt-1">
          <Icon
            className="mr-5"
            iconSrc="/assets/images/modal/search-icon.svg"
            width="20px"
            height="20px"
          />
          <input
            className="bg-transparent placeholder:text-gray90 text-black w-full z-1"
            value={searchPhraseInput}
            onChange={(e) => setSearchPhraseInput(e.target.value)}
            placeholder="Search Wallet"
          />
        </div>

        <div className="mt-4 h-72 text-sm styled-scroll w-full overflow-auto">
          {userEnrollments.map((item, key) => (
            <LineaWalletWinner key={key} {...item} />
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
          ) : enrollment && enrollment.isWinner ? (
            <div className="flex px-5 py-4 rounded-xl mt-5 bg-gray20 items-center text-white">
              {shortenAddress(enrollment.walletAddress)}

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
  const raffle = selectedRaffleCh ? selectedRaffleCh : selectedRaffleForEnroll
  return (
    <div className="flex px-5 py-2 rounded-xl my-3 dark:bg-gray60 bg-stone-100 items-center dark:text-gray100 text-black">
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
          className="ml-auto text-xs font-semibold border-mid-dark-space-green border-2 rounded-lg bg-dark-space-green px-2 text-space-green flex items-center gap-1 py-1 underline"
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
        <span className="bg-gray50 border-2 border-gray70 rounded-lg px-4 py-2 text-xs ml-auto text-gray80">
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
    <div className="flex px-5 py-2 rounded-xl my-3 bg-gray60 items-center text-gray100">
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
          className="ml-auto text-xs font-semibold border-mid-dark-space-green border-2 rounded-lg bg-dark-space-green px-2 text-space-green flex items-center gap-1 py-1 underline"
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
        <span className="bg-gray50 border-2 border-gray70 rounded-lg px-4 py-2 text-xs ml-auto text-gray80">
          Not Claimed by the winner yet
        </span>
      )}
    </div>
  );
};

export default LineaWinnersModal;
