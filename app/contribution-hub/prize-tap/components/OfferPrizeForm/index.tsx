"use client";

import DisplaySteps from "../../../DisplaySteps";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";
import { useEffect, useState } from "react";
import { usePagination } from "@/utils/hooks/contributionPagInation";
import {
  PrizeTapDisplaySteps,
  prizeTapForms,
} from "@/app/contribution-hub/constants/forms";
import { usePreventNavigation } from "@/utils/hooks/refresh";

interface FromProp {
  detailRafflePk?: string | undefined;
  verificationRafflePK?: string | undefined;
}

const OfferPrizeForm = ({ detailRafflePk, verificationRafflePK }: FromProp) => {
  const {
    userRaffle,
    handleCheckForReason,
    handleShowUserDetails,
    page,
    setPage,
    data,
  } = usePrizeOfferFormContext();

  const isFormFilled =
    !detailRafflePk &&
    !verificationRafflePK &&
    (data.selectedChain ||
      data.provider ||
      data.tokenContractAddress ||
      data.nftContractAddress ||
      data.description);

  usePreventNavigation(
    process.env.NODE_ENV === "development" ? false : isFormFilled,
    "You have unsaved changes. Refreshing the page may result in data loss."
  );

  const { display, prevPage } = usePagination(page, setPage, prizeTapForms);

  useEffect(() => {
    if (!userRaffle) {
      return;
    }
    if (detailRafflePk) handleShowUserDetails(userRaffle);
    if (verificationRafflePK) handleCheckForReason(userRaffle);
  }, [detailRafflePk, userRaffle]);

  return (
    <div className="flex flex-col md:flex-row gap-5 select-none">
      <DisplaySteps page={page} displaySteps={PrizeTapDisplaySteps} />
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
