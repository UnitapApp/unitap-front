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
import { ErrorsContext } from "@/context/errorsProvider";
import useGenerateKeys from "@/utils/hooks/generateKeys";
import { useGlobalContext } from "@/context/globalProvider";
import Modal from "@/components/ui/Modal/modal";

const BrightConnectionModalBody = () => {
  const { userProfile, refreshUserProfile, updateProfile, userToken } =
    useUserProfileContext();

  const [tried] = useState(false);

  const { errors, getError, deleteError } = useContext(ErrorsContext);

  const { keys, signPrivateKey } = useGenerateKeys();

  const [loading, setLoading] = useState(false);
  const [signedPrivateKey, setSignedPrivateKey] = useState<string | null>(null);

  const [brightIdConnectionError, setBrightIdConnectionError] =
    useState<APIError | null>(null);

  useEffect(() => {
    setBrightIdConnectionError(
      getError(APIErrorsSource.BRIGHTID_CONNECTION_ERROR)
    );
  }, [errors, getError]);

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
      "_blank"
    );
  };

  const refreshConnectionButtonAction = useCallback(async () => {
    if (loading || !keys?.address || !signedPrivateKey || !userToken) return;

    deleteError(APIErrorsSource.BRIGHTID_CONNECTION_ERROR);
    setLoading(true);
    try {
      const profile = await ConnectBrightIdApi(
        keys.address,
        signedPrivateKey,
        userToken
      );

      updateProfile(profile);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    keys?.address,
    signedPrivateKey,
    deleteError,
    userToken,
    updateProfile,
  ]);

  if (userProfile?.isMeetVerified) {
    return <BrightStatusModal success={true}></BrightStatusModal>;
  }

  return (
    <div
      className="bright-connection-modal w-full flex flex-col items-center justify-center pt-4"
      data-testid="brightid-modal"
    >
      <p className="scan-qr-text text-sm text-white mb-3">Scan QR Code</p>
      {keys?.address && (
        <span className="qr-code z-10 mb-4 rounded-md overflow-hidden">
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
      <p className="text-xs text-white mb-4">or</p>
      <div
        onClick={() => openVerificationUrl()}
        data-testid="brightid-copy-link"
        className="flex text-space-green mb-5 z-10"
      >
        {/* <Icon
          iconSrc={process.env.PUBLIC_URL + '/assets/images/copy-link.png'}
          width="16px"
          height="19px"
          className="mr-3"
        /> */}
        <p className="text-space-green font-medium cursor-pointer hover:underline">
          Visit Link
        </p>
      </div>

      {brightIdConnectionError && (
        <span className="notice flex mb-3">
          <p className="text-xs text-error font-light text-center">
            {" "}
            {brightIdConnectionError.message}{" "}
          </p>
        </span>
      )}
      <span className="notice flex mb-3">
        <Icon className="mr-2" iconSrc="/assets/images/modal/gray-danger.svg" />
        <p className="text-xs text-gray90 font-light">
          {" "}
          Submit Verification after verifing with brighID app.{" "}
        </p>
      </span>
      {refreshUserProfile && (
        <ClaimButton
          data-testid={`bright-id-connection-refresh-button${
            tried ? "-try-again" : ""
          }`}
          onClick={refreshConnectionButtonAction}
          className="!w-full mb-4"
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
      <span className="dont-have-bright-id md:flex flex-col md:flex-row items-center md:justify-between w-full">
        <p className="text-xs text-gray100 text-center mb-2 md:mb-0">
          Don’t have a verified BrightID?
        </p>
        <p
          className="text-xs font-semibold cursor-pointer underline text-white text-center"
          onClick={() => {
            window.open(
              "https://brightid.gitbook.io/brightid/getting-verified",
              "_blank"
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
