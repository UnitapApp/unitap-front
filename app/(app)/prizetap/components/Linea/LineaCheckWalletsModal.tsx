"use client";

import { FC, useCallback, useEffect, useMemo, useState } from "react";
import CheckCircleImage from "./check-circle.svg";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useWalletAccount } from "@/utils/wallet";
import { useGlobalContext } from "@/context/globalProvider";
import Modal from "@/components/ui/Modal/modal";
import { numberWithCommas } from "@/utils";
import UButton from "@/components/ui/Button/UButton";
import Image from "next/image";

const LineaCheckWalletsModal: FC<{}> = ({}) => {
  const {
    isLineaCheckEnrolledModalOpen,
    setIsLineaCheckEnrolledModalOpen,
    lineaEnrolledUsers,
    rafflesList,
  } = usePrizeTapContext();

  const lineaRaffle = useMemo(() => {
    return rafflesList.find((item) => item.pk === 70);
  }, [rafflesList]);

  const [result, setResult] = useState({
    blank: true,
    found: false,
  });

  const [searchPhraseInput, setSearchPhraseInput] = useState("");

  const { isConnected, address } = useWalletAccount();

  const { setIsWalletPromptOpen } = useGlobalContext();

  const closeClaimTokenModal = useCallback(() => {
    setIsLineaCheckEnrolledModalOpen(false);
  }, [setIsLineaCheckEnrolledModalOpen]);

  const tryFetchWallet = () => {
    if (!isConnected) {
      setIsWalletPromptOpen(true);
      return;
    }

    setSearchPhraseInput(address!);
    setTimeout(() => {
      findUserWallet(address!);
    }, 0);
  };

  const findUserWallet = (address: string) => {
    const userEnrollment = lineaEnrolledUsers.find(
      (item) =>
        item.walletAddress.toLocaleLowerCase() === address.toLocaleLowerCase(),
    );

    if (userEnrollment) {
      setResult({
        blank: false,
        found: true,
      });
      return;
    }

    setResult({
      blank: false,
      found: false,
    });
  };

  useEffect(() => {
    setResult({
      blank: true,
      found: false,
    });
  }, [searchPhraseInput]);

  if (!isLineaCheckEnrolledModalOpen) return null;

  const isSearchFilled = !!searchPhraseInput.length;

  return (
    <Modal
      title={``}
      size="small"
      closeModalHandler={closeClaimTokenModal}
      isOpen={isLineaCheckEnrolledModalOpen}
    >
      <div className="claim-modal-wrapper flex flex-col items-center justify-center pt-5 text-left font-normal">
        <div className="relative mb-5 text-center">
          <div className="mx-auto h-40 w-64 rounded-lg bg-[url('/assets/images/prize-tap/linea-modal-secondary-bg.svg')] bg-contain" />
          <Image
            src="/assets/images/prize-tap/linea-raffle-modal-cover.svg"
            className="absolute left-1/2 top-7 -translate-x-1/2"
            alt={"linea"}
            width={168}
            height={168}
          />
        </div>

        <div className="mt-10 text-center text-white">
          <h5>LINEA NFT</h5>
          <p className="mt-3 text-xs text-gray100">by linea</p>
          <div className="mt-10 text-left text-xs text-secondary-text">
            {numberWithCommas(lineaRaffle!.maxNumberOfEntries)} Whitelisted
            Wallets automatically enrolled to this raffle by Linea{" "}
            <CheckCircleImage className="inline-block" />
          </div>

          <div className="mt-10 px-2 text-left text-xs font-semibold text-gray90">
            Check Enrollment
          </div>

          <div className="mt-2">
            <div className="mt-1 flex w-full items-center rounded-xl border-2 border-gray70 bg-gray20 p-4 py-3.5">
              {isSearchFilled && (
                <Image
                  onClick={() => setSearchPhraseInput("")}
                  className="mr-3 cursor-pointer"
                  src="/assets/images/prize-tap/times.svg"
                  height={12}
                  width={12}
                  alt="close"
                />
              )}
              <input
                className="z-1 w-full bg-transparent pr-4 text-white placeholder:text-gray90"
                value={searchPhraseInput}
                onChange={(e) => setSearchPhraseInput(e.target.value)}
                placeholder="Check Wallet"
              />
              <div className="mr-auto flex flex-1 items-center gap-3 text-xs">
                {!result.blank ? (
                  result.found ? (
                    <div className="flex w-24 items-center rounded-lg border border-space-green bg-dark-space-green px-3 py-[6px] text-center font-semibold text-space-green">
                      Enrolled
                      <Image
                        src="/assets/images/prize-tap/ticket.svg"
                        alt="ticket"
                        className="ml-2"
                        width={20}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="w-28 rounded-lg border border-error bg-[#2C2228] px-1 py-[6px] text-center font-semibold text-error">
                      Not Whitelisted
                    </div>
                  )
                ) : (
                  <>
                    {isSearchFilled || (
                      <>
                        <button
                          onClick={() =>
                            navigator.clipboard
                              .readText()
                              .then((text) => setSearchPhraseInput(text))
                          }
                          className="rounded-lg border border-gray100 bg-gray00 px-3 py-[6px] text-center font-semibold text-gray100"
                        >
                          PASTE
                        </button>
                        <UButton
                          onClick={tryFetchWallet}
                          size="small"
                          className="gradient-outline-button bg-g-primary px-3 py-[6px] text-center font-semibold text-gray100 before:inset-[1px]"
                        >
                          <p className="bg-g-primary bg-clip-text text-transparent">
                            WALLET
                          </p>
                        </UButton>
                      </>
                    )}

                    <UButton
                      onClick={() => findUserWallet(searchPhraseInput)}
                      disabled={!isSearchFilled}
                      size="small"
                      className="gradient-outline-button bg-g-primary px-3 py-[6px] text-center font-semibold text-gray100 before:inset-[1px]"
                    >
                      <p className="bg-g-primary bg-clip-text text-transparent">
                        CHECK
                      </p>
                    </UButton>
                  </>
                )}
              </div>
            </div>
          </div>
          {result.blank ||
            (result.found ? (
              <div className="mt-3 text-center text-xs text-space-green">
                This wallet is one of the{" "}
                {numberWithCommas(lineaRaffle!.maxNumberOfEntries)} whitelisted
                wallets by Linea.
              </div>
            ) : (
              <div className="mt-3 text-center text-xs text-error">
                This wallet is not whitelisted by Linea.
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};
export default LineaCheckWalletsModal;
