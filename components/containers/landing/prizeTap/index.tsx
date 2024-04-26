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
      raffle.status !== "PENDING" && raffle.status !== "REJECTED",
  );

  const validRaffles = rafflesList.sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
  );

  const availableRaffles = rafflesList.filter(
    (raffle) =>
      new Date(raffle.deadline).getTime() > new Date().getTime() &&
      new Date().getTime() > new Date(raffle.startAt).getTime(),
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
            "relative z-20 h-full after:-top-8 after:w-full hover:bg-gray00"
          }
          icon={"/prizetap-icon.png"}
          iconSize={"w-8 h-7"}
          title={"Prize Tap"}
          buttonTitle={"Go to Tap"}
          buttonClass={
            "gradient-outline-button before:inset-[2px] text-gray100"
          }
        >
          <div className="mt-14">
            {validRaffles.length > 0 &&
              validRaffles.slice(0, 2).map((raffle, key) => (
                <div
                  key={key}
                  className={
                    "relative mb-2 flex h-[80px] overflow-hidden rounded-xl bg-gray30 px-2 py-2 text-xs text-white "
                  }
                >
                  <div className="z-100 w-full">
                    <div className="flex gap-4">
                      <div className="raffle-logo-container relative z-100 h-[63px] w-[64px] overflow-hidden">
                        <span className=" absolute left-[1px] h-[62px] w-[62px] overflow-hidden rounded-[13px] bg-gray40 p-1">
                          <img
                            className="object-contain"
                            width="62px"
                            height="63px"
                            src={raffle.imageUrl}
                            alt={raffle.name}
                          />
                        </span>
                      </div>
                      <div>
                        <p className="">
                          {/* {raffle.isPrizeNft
                            ? raffle.prizeAmount
                            : raffle.prizeAmount / 10 ** raffle.decimals}{" "}
                          {raffle.prizeSymbol} */}
                          {raffle.name}
                        </p>
                        <p className="mt-2 text-secondary-text">
                          {"by " +
                            (raffle.creatorName ||
                              raffle.creatorProfile?.username)}
                        </p>
                      </div>
                    </div>
                    <div className="ml-[6em] mt-[-1.2em] flex justify-between">
                      {raffle.winnerEntry ? (
                        <p className="text-gray90">
                          Congratulations, @
                          {raffle.winnerEntry?.userProfile?.username}
                        </p>
                      ) : (
                        <>
                          <p className="ml-2 text-gray90">
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
                  <div className="absolute bottom-0 left-0 flex h-[30px] w-full items-center justify-between bg-gray40 px-10"></div>
                </div>
              ))}
          </div>
        </Widget>
      </Link>
    </section>
  );
};

export default PrizeTapLanding;
