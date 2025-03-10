import LandingButton from "@/components/containers/landing/button";
import { Permission, Prize, Token } from "@/types";
import { FC, PropsWithChildren } from "react";
import { Nunito_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { fromWei } from "@/utils";
import Markdown from "react-markdown";
import { IoShareSocialOutline } from "react-icons/io5";
import Link from "next/link";

export type TokenCardProps = { token: Token; isHighlighted?: boolean };

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

export default function TokenCardNew({ token, isHighlighted }: TokenCardProps) {
  return (
    <article
      className={`${nunitoSans.className} overflow-hidden rounded-3xl border ${isHighlighted ? "bg-raffle-card" : "bg-white"} shadow-primary-button`}
    >
      <div className="bg-circle-dots flex flex-wrap items-stretch gap-y-2 p-[2px]">
        <TokenContent token={token} />
        <TokenDetails isHighlighted={isHighlighted} token={token} />
      </div>
    </article>
  );
}

export const ShareButton: FC<{ token: Token }> = ({ token }) => {
  const onShare = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Don't miss your chance to win ${fromWei(token.amount, token.decimals ?? token.chain.decimals)} ${token?.token} on @Unitap_app! 🎉\nEnter now:`,
      )}&url=${encodeURIComponent(
        "dashboard.unitap.app/?hc=" + encodeURIComponent(token.token),
      )}`,
    );
  };

  return (
    <LandingButton
      onClick={onShare}
      className={`ml-3 flex items-center gap-2 bg-landing-primary px-3 py-1 text-sm font-normal shadow-primary-button-sm`}
    >
      <IoShareSocialOutline size={20} />
      Share
    </LandingButton>
  );
};

export const TokenContent: FC<{ token: Token }> = ({ token }) => {
  return (
    <div
      className={`flex flex-1 flex-wrap gap-3 px-4 py-3 sm:flex-nowrap ${nunitoSans.className}`}
    >
      <div className="relative z-20 h-60 w-60 min-w-60 self-center">
        <div className="absolute -inset-[2px] left-0 top-0 -z-10 rotate-[5deg] rounded-xl bg-black-0"></div>
        <div className="rotate-3 rounded-xl border-2 bg-[#E5FFE2]">
          <img
            src={token.image ?? "/assets/images/prize-tap/default-prize.png"}
            alt={token.name}
            // onError={(e) => {
            //   e.currentTarget.src =
            //     "/assets/images/prize-tap/default-prize.png";
            // }}
            width={231}
            height={231}
            className="h-[231px] w-[231px] rounded-xl object-cover"
          />
          <div className="absolute right-0 top-1 grid h-12 w-12 -translate-y-1/2 translate-x-1/2 place-items-center overflow-hidden rounded-full border bg-white shadow-primary-button-sm">
            <img
              width={47}
              height={47}
              src={token.chain.logoUrl}
              alt={token.chain.chainName}
            />
          </div>
        </div>
      </div>

      <div className="h-h-full ml-5 mt-3 flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className={`${plusJakartaSans.className} font-bold`}>
            {token.name}
          </h1>
          <Link href={token.distributorUrl ?? "#"} target="_blank">
            <LandingButton
              className={`ml-3 whitespace-nowrap bg-landing-secondary px-3 py-1 text-sm font-normal shadow-primary-button-sm`}
            >
              <small className="!font-thin">By</small> {token.distributor}
            </LandingButton>
          </Link>
          <ShareButton token={token} />
        </div>
        <div className="mt-5">
          <Markdown className="">{token.notes.slice(0, 300)}</Markdown>
        </div>
        <TokenTasks constraints={token.constraints} />
      </div>
    </div>
  );
};

const TokenTasks: FC<{ constraints: Permission[] }> = ({ constraints }) => {
  if (!constraints.length) return null;

  return (
    <>
      <div className="mt-auto text-xl font-bold">Tasks</div>
      <div className="mb-2 mt-2 flex flex-wrap gap-2">
        {constraints.map((constraint, index) => (
          <LandingButton
            key={index}
            className={`bg-landing-tertiary px-3 py-1 text-sm font-normal shadow-primary-button-sm`}
          >
            {constraint.isReversed && "Not "}
            {constraint.title}
          </LandingButton>
        ))}
      </div>
    </>
  );
};

const TokenLabelValue: FC<PropsWithChildren & { label: string }> = ({
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

export const TokenDetails: FC<{ token: Token; isHighlighted?: boolean }> = ({
  token,
  isHighlighted,
}) => {
  return (
    <div
      className={`${isHighlighted ? "bg-[#000] p-5 text-white" : "bg-gray-full text-black-0"} relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl p-5 md:w-72`}
    >
      <div
        className={`absolute right-0 top-0 w-48 translate-x-1/4 translate-y-1/2 rotate-[40deg] border-b-2 border-t-2 border-black-0 bg-landing-token py-1 text-center font-bold ${isHighlighted ? "text-black-0" : ""}`}
      >
        FCFS
      </div>
      <TokenLabelValue label="Reward Per User">
        <strong>
          {fromWei(token.amount, token.decimals ?? token.chain.decimals)}
        </strong>{" "}
        ${token.token}
      </TokenLabelValue>
      <TokenLabelValue label="Rewarded Users">
        <strong>{token.maxNumberOfClaims}</strong> Winners
      </TokenLabelValue>

      <LandingButton
        disabled
        className="mt-auto bg-landing-primary px-5 py-3 text-black-0"
      >
        FINISHED
      </LandingButton>
    </div>
  );
};
