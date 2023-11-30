"use client";

import PrizeInfo from "./PrizeInfo";
import TimeEnrollLimitation from "./TimeEnrollLimitation";
import Requirements from "./Requirements";
import ContactInformation from "./ContactInformation";
import DepositPrize from "./DepositPrize";
import InformationVerification from "./InformationVerification";
import DisplaySteps from "./DisplaySteps";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";

export const usePagination = () => {
  const { page, setPage } = usePrizeOfferFormContext();

  const nextPage = () => page <= 5 && setPage(page + 1);

  const prevPage = () => page > 0 && setPage(page - 1);

  const Form = getForm(page);

  const display = (
    <Form
      handleChangeFormPagePrev={prevPage}
      handleChangeFormPageNext={nextPage}
    />
  );

  return { page, display, prevPage };
};

const getForm = (page: number) =>
  [
    PrizeInfo,
    TimeEnrollLimitation,
    Requirements,
    ContactInformation,
    DepositPrize,
    InformationVerification,
  ][page];

const OfferPrizeForm = () => {
  const { page, display, prevPage } = usePagination();

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <DisplaySteps page={page} />
      <div className="offerPrize-form relative bg-gray20 w-full rounded-xl py-[4em] min-h-[504px] flex flex-col items-center px-5">
        {page >= 1 && page < 5 && (
          <Icon
            onClick={prevPage}
            className="absolute text-white text-[20px] top-5 left-5 cursor-pointer select-not"
            iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          />
        )}
        <div className="w-full flex  justify-center min-h-[320px]">
          {display}
        </div>
      </div>
    </div>
  );
};

export default OfferPrizeForm;
