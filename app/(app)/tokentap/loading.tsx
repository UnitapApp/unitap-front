import Icon from "@/components/ui/Icon";
import Image from "next/image";
import SearchInput from "../gastap/components/searchInput";

const TokenTapLoading = () => {
  return (
    <div>
      <div className="relative mb-5 flex h-[202px] flex-col overflow-hidden rounded-2xl border-4 border-gray20 bg-gray60 p-4 md:flex-row md:justify-between lg:items-end">
        <div className="header-left z-10 flex flex-col items-start">
          <div className="h-12 w-[140px] rounded-lg bg-gray70"></div>
          <div className="mt-2 h-5 w-[240px] rounded-lg bg-gray70"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 mt-2 flex h-16 w-68 -translate-x-1/2 flex-col items-center rounded-t-lg bg-gray70 px-4 py-2"></div>

        <div className="mt-2 flex justify-center md:justify-start">
          <div className="claim-stat__claimed flex gap-x-3 rounded-lg bg-gray70 px-3 py-[2px]">
            <Image
              width={156}
              height={48}
              src="/assets/images/token-tap/coins-loading.svg"
              alt="loading"
            />
          </div>
        </div>
        <div className="animate-skeleton absolute -top-40 z-10 h-[500px] w-96 rotate-[21.574deg] bg-[#797992] opacity-20 blur-2xl"></div>
      </div>
      <div className="action-bar flex flex-col-reverse items-center justify-between md:flex-row">
        <SearchInput className="w-full sm:w-1/2 md:w-1/3" />
      </div>
      <div className="mt-4"></div>
      {Array.from(new Array(12)).map((_, key) => (
        <TokenCardLoading key={key} />
      ))}
    </div>
  );
};

const TokenCardLoading = () => {
  return (
    <div className="relative mt-4 flex w-full flex-col overflow-hidden rounded-xl bg-gray60">
      <div className="flex flex-col justify-between gap-4 pl-3 pr-6 pt-4 sm:flex-row">
        <span className="flex w-full items-start justify-center gap-3 sm:justify-start">
          <span className="h-11 w-11 rounded-full bg-gray70"></span>
          <div className="flex flex-col gap-3">
            <p className="h-5 w-72 max-w-full rounded-lg bg-gray70"></p>
            <p className="h-4 w-40 rounded-lg bg-gray70"></p>
          </div>
        </span>

        <span className="flex w-full flex-col items-start gap-2 sm:flex-row sm:justify-end sm:gap-4">
          <span className="h-11 w-24 rounded-lg bg-gray70"></span>
          <span className="h-11 w-56 rounded-lg border-2 border-gray80 bg-gray70"></span>
        </span>
      </div>

      <div className="py-2 pl-16 pr-6">
        <p className="h-4 w-full rounded-lg bg-gray70"></p>
        <p className="mt-3 h-3 w-88 max-w-full rounded-lg bg-gray70"></p>
        <div
          className={`mt-3 flex flex-wrap items-center gap-2 py-3 text-xs text-white`}
        >
          {Array.from(new Array(7)).map((_, key) => (
            <div
              className="h-6 w-28 rounded-lg bg-gray70 px-3 py-2"
              key={key}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-gray50 px-9 sm:flex-row">
        <span className="flex w-full items-center justify-between sm:justify-center">
          <div className="ml-auto h-full bg-gray40 px-6 py-2.5">
            <p className="h-5 w-32 rounded-lg bg-gray70"></p>
          </div>
          <div className="ml-auto flex items-center gap-x-6">
            <Icon
              className="cursor-pointer"
              iconSrc="/assets/images/token-tap/twitter-icon.svg"
              width="auto"
              height="20px"
            />
            <Icon
              className="cursor-pointer"
              iconSrc="/assets/images/token-tap/discord-icon.svg"
              width="auto"
              height="20px"
            />
          </div>
        </span>
      </div>

      <div className="animate-skeleton absolute -top-40 z-10 h-[500px] w-96 rotate-[21.574deg] bg-[#797992] opacity-20 blur-2xl"></div>
    </div>
  );
};

export default TokenTapLoading;
