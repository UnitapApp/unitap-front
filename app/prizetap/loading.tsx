import Icon from "@/components/ui/Icon";

const PrizeTapLoading = () => {
  return (
    <div>
      <div className="bg-gray60 h-[202px] rounded-2xl flex flex-col md:flex-row lg:items-end md:justify-between overflow-hidden relative p-4 mb-5 border-3 border-gray70">
        <div className="header-left z-10 flex flex-col items-start">
          <div className="h-12 w-[140px] bg-gray70 rounded-lg"></div>
          <div className="mt-3 h-4 rounded-lg w-[240px] bg-gray70"></div>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start mt-2">
          <div className="rounded-lg bg-gray70 py-[2px] px-3 items-center h-14 flex gap-x-3">
            <img
              className="w-full"
              src="/assets/images/prize-tap/daimond-ticket.svg"
              alt="loading"
            />
            <div className="ml-16"></div>
          </div>
        </div>
        <div className="absolute w-96 h-[400px] animate-skeleton -top-40 z-10 opacity-20 rotate-[21.574deg] blur-2xl bg-[#797992]"></div>
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
      <div className="absolute rounded-2xl inset-0 left-6 overflow-hidden">
        <div className="absolute w-96 h-[500px] animate-skeleton -top-40 z-20 opacity-20 rotate-[21.574deg] blur-2xl bg-[#797992]"></div>
      </div>
      <div className="relative z-10">
        <div className="absolute z-20 right-5 top-5 flex gap-x-6 items-center">
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
        <div className="absolute left-0 -top-5 -z-10 -bottom-5 rounded-lg bg-gray20 w-100"></div>
        <div className="flex gap-6">
          <div className="relative border-2 border-gray40 bg-gray60 ml-6 rounded-lg w-[220px]">
            <div className="absolute bottom-0 translate-y-1/2 bg-gray40 border-2 left-1/2 -translate-x-1/2 border-gray70 rounded-lg h-6 w-24"></div>
          </div>
          <div className="bg-gray60 border-2 p-4 border-gray40 flex-1 rounded-2xl relative overflow-hidden">
            <div className="h-5 w-52 rounded-lg bg-gray70"></div>
            <div className="h-4 w-24 mt-3 rounded-lg bg-gray70"></div>
            <div className="mr-16 mt-3">
              <div className="h-5 w-full rounded-lg bg-gray70"></div>
            </div>

            <div
              className={`flex mt-3 items-center flex-wrap text-xs gap-2 text-white`}
            >
              {Array.from(new Array(6)).map((_, key) => (
                <div
                  className="bg-gray70 w-28 h-6 px-3 py-2 rounded-lg"
                  key={key}
                ></div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <div className="bg-gray70 flex-1 h-12 px-3 py-2 rounded-lg"></div>
              <div className="bg-gray70 w-64 border-2 border-gray80 h-12 px-3 py-2 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeTapLoading;
