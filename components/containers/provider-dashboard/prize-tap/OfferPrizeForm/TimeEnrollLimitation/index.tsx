import { useEffect, useState } from "react";
import { ErrorProps, ProviderFormPaginationProp } from "@/types";
import StartDateComp from "./components/StartDateComp";
import SetDuration from "./components/SetDuration";
import EndDateComp from "./components/EndDateComp";
import ManualDuration from "./components/ManualDuration";
import PeopleLimitation from "./components/PeopleLimitation";
import BN from "bn.js";
import { toBN, toWei } from "@/utils/numbers";
import Pagination from "../../pagination";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";

export const TimeEnrollLimitationDescription = {
  id: 1,
  prevIcon: "/assets/images/provider-dashboard/step-1-green.svg",
  activeIcon: "/assets/images/provider-dashboard/step-1-active.svg",
  nextIcon: "/assets/images/provider-dashboard/step-1-off.svg",
  title: "Time/Enrollment Limitation",
  description: "Information of time and enrollment ",
};

const TimeEnrollLimitation = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    page,
    canGoStepThree,
    setDuration,
    data,
    handleChange,
    isShowingDetails,
  } = usePrizeOfferFormContext();
  const [showErrors, setShowErrors] = useState<ErrorProps | null>(null);
  const [fadeClass, setFadeClass] = useState("");

  useEffect(() => {
    setFadeClass(page == 1 ? "animate-fadeIn" : "animate-fadeOut");
  }, [page]);

  const [winnerCountError, setWinnerCountError] = useState({
    status: false,
    message: "",
  });

  useEffect(() => {
    if (data.winnersCount <= 0 || !data.winnersCount) {
      setWinnerCountError({
        status: true,
        message: "Required",
      });
    } else if (
      data.winnersCount > 0 &&
      Math.floor(data.winnersCount) != data.winnersCount
    ) {
      setWinnerCountError({
        status: true,
        message: "Invalid Input",
      });
    } else {
      setWinnerCountError({
        status: false,
        message: "",
      });
    }
  }, [data.winnersCount]);

  const handleNextPage = () => {
    if (isShowingDetails) {
      setShowErrors(null);
      handleChangeFormPageNext();
      return;
    }
    const res: any = canGoStepThree();
    if (
      res.endDateStatus &&
      res.startDateStatus &&
      res.numberOfDurationStatus &&
      res.maximumLimitationStatus &&
      res.numberOfWinnersStatus
    ) {
      setShowErrors(null);
      handleChangeFormPageNext();
    } else {
      setShowErrors(res);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full animate-fadeIn ${fadeClass}`}
    >
      <div
        className={`flex flex-col min-h-[340px] gap-5 w-full items-center max-w-[452px] ${
          setDuration ? "mb-[57px]" : "mb-[84px]"
        }`}
      >
        <StartDateComp showErrors={showErrors} />
        <SetDuration />
        {!setDuration ? (
          <EndDateComp showErrors={showErrors} />
        ) : (
          <ManualDuration showErrors={showErrors} />
        )}
        <PeopleLimitation showErrors={showErrors} />
        {/* <section className="w-full relative">
					<div
						className={` flex relative gap-2 text-gray80 text-[12px] ${
							winnerCountError.status ? 'border-error' : 'border-gray50'
						} bg-gray40 border  rounded-xl h-[43px] pr-4 items-center justify-between overflow-hidden w-full max-w-[452px]`}
					>
						<div className="bg-gray30 flex h-full w-full max-w-[148px] items-center items-center justify-center">
							<p>Number of Winners</p>
						</div>
						<input
							name="winnersCount"
							value={data.isNft ? data.nftTokenIds?.length : data.winnersCount}
							className="provider-dashboard-input"
							type="number"
							onChange={handleChange}
							min={1}
							disabled={isShowingDetails || data.isNft}
							step={1}
							pattern="[0-9]*"
						/>
					</div>
					<div className={`text-gray90 text-[12px] w-full mt-[8px] font-semibold min-h-[18px]`}>
						{data.winnersCount && Math.floor(data.winnersCount) == data.winnersCount && data.winnersCount > 0 && (
							<p>
								Each winner can win{' '}
								{data.isNft
									? 1
									: Number(data.winnersCount)
									? Number(data.tokenAmount) / Number(data.winnersCount)
									: Number(data.tokenAmount)}
								<span>
									{' '}
									{data.isNft ? data.nftName : data.isNativeToken ? data.selectedChain.symbol : data.tokenName}
								</span>
							</p>
						)}
					</div>
					{winnerCountError.status && (
						<p className="text-error text-[10px] m-0 p-0 absolute left-1 bottom-2">{winnerCountError.message}</p>
					)}
				</section> */}
      </div>
      <Pagination
        handleChangeFormPagePrev={handleChangeFormPagePrev}
        handleNextPage={handleNextPage}
        page={page}
      />
    </div>
  );
};

export default TimeEnrollLimitation;
