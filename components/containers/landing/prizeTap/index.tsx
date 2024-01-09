import { FC } from "react";
import Widget from "../widget";
import Link from "next/link";
import RoutePath from "@/utils/routes";
import { RaffleCardTimerLandingPage } from "./raffleTimer";
import { serverFetch } from "@/utils/api";
import { Prize } from "@/types";

// const nftImage = (tokenUri: string | undefined | null) => {
//   let tokenImgLink: string | undefined = tokenUri
//     ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
//         Number(tokenUri.split("/")[3]) + 1
//       }.png`
//     : undefined;
//   return tokenImgLink;
// };

const PrizeTapLanding: FC = async () => {
  const rafflesList: Prize[] = (
    await serverFetch("/api/prizetap/raffle-list/")
  ).filter(
    (raffle: Prize) =>
      raffle.status !== "PENDING" && raffle.status !== "REJECTED"
  );

  const validRaffles = rafflesList.sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const availableRaffles = rafflesList.filter(
    (raffle) =>
      new Date(raffle.deadline).getTime() > new Date().getTime() &&
      new Date().getTime() > new Date(raffle.startAt).getTime()
  );

  return (
    <section className={"flex--1"}>
      <Link className={"flex--1"} href={RoutePath.PRIZE}>
        <Widget
          id="prizetap"
          description={
            availableRaffles.length === 0
              ? "No raffles are live on Prize Tap"
              : availableRaffles.length === 1
              ? "1 raffle is live on Prize Tap"
              : availableRaffles.length + " Raffles are live on PrizeTap..."
          }
          className={
            "h-full after:w-full after:-top-8 relative z-20 hover:bg-gray00"
          }
          icon={"/prizetap-icon.png"}
          iconSize={"w-8 h-7"}
          title={"Prize Tap"}
          buttonTitle={"Beta"}
          buttonClass={"green-text-button text-gray100"}
        >
          {validRaffles.length > 0 &&
            validRaffles.slice(0, 2).map((raffle, key) => (
              <div
                key={key}
                className={
                  "flex relative text-xs text-white bg-gray30 rounded-xl py-2 px-2 mb-2 overflow-hidden h-[80px] "
                }
              >
                <div className="z-100 w-full">
                  <div className="flex gap-4">
                    <div className="raffle-logo-container w-[64px] h-[63px] relative z-100 overflow-hidden">
                      <span className=" w-[62px] left-[1px] h-[62px] rounded-[13px] bg-gray40 absolute overflow-hidden">
                        <img
                          width="62px"
                          height="63px"
                          src={raffle.imageUrl}
                          alt={raffle.name}
                        />
                      </span>
                    </div>
                    <div>
                      <p className="">
                        {raffle.isPrizeNft
                          ? raffle.prizeAmount
                          : raffle.prizeAmount / 10 ** raffle.decimals}{" "}
                        {raffle.prizeSymbol}
                      </p>
                      <p className="text-secondary-text mt-2">
                        {"by " +
                          (raffle.creatorName ||
                            raffle.creatorProfile?.username)}
                      </p>
                    </div>
                  </div>
                  <div className="flex mt-[-1.2em] ml-[6em] justify-between">
                    {raffle.winnerEntry ? (
                      <p className="text-gray90">
                        Congratulations, @
                        {raffle.winnerEntry?.userProfile?.username}
                      </p>
                    ) : (
                      <>
                        <p className="text-gray90 ml-2">
                          Winners Announced in:
                        </p>
                        <RaffleCardTimerLandingPage
                          startTime={raffle.createdAt}
                          FinishTime={raffle.deadline}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray40 absolute bottom-0 left-0 h-[30px] flex items-center justify-between px-10"></div>
              </div>
            ))}
        </Widget>
      </Link>
    </section>
  );
};

export default PrizeTapLanding;
