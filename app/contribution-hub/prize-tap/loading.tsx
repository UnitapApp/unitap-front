const PrizeTapLoading = () => {
  return (
    <div className="min-h-[600px]">
      <div className="mt-5 grid grid-cols-1 items-center justify-center gap-5 text-gray100 md:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <article className="animate-pulse">
      <div className="relative h-[512px] w-full select-none rounded-xl border-2 border-gray40 bg-gray30 p-4">
        <div className="providePrize-item-container">
          <div className="providePrize__amountBox relative flex h-[288px] flex-col items-center justify-center rounded-2xl border border-gray40 bg-gray20">
            <div className="providePrize__chainName absolute top-0 mt-2 flex h-[22px] w-full max-w-[100px] items-center justify-center rounded-md border border-gray70 bg-gray50 py-1"></div>
          </div>
          <div>
            <div className="providePrize_stats my-2 flex justify-between">
              <div className="h-[20px] w-1/3 rounded bg-gray50 text-sm font-medium text-white"></div>
              <div className="h-[20px] w-1/3 rounded bg-gray50 text-sm font-medium text-white"></div>
            </div>
            <div className="providePrize_creator mt-5 h-[20px] w-1/3 bg-gray50 text-xs font-medium text-gray90"></div>
          </div>

          <div className="absolute bottom-3 left-0 right-4">
            <div className=" absolute bottom-3 left-4 right-4 h-[40px] w-[95%] rounded-xl bg-gray50"></div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PrizeTapLoading;
