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
import useScrollToTop from "@/utils/hooks/scrollTop";

interface FromProp {
  detailDistributionPk?: string | undefined;
  verificationDistributePK?: string | undefined;
}

const OfferTokenForm = ({
  detailDistributionPk,
  verificationDistributePK,
}: FromProp) => {
  const {
    handleCheckForReason,
    handleShowUserDetails,
    page,
    setPage,
    userDistribution,
  } = useTokenTapFromContext();

  useScrollToTop()

  const { display, prevPage } = usePagination(page, setPage, tokenTapForms);

  useEffect(() => {
    if (!userDistribution) {
      return;
    }
    if (detailDistributionPk) handleShowUserDetails(userDistribution);
    if (verificationDistributePK) handleCheckForReason(userDistribution);
  }, [detailDistributionPk, userDistribution]);

  return (
    <div className="flex flex-col md:flex-row gap-5 select-none">
      <DisplaySteps page={page} displaySteps={TokenTapDisplaySteps} />
      <div className="offerPrize-form relative bg-gray20 w-full rounded-xl py-[4em] min-h-[504px] flex flex-col items-center px-5">
        {page >= 1 && page < 5 && (
          <Icon
            onClick={prevPage}
            className="absolute text-white text-xl top-5 left-5 cursor-pointer select-not"
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
