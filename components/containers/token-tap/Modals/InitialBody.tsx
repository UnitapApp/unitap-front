import { ClaimButton } from "@/components/ui/Button/button";
import Icon from "@/components/ui/Icon";
import { shortenAddress } from "@/utils";
import Link from "next/link";
import { Text } from "@/components/ui/text.style";
import { useWalletAccount, useWalletNetwork } from "@/utils/wallet";
import { FC } from "react";
import { Token } from "@/types";
import { useTokenTapContext } from "@/context/tokenTapProvider";
import { DropIconWrapper } from "../../modals/claimModal.style";
import WalletAddress from "@/app/prizetap/components/Modals/wallet-address";

const InitialBody: FC<{
  token: Token;
}> = ({ token }) => {
  const { isConnected, address } = useWalletAccount();
  const { chain: activatedChain } = useWalletNetwork();

  const {
    handleClaimToken,
    claimTokenLoading,
    claimTokenResponse,
    claimTokenSignatureLoading,
  } = useTokenTapContext();

  const calculateClaimAmount =
    token.amount / 10 ** (token.decimals ?? token.chain.decimals);

  return (
    <>
      <DropIconWrapper data-testid={`chain-claim-initial-${token.chain.pk}`}>
        <Icon
          className="chain-logo z-10 mb-10 mt-14"
          width="auto"
          height="110px"
          iconSrc={token.image}
          alt=""
        />
      </DropIconWrapper>
      {claimTokenResponse?.state === "Retry" ? (
        <p className="my-4 mb-6 px-3 text-center text-sm text-warn">
          {claimTokenResponse?.message}
        </p>
      ) : (
        <div className="text-left text-white">
          {claimTokenSignatureLoading ? (
            <p className="my-4 mb-6 px-3 text-center text-sm text-white">
              Preparing your Enroll signature...
            </p>
          ) : claimTokenResponse?.state === "Retry" ? (
            <p className="my-4 mb-6 px-3 text-center text-sm text-error">
              {claimTokenResponse?.message}
            </p>
          ) : claimTokenLoading ? (
            <p className="mb-2 text-center text-lg leading-loose">
              Your claim is ready.
            </p>
          ) : (
            <p></p>
          )}

          <p className="mb-2 text-xs">
            If you have not already claimed your tokens, you can claim them now.
          </p>
          <p className="mb-2 text-xs">
            You will need to sign a wallet transaction and pay a small gas fee
            to claim tokens.
          </p>
          <p className="mb-6 text-xs">
            If you do not have sufficient gas, please visit{" "}
            <Link
              className="text-blue-500"
              href={"/gastap?hc=" + token.chain.chainName}
            >
              Gas Tap
            </Link>
            .
          </p>
        </div>
      )}

      <Text width="100%" fontSize="14">
        Wallet Address
      </Text>
      <WalletAddress fontSize="12">
        {isConnected ? shortenAddress(address) : ""}
      </WalletAddress>
      <ClaimButton
        onClick={handleClaimToken}
        $width="100%"
        $fontSize="16px"
        disabled={claimTokenSignatureLoading || claimTokenLoading}
        className="!w-full"
        data-testid={`token-claim-action-${token.chain.pk}`}
      >
        {claimTokenLoading ? (
          <p>Claiming...</p>
        ) : claimTokenSignatureLoading ? (
          <p>Preparing Signature...</p>
        ) : claimTokenResponse?.state === "Retry" ? (
          <p>Retry</p>
        ) : (
          <p>{`Claim ${calculateClaimAmount} ${token.token}`}</p>
        )}
      </ClaimButton>
    </>
  );
};

export default InitialBody;
