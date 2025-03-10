import Image from "next/image";
import Filters from "./components/filters";
import SearchInput from "./components/searchInput";

const GasTapLoading = () => {
  return (
    <div>
      <div className="relative mb-5 flex h-[202px] flex-col overflow-hidden rounded-2xl border-4 border-gray20 bg-gray60 p-4 md:flex-row md:justify-between lg:items-end">
        <div className="header-left z-10 flex flex-col items-start">
          <div className="h-12 w-[140px] rounded-lg bg-gray70"></div>
        </div>
        <div className="absolute bottom-0 left-1/2 mt-2 flex h-16 w-68 -translate-x-1/2 flex-col items-center rounded-t-lg bg-gray70 px-4 py-2"></div>

        <div className="mt-2 flex flex-wrap justify-center md:justify-start">
          <div className="claim-stat__claimed flex h-14 items-start gap-x-3 rounded-lg bg-gray70 px-3 py-[2px]">
            <Image
              width={252}
              height={48}
              className="w-full"
              src="/assets/images/gas-tap/dabe-loading.svg"
              alt="faucet loading"
            />
          </div>
        </div>
        <div className="animate-skeleton absolute -top-40 z-10 h-[400px] w-96 rotate-[21.574deg] bg-[#797992] opacity-20 blur-2xl"></div>
      </div>
      <div className="action-bar flex flex-col-reverse items-center justify-between md:flex-row">
        <SearchInput className="w-full sm:w-1/2 md:w-1/3" />
        <Filters />
      </div>
      <div className="mt-4"></div>
      {Array.from(new Array(12)).map((_, key) => (
        <GasCardLoading key={key} />
      ))}
    </div>
  );
};

const GasCardLoading = () => {
  return (
    <div className="relative mt-4 flex w-full flex-col overflow-hidden rounded-xl bg-gray60">
      <div className="flex flex-col justify-between gap-4 py-4 pl-3 pr-6 sm:flex-row">
        <span className="flex w-full items-center justify-center gap-3 sm:justify-start">
          <span className="h-11 w-11 rounded-full bg-gray70"></span>
          <p className="h-6 w-20 rounded-lg bg-gray70"></p>
          <p className="h-5 w-14 rounded-lg bg-gray70"></p>
          <p className="h-5 w-14 rounded-lg bg-gray70"></p>
        </span>
        <span className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-end sm:gap-4">
          <span className="h-11 w-24 rounded-lg bg-gray70"></span>
          <span className="h-11 w-56 rounded-lg border-2 border-gray80 bg-gray70"></span>
        </span>
      </div>
      <div className="flex flex-col items-center justify-between bg-gray50 px-9 py-2.5 sm:flex-row">
        <span className="flex w-full items-center justify-between sm:justify-start">
          <p className="h-5 w-12 rounded-lg bg-gray70"></p>
          <p className="ml-4 h-6 w-24 rounded-lg bg-gray70"></p>
        </span>
        <span className="flex w-full items-center justify-between sm:justify-center">
          <p className="h-5 w-12 rounded-lg bg-gray70"></p>
          <p className="ml-4 h-6 w-24 rounded-lg bg-gray70"></p>
        </span>
        <span className="flex w-full items-center justify-between sm:justify-end">
          <p className="h-5 w-12 rounded-lg bg-gray70"></p>
          <p className="ml-4 h-6 w-24 rounded-lg bg-gray70"></p>
        </span>
      </div>

      <div className="animate-skeleton absolute -top-40 z-10 h-[500px] w-96 rotate-[21.574deg] bg-[#797992] opacity-20 blur-2xl"></div>
    </div>
  );
};

export default GasTapLoading;
