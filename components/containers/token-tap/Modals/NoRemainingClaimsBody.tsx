"use client";

import Icon from "@/components/ui/Icon";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { ClaimReceiptState } from "@/types";

const NotRemainingClaimsBody = () => {
  const { claimedTokensList, closeClaimModal } = useTokenTapContext();

  return (
    <div className="flex w-full flex-col items-center justify-center pt-2 text-white">
      <div className="claim-stat__claimed mt-20 flex gap-x-3 rounded-lg border-2 border-gray80 bg-primaryGradient px-3 py-[2px]">
        {claimedTokensList
          .filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
          .map((claim, key) => {
            return (
              <Icon
                key={key}
                iconSrc={claim.tokenDistribution.image}
                className={`rounded-full ${
                  claim.status === ClaimReceiptState.PENDING && "animated-dabe"
                }`}
                width="36px"
                height="40px"
              />
            );
          })}
      </div>
      <div className="mt-10 text-center text-gray100">
        {"You've"} reached your claim limit for now
      </div>

      <button
        onClick={closeClaimModal}
        className="mt-10 w-full rounded-xl border-2 border-gray50 bg-gray10 py-3 font-normal text-gray100"
      >
        Close
      </button>
    </div>
  );
};

export default NotRemainingClaimsBody;
