import LandingButton from "@/components/containers/landing/button";
import { Prize } from "@/types";
import { FC, PropsWithChildren } from "react";
import { Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { fromWei } from "@/utils";
import Markdown from "react-markdown";

export type PrizeCardProps = {
  prize: Prize;
};

const nunitoSans = Nunito_Sans({
  weight: ["200", "300", "400", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

export default function PrizeCard({ prize }: PrizeCardProps) {
  return (
    <article
      className={`${nunitoSans.className} bg-raffle-card overflow-hidden rounded-3xl border shadow-primary-button`}
    >
      <div className="bg-circle-dots flex items-center p-[2px]">
        <PrizeContent prize={prize} />
        <PrizeDetails prize={prize} />
      </div>
    </article>
  );
}

export const PrizeContent: FC<{ prize: Prize }> = ({ prize }) => {
  return (
    <div
      className={`flex flex-1 items-center gap-3 px-4 ${nunitoSans.className}`}
    >
      <div className="h-[231px] w-[231px] rotate-3">
        <img
          src={prize.image}
          alt={prize.name}
          width={231}
          height={231}
          className=""
        />
      </div>

      <div>
        <h1 className="font-bold">{prize.name}</h1>
        <Markdown className="mt-5">{prize.description}</Markdown>
        <div className="mt-5 text-xl font-bold">Tasks</div>
      </div>
    </div>
  );
};

const PrizeLabelValue: FC<PropsWithChildren & { label: string }> = ({
  label,
  children,
}) => {
  return (
    <div className="">
      <p className="text-xs opacity-60">{label}</p>
      <div className={`${plusJakartaSans.className}`}>{children}</div>
    </div>
  );
};

export const PrizeDetails: FC<{ prize: Prize }> = ({ prize }) => {
  return (
    <div className="flex w-72 flex-col gap-4 rounded-3xl bg-[#000] p-5 text-white">
      <PrizeLabelValue label="Total Reward">
        <strong>{fromWei(prize.prizeAmount, prize.decimals)}</strong> $
        {prize.prizeSymbol}
      </PrizeLabelValue>
      <PrizeLabelValue label="Number Of Winners">
        <strong>{prize.winnersCount}</strong> Winners
      </PrizeLabelValue>
      <PrizeLabelValue label="Number Of Enrollment">
        <strong>{prize.numberOfEntries}</strong> Enrolled
      </PrizeLabelValue>

      <LandingButton className="text-black-0 mt-2 bg-landing-primary px-5 py-3">
        CHECK WINNERS
      </LandingButton>
    </div>
  );
};
