"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { ConnectionProvider, WalletState } from ".";
import { ClaimButton } from "@/components/ui/Button/button";
import { QRCode } from "react-qrcode-logo";
import { useSocialACcountContext } from "@/context/socialAccountContext";
import { APIError } from "@/types";
import {
  sponsorAPI,
  ConnectBrightIdApi,
  checkRecoveryStateApi,
} from "@/utils/api";
import useGenerateKeys from "@/utils/hooks/generateKeys";
import Icon from "@/components/ui/Icon";
import { useFastRefresh } from "@/utils/hooks/refresh";

const RecoverConnectBrightIDBody: FC<{
  walletProvider: ConnectionProvider;
  setWalletState: (state: WalletState) => void;
}> = ({ setWalletState, walletProvider }) => {
  const [tried] = useState(false);

  const [error, setError] = useState("");

  const { keys, signPrivateKey } = useGenerateKeys();

  const [loading, setLoading] = useState(false);
  const [signedPrivateKey, setSignedPrivateKey] = useState<string | null>(null);

  const [brightIdConnectionError, setBrightIdConnectionError] =
    useState<APIError | null>(null);

  const { addConnection } = useSocialACcountContext();

  useEffect(() => {
    if (keys) {
      signPrivateKey()
        .then((res) => setSignedPrivateKey(res))
        .catch((err) => console.log(err));
    }
  }, [keys, signPrivateKey]);

  useEffect(() => {
    if (keys && keys.address) {
      sponsorAPI(keys.address);
    }
  }, [keys, keys?.address]);

  const openVerificationUrl = async () => {
    if (!keys?.address) return;
    window.open(
      `brightid://link-verification/http:%2f%2fnode.brightid.org/unitap/${keys?.address.toLowerCase()}/`,
      "_blank",
    );
  };

  useFastRefresh(() => {
    if (!keys) return;
    checkRecoveryStateApi(keys.address, keys.privateKey).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <div
      className="bright-connection-modal flex w-full flex-col items-center justify-center pt-4"
      data-testid="brightid-modal"
    >
      <p className="scan-qr-text mb-3 text-sm text-white">Scan QR Code</p>
      {keys?.address && (
        <span className="qr-code z-10 mb-4 overflow-hidden rounded-md">
          <QRCode
            value={`brightid://link-verification/http:%2f%2fnode.brightid.org/unitap/${keys?.address.toLowerCase()}/`}
            data-testid="brightid-qr"
            ecLevel="L"
            // qrStyle="dots"
            quietZone={1}
            size={250}
            eyeRadius={5}
          />
        </span>
      )}
      <p className="mb-4 text-xs text-white">or</p>
      <div
        onClick={() => openVerificationUrl()}
        data-testid="brightid-copy-link"
        className="z-10 mb-5 flex text-space-green"
      >
        {/* <Icon
          iconSrc={process.env.PUBLIC_URL + '/assets/images/copy-link.png'}
          width="16px"
          height="19px"
          className="mr-3"
        /> */}
        <p className="cursor-pointer font-medium text-space-green hover:underline">
          Visit Link
        </p>
      </div>

      {error && (
        <span className="notice mb-3 flex">
          <p className="text-center text-xs font-light text-error"> {error} </p>
        </span>
      )}
      <span className="mb-3 flex">
        <Icon
          className="mb-4 mr-2"
          iconSrc="/assets/images/modal/gray-danger.svg"
        />
        <p className="text-center text-xs font-light text-gray90">
          Submit Verification after verifing with brighID app.
          <br />
          This might take up to 5 minutes.
        </p>
      </span>

      <ClaimButton
        data-testid={`bright-id-connection-refresh-button${
          tried ? "-try-again" : ""
        }`}
        disabled
        className="!w-full disabled:opacity-60"
      >
        <svg className="mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Waiting for verification
      </ClaimButton>
    </div>
  );
};

export default RecoverConnectBrightIDBody;
