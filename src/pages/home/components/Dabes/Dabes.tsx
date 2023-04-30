import React, { useContext } from "react";
import { ClaimContext } from "../../../../hooks/useChainList";
import { ClaimReceiptState } from "../../../../types";
import Icon from "../../../../components/basic/Icon/Icon";
import { range } from "../../../../utils";

const Dabes = () => {
  const { activeClaimHistory } = useContext(ClaimContext);
  const { openClaimModal } = useContext(ClaimContext);

  return (
    <div className="claim-stat__claimed rounded-lg border-2 border-gray80 bg-primaryGradient py-[2px] px-3 flex gap-x-3">
      <>
        {activeClaimHistory
          .filter((claim) => claim.status !== ClaimReceiptState.REJECTED)
            .map((claim) => {
              return (
                <Icon
                  onClick={() => openClaimModal(claim.chain.pk)}
              key={claim.chain.chainId}
              iconSrc={claim.chain.gasImageUrl || claim.chain.logoUrl}
              className={`cursor-pointer transition ${claim.status === ClaimReceiptState.PENDING && 'animated-dabe'}`}
              width="36px"
              height="40px"
                />
            );
            })}
  {range(0, 5 - activeClaimHistory.filter((claim) => claim.status !== ClaimReceiptState.REJECTED).length).map(
    (i) => {
      return <Icon key={i} iconSrc="assets/images/gas-tap/empty-dabe.svg" width="36px" height="auto" />;
    },
  )}
  </>
  </div>
);
};

export default Dabes;
