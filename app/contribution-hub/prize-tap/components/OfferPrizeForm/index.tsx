"use client";

import DisplaySteps from "../../../components/DisplaySteps";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";
import { useEffect, useState } from "react";
import { usePagination } from "@/utils/hooks/contributionPagInation";
import {
  PrizeTapDisplaySteps,
  prizeTapForms,
} from "@/app/contribution-hub/constants/forms";
import { usePreventNavigation } from "@/utils/hooks/refresh";
import useScrollToTop from "@/utils/hooks/scrollTop";

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
    "You have unsaved changes. Refreshing the page may result in data loss.",
  );

  useScrollToTop();

  const { display, prevPage } = usePagination(page, setPage, prizeTapForms);

  useEffect(() => {
    if (!userRaffle) {
      return;
    }
    if (detailRafflePk) handleShowUserDetails(userRaffle);
    if (verificationRafflePK) handleCheckForReason(userRaffle);
  }, [detailRafflePk, userRaffle]);

  return (
    <div className="flex select-none flex-col gap-5 md:flex-row">
      <DisplaySteps page={page} displaySteps={PrizeTapDisplaySteps} />
      <div className="offerPrize-form relative flex min-h-[504px] w-full flex-col items-center rounded-xl bg-gray20 px-5 py-[4em]">
        {page >= 1 && page < 5 && (
          <Icon
            onClick={prevPage}
            className="select-not absolute left-5 top-5 cursor-pointer text-xl text-white"
            iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          />
        )}
        <div className="flex min-h-[320px]  w-full justify-center">
          {display}
        </div>
      </div>
    </div>
  );
};

export default OfferPrizeForm;
