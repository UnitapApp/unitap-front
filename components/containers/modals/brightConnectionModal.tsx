"use client";

import { useCallback, useContext, useEffect, useState } from "react";

import { ClaimButton } from "@/components/ui/Button/button";
import { QRCode } from "react-qrcode-logo";

import {
  APIError,
  APIErrorsSource,
  BrightIdConnectionModalState,
} from "@/types";
import BrightStatusModal from "./brightStatusModal";

import Icon from "@/components/ui/Icon";
import { ConnectBrightIdApi, sponsorAPI } from "@/utils/api";
import { useUserProfileContext } from "@/context/userProfile";
import useGenerateKeys from "@/utils/hooks/generateKeys";
import { useGlobalContext } from "@/context/globalProvider";
import Modal from "@/components/ui/Modal/modal";
import { AxiosError } from "axios";
import { useSocialACcountContext } from "@/context/socialAccountContext";

export const BrightConnectionModalBody = () => {
  const { userProfile, refreshUserProfile, updateProfile, userToken } =
    useUserProfileContext();

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

  const refreshConnectionButtonAction = useCallback(async () => {
    if (loading || !keys?.address || !signedPrivateKey || !userToken) return;

    setError("");
    setLoading(true);
    try {
      const profile = await ConnectBrightIdApi(
        keys.address,
        signedPrivateKey,
        userToken,
      );

      updateProfile({ ...userProfile!, isMeetVerified: true });
      addConnection("userProfile", profile);
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data.message ?? e.message);
      } else {
        setError((e as any).message);
      }
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    keys?.address,
    signedPrivateKey,
    userToken,
    updateProfile,
    userProfile,
    addConnection,
  ]);

  if (userProfile?.isMeetVerified) {
    return <BrightStatusModal success={true}></BrightStatusModal>;
  }

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
            qrStyle="dots"
            quietZone={1}
            size={200}
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
          iconSrc={process.env.PUBLIC_URL + '/quest/assets/images/copy-link.png'}
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
          iconSrc="/quest/assets/images/modal/gray-danger.svg"
        />
        <p className="text-center text-xs font-light text-gray90">
          Submit Verification after verifing with brighID app.
          <br />
          This might take up to 5 minutes.
        </p>
      </span>
      {refreshUserProfile && (
        <ClaimButton
          data-testid={`bright-id-connection-refresh-button${
            tried ? "-try-again" : ""
          }`}
          onClick={refreshConnectionButtonAction}
          className="mb-4 !w-full"
        >
          {brightIdConnectionError ? (
            <p className="font-semibold">Scan or Use Link and Try Again</p>
          ) : (
            <p className="font-semibold">
              {loading ? "Loading..." : "Verify Linking"}
            </p>
          )}
        </ClaimButton>
      )}
      <span className="dont-have-bright-id w-full flex-col items-center md:flex md:flex-row md:justify-between">
        <p className="mb-2 text-center text-xs text-gray100 md:mb-0">
          Don’t have a verified BrightID?
        </p>
        <p
          className="cursor-pointer text-center text-xs font-semibold text-white underline"
          onClick={() => {
            window.open(
              "https://brightid.gitbook.io/brightid/getting-verified",
              "_blank",
            );
          }}
        >
          Get Verified on BrightID
        </p>
      </span>
    </div>
  );
};

const BrightConnectionModal = () => {
  const { brightIdConnectionModalStatus, closeBrightIdConnectionModal } =
    useGlobalContext();

  return (
    <Modal
      className="bright-modal"
      title="Connect Your BrightID"
      size="small"
      isOpen={
        brightIdConnectionModalStatus !== BrightIdConnectionModalState.CLOSED
      }
      closeModalHandler={closeBrightIdConnectionModal}
      errorSource={APIErrorsSource.BRIGHTID_CONNECTION_ERROR}
    >
      <BrightConnectionModalBody />
    </Modal>
  );
};

export default BrightConnectionModal;
