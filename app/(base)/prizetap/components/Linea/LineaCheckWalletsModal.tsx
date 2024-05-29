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
        item.walletAddress.toLocaleLowerCase() === address.toLocaleLowerCase()
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
      <div className="claim-modal-wrapper font-normal text-left flex flex-col items-center justify-center pt-5">
        <div className="mb-5 text-center relative">
          <div className="bg-[url('/assets/images/prize-tap/linea-modal-secondary-bg.svg')] bg-contain rounded-lg w-64 h-40 mx-auto" />
          <Image
            src="/assets/images/prize-tap/linea-raffle-modal-cover.svg"
            className="absolute left-1/2 -translate-x-1/2 top-7"
            alt={"linea"}
            width={168}
            height={168}
          />
        </div>

        <div className="mt-10 text-white text-center">
          <h5>LINEA NFT</h5>
          <p className="mt-3 text-xs text-gray100">by linea</p>
          <div className="mt-10 text-xs text-left text-secondary-text">
            {numberWithCommas(lineaRaffle!.maxNumberOfEntries)} Whitelisted
            Wallets automatically enrolled to this raffle by Linea{" "}
            <CheckCircleImage className="inline-block" />
          </div>

          <div className="mt-10 font-semibold text-left text-xs text-gray90 px-2">
            Check Enrollment
          </div>

          <div className="mt-2">
            <div className="flex bg-gray20 p-4 py-3.5 border-2 rounded-xl border-gray70 items-center w-full mt-1">
              {isSearchFilled && (
                <Image
                  onClick={() => setSearchPhraseInput("")}
                  className="cursor-pointer mr-3"
                  src="/assets/images/prize-tap/times.svg"
                  height={12}
                  width={12}
                  alt="close"
                />
              )}
              <input
                className="bg-transparent pr-4 placeholder:text-gray90 text-white w-full z-1"
                value={searchPhraseInput}
                onChange={(e) => setSearchPhraseInput(e.target.value)}
                placeholder="Check Wallet"
              />
              <div className="mr-auto text-xs flex-1 flex items-center gap-3">
                {!result.blank ? (
                  result.found ? (
                    <div className="rounded-lg flex items-center font-semibold bg-dark-space-green w-24 border border-space-green text-space-green text-center px-3 py-[6px]">
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
                    <div className="rounded-lg w-28 font-semibold bg-[#2C2228] border border-error text-error text-center px-1 py-[6px]">
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
                          className="rounded-lg font-semibold bg-gray00 border border-gray100 text-gray100 text-center px-3 py-[6px]"
                        >
                          PASTE
                        </button>
                        <UButton
                          onClick={tryFetchWallet}
                          size="small"
                          className="gradient-outline-button font-semibold bg-g-primary before:inset-[1px] text-gray100 text-center px-3 py-[6px]"
                        >
                          <p className="bg-clip-text bg-g-primary text-transparent">
                            WALLET
                          </p>
                        </UButton>
                      </>
                    )}

                    <UButton
                      onClick={() => findUserWallet(searchPhraseInput)}
                      disabled={!isSearchFilled}
                      size="small"
                      className="gradient-outline-button font-semibold bg-g-primary before:inset-[1px] text-gray100 text-center px-3 py-[6px]"
                    >
                      <p className="bg-clip-text bg-g-primary text-transparent">
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
              <div className="mt-3 text-space-green text-xs text-center">
                This wallet is one of the{" "}
                {numberWithCommas(lineaRaffle!.maxNumberOfEntries)} whitelisted
                wallets by Linea.
              </div>
            ) : (
              <div className="mt-3 text-error text-xs text-center">
                This wallet is not whitelisted by Linea.
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};
export default LineaCheckWalletsModal;
