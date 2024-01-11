"use client";

import DisplaySteps from "../../../DisplaySteps";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";
import { useEffect } from "react";
import { usePagination } from "@/utils/hooks/contributionPagInation";
import {
  TokenTapDisplaySteps,
  tokenTapForms,
} from "@/app/contribution-hub/constants/forms";

interface FromProp {
  detailRafflePk?: string | undefined;
  verificationRafflePK?: string | undefined;
}

const OfferTokenForm = ({ detailRafflePk, verificationRafflePK }: FromProp) => {
  const { handleCheckForReason, handleShowUserDetails, page, setPage } =
    useTokenTapFromContext();

  const { display, prevPage } = usePagination(page, setPage, tokenTapForms);

  // useEffect(() => {
  //   if (!userRaffle) {
  //     return;
  //   }
  //   if (detailRafflePk) handleShowUserDetails(userRaffle);
  //   if (verificationRafflePK) handleCheckForReason(userRaffle);
  // }, [detailRafflePk, userRaffle]);

  return (
    <div className="flex flex-col md:flex-row gap-5 select-none">
      <DisplaySteps page={page} displaySteps={TokenTapDisplaySteps} />
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

export default OfferTokenForm;
