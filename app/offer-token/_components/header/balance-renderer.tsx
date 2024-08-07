const BalanceRenderer = () => {
  return (
    <div className="background-dashboard rounded-4xl flex items-center justify-between gap-4 border-2 border-gray60 p-9">
      <div>
        <p className="text-gray90">Your Balance in UXP</p>
        <p className="mt-1 font-semibold text-white">
          256{" "}
          <span className="bg-g-primary bg-clip-text text-transparent">
            UXP
          </span>
        </p>
      </div>

      <button className="button-primary rounded-2xl px-10 py-4 font-semibold text-black">
        Deposit More
      </button>
    </div>
  );
};

export default BalanceRenderer;
