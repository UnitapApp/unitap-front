"use client";

import { ClaimButton } from "@/components/ui/Button/button";
import { FC, useRef, useEffect } from "react";
import { DropIconWrapper } from "../../../../../../../components/containers/modals/claimModal.style";

// @ts-ignore
import ModelViewer from "@metamask/logo";

const WalletNotConnectedBody: FC<{ chainPk: number }> = ({ chainPk }) => {
  const metamaskLogo = useRef<HTMLDivElement>(null);

  // const { tryActivation } = useWalletActivation();

  useEffect(() => {
    if (!metamaskLogo.current) return;

    const viewer = ModelViewer({
      pxNotRatio: true,
      width: 200,
      height: 200,
      followMouse: true,
      slowDrift: false,
    });

    metamaskLogo.current.innerHTML = "";

    metamaskLogo.current.appendChild(viewer.container);

    return () => {
      viewer.stopAnimation();
    };
  }, [metamaskLogo]);

  return (
    <>
      <DropIconWrapper
        className="flex items-center text-center"
        data-testid={`chain-claim-wallet-not-connected`}
      >
        <div
          className="flex items-center justify-center"
          ref={metamaskLogo}
        ></div>
      </DropIconWrapper>

      <p className="mb-2 mt-5 w-full text-left text-sm font-semibold text-gray100">
        Don’t have a metamask wallet?
      </p>

      <p className="mb-5 text-sm text-gray90">
        Go to{" "}
        <a
          href="https://metamask.io"
          rel="noreferrer"
          className="text-orange"
          target="_blank"
        >
          Metamask.io
        </a>{" "}
        and create your first wallet and come back to start with web3
      </p>

      <ClaimButton
        // onClick={tryActivation}
        $width="100%"
        $fontSize="16px"
        className="!w-full"
        data-testid={`chain-claim-action-${chainPk}`}
      >
        <p>Connect Wallet</p>
      </ClaimButton>
    </>
  );
};

export default WalletNotConnectedBody;
