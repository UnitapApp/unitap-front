import { FC, useState, useEffect, useMemo } from "react";
import { Prize } from "@/types";
import { Action, RaffleCardTimer } from "../RafflesList";
import { LineaRaffleEntry } from "@/types";
import { getLineaRaffleEntries } from "@/utils/api";
import CheckCircleImage from "./check-circle.svg";
import { numberWithCommas } from "@/utils/numbers";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useSlowRefresh } from "@/utils/hooks/refresh";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { Button, ClaimAndEnrollButton } from "@/components/ui/Button/button";
import Image from "next/image";

export const getUserEntry = (
  entryWallets: LineaRaffleEntry[],
  userWallet?: string,
) => {
  return (
    !!userWallet &&
    entryWallets.find(
      (entry) =>
        entry.walletAddress.toLocaleLowerCase() ===
        userWallet.toLocaleLowerCase(),
    )
  );
};

export const LineaRaffleCard: FC<{
  raffle: Prize;
  isHighlighted?: boolean;
}> = ({ raffle, isHighlighted }) => {
  const {
    imageUrl,
    tokenUri,
    creatorUrl,
    twitterUrl,
    discordUrl,
    creatorName,
    description,
    startAt,
    deadline,
    name,
    isExpired,
    numberOfOnchainEntries,
    maxNumberOfEntries,
    isPrizeNft,
    userEntry,
    winnerEntry,
    creatorProfile,
    maxMultiplier,
  } = raffle;

  const creator = creatorName || creatorProfile?.username;

  const {
    openEnrollModal,
    setIsLineaCheckEnrolledModalOpen,
    setIsLineaWinnersOpen,
    lineaEnrolledUsers,
    setLineaEnrolledUsers,
  } = usePrizeTapContext();

  const [start, setStarted] = useState<boolean>(true);
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  const isEnded =
    (new Date().getTime() - new Date(deadline).getTime()) / (1000 * 60) > 0;

  const firstWinner = useMemo(
    () => lineaEnrolledUsers.find((entry) => entry.isWinner),
    [lineaEnrolledUsers],
  );

  useEffect(() => {
    setStarted(new Date(startAt) < new Date());
  }, [new Date()]);

  useSlowRefresh(() => {
    getLineaRaffleEntries().then((res) => {
      setLineaEnrolledUsers(res);
    });
  }, [getLineaRaffleEntries, setLineaEnrolledUsers]);

  const tokenImgLink: string | undefined = tokenUri
    ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
        Number(tokenUri.split("/")[3]) + 1
      }.png`
    : undefined;

  const prizeLink = isPrizeNft
    ? imageUrl
      ? imageUrl
      : tokenImgLink
    : `https://etherscan.io/address/${raffle.prizeAsset}`;

  const onPrizeClick = () => {
    if (prizeLink) window.open(prizeLink, "_blank");
  };

  return (
    <>
      <div className={`prize-card-linea ${isHighlighted ? "mb-20" : "mb-4"}`}>
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-gray30 p-5 lg:flex-row lg:bg-inherit lg:p-0">
          <div className="prize-card__image relative mb-3 lg:mb-0">
            <div
              className={
                isHighlighted
                  ? "gradient-outline-card p-[2px] before:!inset-[2px]"
                  : ""
              }
            >
              <div
                className={`prize-card__container flex h-[212px] w-[212px] flex-col ${
                  isHighlighted
                    ? "bg-g-primary-low "
                    : "border-2 border-gray40 bg-gray30"
                } items-center justify-center rounded-xl p-5`}
              >
                <img
                  onClick={onPrizeClick}
                  src={"assets/images/prize-tap/linea-raffle-image.svg"}
                  alt={name}
                  width={!isPrizeNft ? "168px" : ""}
                  className={`${!isPrizeNft ? "ml-1" : ""} mb-2 cursor-pointer`}
                />
              </div>
            </div>
            <div className="absolute bottom-[-10px] left-[40px] flex min-w-[130px] items-center justify-center rounded-md border-2 border-gray70 bg-gray50">
              <p className="p-1 text-2xs text-gray100">on</p>
              <img
                src="/assets/images/prize-tap/linea.svg"
                className="ml-2"
                alt=""
              />
            </div>
          </div>
          <div
            className={
              isHighlighted
                ? "gradient-outline-card relative w-full p-[2px] before:!inset-[3px]"
                : "relative w-full"
            }
          >
            <img
              src="/assets/images/prize-tap/linia-prize-bg.svg"
              alt="prize-tap"
              className="absolute right-0 top-0 z-20"
            />

            <div
              className={`card prize-card__content relative h-full md:max-h-[225px] md:min-h-[212px] ${
                isHighlighted
                  ? "bg-g-primary-low"
                  : "border-2 border-gray40 bg-gray30"
              } flex h-full w-full flex-col rounded-xl p-4 pt-3`}
            >
              <img
                src="/assets/images/prize-tap/linea-texture.svg"
                alt="prize-tap"
                className="absolute left-0 top-0 z-10"
              />
              <span className="relative z-20 mb-1 flex w-full justify-between">
                <div className="flex items-center gap-x-2">
                  <p
                    className="prize-card__title cursor-pointer text-sm text-[#61DFFF]"
                    onClick={onPrizeClick}
                  >
                    {name}
                  </p>
                  <small className="rounded-lg bg-[#0E1217] p-1 text-xs font-bold text-[#1D788F]">
                    x{maxMultiplier} Winners
                  </small>
                </div>
                <div className="prize-card__links flex gap-4 text-secondary-text">
                  {twitterUrl && (
                    <Icon
                      iconSrc="/assets/images/prize-tap/linea-twitter-logo.svg"
                      onClick={() => window.open(twitterUrl, "_blank")}
                      width="20px"
                      height="16px"
                      hoverable
                    />
                  )}
                  {discordUrl && (
                    <Icon
                      iconSrc="/assets/images/prize-tap/discord-logo-linea.svg"
                      onClick={() => window.open(discordUrl, "_blank")}
                      width="20px"
                      height="16px"
                      hoverable
                    />
                  )}
                  <Icon
                    iconSrc="/assets/images/prize-tap/website.svg"
                    onClick={() => window.open("https://linea.build", "_blank")}
                    width="20px"
                    height="16px"
                    hoverable
                  />
                </div>
              </span>
              <span className="relative z-20 mb-4 flex w-full justify-between">
                <p className="prize-card__source text-xs text-[#61DFFF]">
                  {!isPrizeNft ? (
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => window.open(creatorUrl, "_blank")}
                    >
                      by {creator}
                    </span>
                  ) : (
                    <span
                      className="hover:cursor-pointer"
                      onClick={() => window.open(creatorUrl, "_blank")}
                    >
                      by {creator}
                    </span>
                  )}
                </p>
              </span>
              <p className="prize-card__description mb-2 shrink-0 grow basis-auto text-justify text-xs leading-5 text-[#1D677C]">
                {description}
              </p>

              <p className="mb-2 flex shrink-0 grow basis-auto items-center gap-2 bg-gray30 text-xs leading-5 text-[#1D677C]">
                {numberWithCommas(maxNumberOfEntries)} Whitelisted Wallets
                automatically enrolled to this raffle by Linea{" "}
                <Image alt="check-circle" src={CheckCircleImage} />
              </p>

              {!winnerEntry && !userEntry?.txHash && !raffle.isExpired && (
                <span className="mb-3 text-xs">
                  <div
                    className={`flex flex-wrap items-center gap-2 text-xs text-white`}
                  >
                    {(showAllPermissions
                      ? raffle.constraints
                      : raffle.constraints
                          .filter((permission) => permission.type === "VER")
                          .slice(0, 6)
                    ).map((permission, key) => (
                      <Tooltip
                        onClick={openEnrollModal.bind(null, raffle, "Verify")}
                        className={
                          "rounded-lg border border-gray70 bg-gray50 px-3 py-2 transition-colors hover:bg-gray10 "
                        }
                        data-testid={`token-verification-${raffle.id}-${permission.name}`}
                        key={key}
                        text={permission.description}
                      >
                        <div className="flex items-center gap-3">
                          {permission.title}
                        </div>
                      </Tooltip>
                    ))}

                    {raffle.constraints.length > 6 && (
                      <button
                        onClick={setShowAllPermissions.bind(
                          null,
                          !showAllPermissions,
                        )}
                        className="z-10 flex items-center rounded-lg border border-gray70 bg-gray60 px-3 py-2 transition-colors"
                      >
                        <span>
                          {showAllPermissions ? "Show less" : "Show more"}
                        </span>
                        <img
                          alt="angle down"
                          src="/assets/images/token-tap/angle-down.svg"
                          className={`ml-2 ${
                            showAllPermissions ? "rotate-180" : ""
                          } transition-transform`}
                        />
                      </button>
                    )}
                  </div>
                </span>
              )}

              <Action className={"w-full items-center sm:w-auto sm:items-end"}>
                {(isExpired && !firstWinner) ||
                (!firstWinner &&
                  maxNumberOfEntries === numberOfOnchainEntries) ? (
                  <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                    <div className="flex w-full flex-col justify-between gap-4 rounded-xl bg-gray40 px-5 py-1 sm:flex-row md:items-center">
                      <div className="flex flex-col gap-1">
                        <p className="text-2xs text-white">
                          {start ? "Winners in:" : "Starts in:"}
                        </p>
                      </div>
                      <RaffleCardTimer
                        startTime={startAt}
                        FinishTime={deadline}
                      />
                    </div>
                    <ClaimAndEnrollButton
                      disabled={true}
                      className="!w-full min-w-[552px] md:!w-[352px]"
                      height="48px"
                      $fontSize="14px"
                    >
                      {" "}
                      <div className="relative w-full">
                        {maxNumberOfEntries === numberOfOnchainEntries ? (
                          <p> Full</p>
                        ) : (
                          <p> Unavailable</p>
                        )}
                        <Icon
                          className="absolute right-0 top-1/2 -translate-y-1/2"
                          iconSrc="assets/images/prize-tap/header-prize-logo.svg"
                          width="27px"
                          height="24px"
                        />
                      </div>
                    </ClaimAndEnrollButton>
                  </span>
                ) : !isEnded ? (
                  <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex w-full flex-col justify-between gap-4 rounded-xl bg-gray40 px-5 py-1 sm:flex-row md:items-center">
                      <div className="flex flex-col gap-1">
                        <p className="text-2xs text-white">
                          {start ? "Winners in:" : "Starts in:"}
                        </p>
                      </div>
                      <RaffleCardTimer
                        startTime={startAt}
                        FinishTime={deadline}
                      />
                    </div>

                    <Button
                      onClick={() => setIsLineaCheckEnrolledModalOpen(true)}
                      className="flex !w-full min-w-[552px] justify-center rounded-xl border-2 border-[#61DFFF] bg-[#191921] px-5 py-3 text-center text-[#61DFFF] transition-colors active:bg-[#1C222B] md:!w-[352px]"
                      height="48px"
                      $fontSize="14px"
                    >
                      <p> Check Enrolled Wallets </p>
                    </Button>
                  </span>
                ) : (
                  <span className="flex w-full flex-col items-center justify-between gap-4 md:flex-row ">
                    <div className="winner-box-bg flex h-[48px] w-full items-center justify-between gap-4 overflow-hidden rounded-xl  px-5 py-1">
                      <p className="text-2xs text-white">
                        Raffle is done, check the winners:{" "}
                      </p>
                      {/* <Icon
												className="opacity-[.3] mt-[-10px] mr-[-20px]"
												iconSrc="/assets/images/prize-tap/linia-winner-bg.svg"
												width="215px"
												height="215px"
											/> */}
                    </div>
                    <Button
                      disabled={!start}
                      className="flex !w-full min-w-[552px] justify-center rounded-xl border-2 border-[#61DFFF] bg-[#191921] px-5 py-3 text-center text-[#61DFFF] md:!w-[352px]"
                      onClick={() => setIsLineaWinnersOpen(true)}
                    >
                      <div className="relative w-full">
                        <p> Check Winners </p>{" "}
                      </div>
                    </Button>
                  </span>
                )}
              </Action>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
