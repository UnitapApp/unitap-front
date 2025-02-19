import LandingButton from "@/components/containers/landing/button";
import { Permission, Prize } from "@/types";
import { FC, PropsWithChildren } from "react";
import { Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { fromWei } from "@/utils";
import Markdown from "react-markdown";
import { IoShareSocialOutline } from "react-icons/io5";
import Link from "next/link";
import { usePrizeTapContext } from "@/context/prizeTapProvider";

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
      <div className="bg-circle-dots flex md:flex-nowrap flex-wrap items-stretch gap-y-2 p-[2px]">
        <PrizeContent prize={prize} />
        <PrizeDetails prize={prize} />
      </div>
    </article>
  );
}

export const ShareButton: FC<{ prize: Prize }> = ({ prize }) => {
  const onShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `I've just claimed ${fromWei(prize.prizeAmount, prize.decimals)} ${prize?.prizeSymbol} from @Unitap_app 🔥\nClaim yours:`,
      )}&url=${encodeURIComponent(
        "dashboard.unitap.app/?hc=" + encodeURIComponent(prize.name),
      )}`,
    );
  };

  return (
    <LandingButton
      onClick={onShare}
      className={`shadow-primary-button-sm ml-3 flex items-center gap-2 bg-landing-primary px-3 py-1 text-sm font-normal`}
    >
      <IoShareSocialOutline size={20} />
      Share
    </LandingButton>
  );
};


export const PrizeContent: FC<{ prize: Prize }> = ({ prize }) => {
  return (
    <div
      className={`flex flex-1 flex-wrap items-start gap-3 px-4 py-3 sm:flex-nowrap ${nunitoSans.className}`}
    >
      <div className="relative z-20 h-60 w-60 min-w-60">
        <div className="bg-black-0 absolute -inset-[2px] left-0 top-0 -z-10 rotate-[5deg] rounded-xl"></div>
        <div className="rotate-3 rounded-xl border-2 bg-[#E5FFE2]">
          <img
            src={
              // prize.image ??
              "/assets/images/prize-tap/default-prize.png"
            }
            alt={prize.name}
            onError={(e) => {
              e.currentTarget.src =
                "/assets/images/prize-tap/default-prize.png";
            }}
            width={231}
            height={231}
            className="h-[231px] w-[231px] rounded-xl object-cover"
          />
        </div>
      </div>

      <div className="ml-5 mt-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className={`${plusJakartaSans.className} font-bold`}>
            {prize.name}
          </h1>
          <Link href={prize.creatorUrl ?? "#"} target="_blank">
            <LandingButton
              className={`shadow-primary-button-sm ml-3 bg-landing-secondary px-3 py-1 text-sm font-normal whitespace-nowrap`}
            >
              <small className="!font-thin">By</small> {prize.creatorName}
            </LandingButton>
          </Link>
          <ShareButton prize={prize} />
        </div>
        <div className="mt-5">
          <Markdown className="markdown">{prize.description}</Markdown>
        </div>
        <PrizeTasks constraints={prize.constraints} />
      </div>
    </div>
  );
};

const PrizeTasks: FC<{ constraints: Permission[] }> = ({ constraints }) => {
  if (!constraints.length) return null;

  return (
    <>
      <div className="mt-5 text-xl font-bold">Tasks</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {constraints.map((constraint, index) => (
          <LandingButton
            key={index}
            className={`bg-landing-tertiary shadow-primary-button-sm px-3 py-1 text-sm font-normal`}
          >
            {constraint.isReversed && "Not "}
            {constraint.title}
          </LandingButton>
        ))}
      </div>
    </>
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
  const { openEnrollModal } = usePrizeTapContext()
  return (
    <div className="relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl bg-[#000] p-5 text-white md:w-72">
      <div className="bg-landing-raffle text-black-0 absolute right-0 top-0 w-48 translate-x-1/4 translate-y-full rotate-[40deg] py-1 text-center font-bold">
        Raffle
      </div>
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

      <LandingButton onClick={() => openEnrollModal(prize, "Winners")} className="text-black-0 mt-2 bg-landing-primary px-5 py-3">
        CHECK WINNERS
      </LandingButton>
    </div>
  );
};
