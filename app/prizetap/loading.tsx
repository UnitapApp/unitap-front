import Icon from "@/components/ui/Icon";
import Image from "next/image";

const PrizeTapLoading = () => {
  return (
    <div>
      <div className="relative mb-5 flex h-[202px] flex-col overflow-hidden rounded-2xl border-3 border-gray70 bg-gray60 p-4 md:flex-row md:justify-between lg:items-end">
        <div className="header-left z-10 flex flex-col items-start">
          <div className="h-12 w-[140px] rounded-lg bg-gray70"></div>
          <div className="mt-3 h-4 w-[240px] rounded-lg bg-gray70"></div>
        </div>

        <div className="mt-2 flex flex-wrap justify-center md:justify-start">
          <div className="flex h-14 items-center gap-x-3 rounded-lg bg-gray70 px-3 py-[2px]">
            <Image
              width={37}
              height={33}
              className="w-full"
              src="/assets/images/prize-tap/daimond-ticket.svg"
              alt="loading"
            />
            <div className="ml-16"></div>
          </div>
        </div>
        <div className="animate-skeleton absolute -top-40 z-10 h-[400px] w-96 rotate-[21.574deg] bg-[#797992] opacity-20 blur-2xl"></div>
      </div>
      <div className="mt-10"></div>
      {Array.from(new Array(7)).map((_, key) => (
        <PrizeCardLoading key={key} />
      ))}
    </div>
  );
};

const PrizeCardLoading = () => {
  return (
    <div className="relative mb-16">
      <div className="absolute inset-0 left-6 overflow-hidden rounded-2xl">
        <div className="animate-skeleton absolute -top-40 z-20 h-[500px] w-96 rotate-[21.574deg] bg-[#797992] opacity-20 blur-2xl"></div>
      </div>
      <div className="relative z-10">
        <div className="absolute right-5 top-5 z-20 flex items-center gap-x-6">
          <Icon
            className="opacity-40"
            iconSrc="/assets/images/token-tap/twitter-icon.svg"
            width="auto"
            height="20px"
          />
          <Icon
            className="opacity-40"
            iconSrc="/assets/images/token-tap/discord-icon.svg"
            width="auto"
            height="20px"
          />
        </div>
        <div className="absolute -bottom-5 -top-5 left-0 -z-10 w-100 rounded-lg bg-gray20"></div>
        <div className="flex gap-6">
          <div className="relative ml-6 w-[220px] rounded-lg border-2 border-gray40 bg-gray60">
            <div className="absolute bottom-0 left-1/2 h-6 w-24 -translate-x-1/2 translate-y-1/2 rounded-lg border-2 border-gray70 bg-gray40"></div>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl border-2 border-gray40 bg-gray60 p-4">
            <div className="h-5 w-52 rounded-lg bg-gray70"></div>
            <div className="mt-3 h-4 w-24 rounded-lg bg-gray70"></div>
            <div className="mr-16 mt-3">
              <div className="h-5 w-full rounded-lg bg-gray70"></div>
            </div>

            <div
              className={`mt-3 flex flex-wrap items-center gap-2 text-xs text-white`}
            >
              {Array.from(new Array(6)).map((_, key) => (
                <div
                  className="h-6 w-28 rounded-lg bg-gray70 px-3 py-2"
                  key={key}
                ></div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="h-12 flex-1 rounded-lg bg-gray70 px-3 py-2"></div>
              <div className="h-12 w-64 rounded-xl border-2 border-gray80 bg-gray70 px-3 py-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTapLoading;
