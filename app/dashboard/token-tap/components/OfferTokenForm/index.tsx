"use client";

import DisplaySteps from "../../../components/DisplaySteps";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";
import { useEffect } from "react";
import { usePagination } from "@/utils/hooks/contributionPagInation";
import {
  TokenTapDisplaySteps,
  tokenTapForms,
} from "@/app/dashboard/constants/forms";
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

  useScrollToTop();

  const { display, prevPage } = usePagination(page, setPage, tokenTapForms);

  useEffect(() => {
    if (!userDistribution) {
      return;
    }
    if (detailDistributionPk) handleShowUserDetails(userDistribution);
    if (verificationDistributePK) handleCheckForReason(userDistribution);
  }, [detailDistributionPk, userDistribution]);

  return (
    <div className="flex select-none flex-col gap-5 md:flex-row">
      <DisplaySteps page={page} displaySteps={TokenTapDisplaySteps} />
      <div className="offerPrize-form relative flex min-h-[504px] w-full flex-col items-center rounded-xl bg-gray20 px-5 py-[4em]">
        {page >= 1 && page < 5 && (
          <Icon
            onClick={prevPage}
            className="absolute left-5 top-5 cursor-pointer select-none text-xl text-white"
            iconSrc="/assets/images/provider-dashboard/arrow-left.svg"
          />
        )}
        <div className="flex min-h-[320px] w-full justify-center">
          {display}
        </div>
      </div>
    </div>
  );
};

export default OfferTokenForm;
