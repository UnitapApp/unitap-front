"use client";

import { Prize } from "@/types";
import { FC } from "react";
import RafflePermissions from "../../permissions";
import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { shortenAddress } from "@/utils";
import Link from "next/link";
import WalletAddress from "../wallet-address";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { Text } from "@/components/ui/text.style";
import { useWalletAccount } from "@/utils/wallet";
import { DropIconWrapper } from "@/components/containers/modals/claimModal.style";
import PrizeRequirementModal from "./RaffleRequirementModal";
import SuccessBody from "./SuccessBody";

const InitialBody: FC<{
  raffle: Prize;
  method: string;
}> = ({ method, raffle }) => {
  const { address, isConnected } = useWalletAccount();

  // const tokenImgLink: string = raffle.isPrizeNft
  //   ? `https://ipfs.io/ipfs/QmYmSSQMHaKBByB3PcZeTWesBbp3QYJswMFZYdXs1H3rgA/${
  //       Number(raffle.tokenUri.split("/")[3]) + 1
  //     }.png`
  //   : "";

  const {
    claimOrEnrollWalletResponse,
    claimOrEnrollSignatureLoading,
    handleEnroll,
    claimOrEnrollLoading,
    closeEnrollModal,
    selectedRaffleForEnroll,
    handleClaimPrize,
  } = usePrizeTapContext();

  if (claimOrEnrollWalletResponse?.state === "Done")
    return <SuccessBody method={method!} raffle={selectedRaffleForEnroll!} />;

  // if (method === "Enroll") {
  //   return (
  //     <>
  //       <DropIconWrapper data-testid={`chain-claim-initial-${raffle.chain.pk}`}>
  //         <Icon
  //           className="chain-logo z-10 mb-10 mt-14"
  //           width="auto"
  //           height="110px"
  //           iconSrc={raffle.imageUrl}
  //           alt=""
  //         />
  //       </DropIconWrapper>
  //       {claimOrEnrollSignatureLoading ? (
  //         <p className="my-4 mb-6 px-3 text-center text-sm text-white">
  //           Preparing your Enroll signature...
  //         </p>
  //       ) : claimOrEnrollWalletResponse?.state === "Retry" ? (
  //         <p className="my-4 mb-6 px-3 text-center text-sm text-white">
  //           {claimOrEnrollWalletResponse?.message}
  //         </p>
  //       ) : (
  //         <div className="text-left text-white"></div>
  //       )}
  //       <div className="text-left text-white">
  //         <p className="mb-2 text-xs">
  //           You will need to sign a wallet transaction and pay a small gas fee
  //           to claim tokens.
  //         </p>
  //         <p className="mb-6 text-xs">
  //           If you do not have sufficient gas, please visit{" "}
  //           <Link
  //             className="text-blue-500"
  //             href={"/gastap?hc=" + raffle.chain.chainName}
  //           >
  //             Gas Tap
  //           </Link>
  //           .
  //         </p>
  //       </div>
  //       <Text width="100%" fontSize="14">
  //         Wallet Address
  //       </Text>
  //       <WalletAddress fontSize="12">
  //         {isConnected ? shortenAddress(address) : ""}
  //       </WalletAddress>
  //       {!raffle.userEntry?.txHash ? (
  //         <ClaimButton
  //           onClick={() => handleEnroll()}
  //           $width="100%"
  //           disabled={claimOrEnrollLoading}
  //           $fontSize="16px"
  //           className="!w-full disabled:opacity-60"
  //           data-testid={`chain-claim-action-${raffle.chain.pk}`}
  //         >
  //           {claimOrEnrollLoading ? (
  //             <p>Enrolling...</p>
  //           ) : claimOrEnrollSignatureLoading ? (
  //             <p>Preparing...</p>
  //           ) : claimOrEnrollWalletResponse?.state === "Retry" ? (
  //             <p>Retry</p>
  //           ) : (
  //             <p>Enroll</p>
  //           )}
  //         </ClaimButton>
  //       ) : (
  //         <ClaimButton
  //           onClick={() => closeEnrollModal()}
  //           $width="100%"
  //           $fontSize="16px"
  //           className="!w-full"
  //           data-testid={`chain-claim-action-${raffle.chain.pk}`}
  //         >
  //           Enrolled
  //         </ClaimButton>
  //       )}
  //     </>
  //   );
  // }

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-initial-${raffle.chain.pk}`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={raffle.image}
          alt=""
        />
      </DropIconWrapper>
      {claimOrEnrollSignatureLoading ? (
        <p className="my-4 mb-6 px-3 text-center text-sm text-white">
          Preparing your Claim prize signature...
        </p>
      ) : claimOrEnrollWalletResponse?.state === "Retry" ? (
        <p className="my-4 mb-6 px-3 text-center text-sm text-white">
          {claimOrEnrollWalletResponse?.message}
        </p>
      ) : (
        <div className="text-left text-white"></div>
      )}
      <Text width="100%" fontSize="14">
        Wallet Address
      </Text>
      <WalletAddress fontSize="12">
        {isConnected ? shortenAddress(address) : ""}
      </WalletAddress>
      <ClaimButton
        onClick={() => handleClaimPrize()}
        $width="100%"
        disabled={claimOrEnrollSignatureLoading || claimOrEnrollLoading}
        $fontSize="16px"
        className="!w-full"
        data-testid={`chain-claim-action-${raffle.chain.pk}`}
      >
        {claimOrEnrollLoading ? (
          <p>Claiming Prize...</p>
        ) : claimOrEnrollSignatureLoading ? (
          <p>Preparing...</p>
        ) : claimOrEnrollWalletResponse?.state === "Retry" ? (
          <p>Retry</p>
        ) : (
          <p>Claim Prize</p>
        )}
      </ClaimButton>
    </>
  );
};

export default InitialBody;
