"use client";

import Icon from "@/components/ui/Icon";
import { Text } from "@/components/ui/text.style";
import { LightOutlinedButtonNew } from "../../ui/Button/button";

const BrightStatusModal = ({ success }: { success: boolean }) => {
  function successState() {
    return (
      <div className="bright-connection-modal flex flex-col items-center justify-center pt-2">
        {" "}
        <Icon
          iconSrc="/assets/images/modal/bright-success-icon.svg"
          mb={2}
          ml={-1.5}
        ></Icon>
        <Text color="space_green" mb={1} data-testid="brightid-connect-success">
          BrightID Connected
        </Text>
        <Text
          color="second_gray_light"
          fontSize="14"
          $textAlign="center"
          lineHeight="1.5rem"
          mb={0}
        >
          Your BrightID connected Successfully
        </Text>
      </div>
    );
  }

  function failedState() {
    return (
      <>
        <div
          className="bright-connection-modal flex flex-col items-center justify-center pt-2"
          data-testid="brightid-modal"
        >
          <Icon
            data-testid="brightid-logo"
            className="bright-logo z-10 mb-5 !w-4/12"
            iconSrc="/assets/images/modal/bright-id-logo-checked.svg"
          />
          <p className="mb-2 text-sm font-bold text-error">
            You are not verified on BrightID
          </p>
          <p className="mb-12 px-4 text-center text-xs font-medium leading-6 text-gray100">
            BrightID is a social identity network that allows users to prove
            that they are only using one account.
          </p>

          <span className="relative w-full">
            <LightOutlinedButtonNew
              className="!w-full"
              onClick={() =>
                window.open("https://meet.brightid.org/", "_blank")
              }
            >
              Verify on BrightID{" "}
              <Icon
                className="arrow-icon ml-1.5 mt-0.5 w-2 cursor-pointer"
                iconSrc="/assets/images/arrow-icon.svg"
              />
            </LightOutlinedButtonNew>
            <Icon
              iconSrc="/assets/images/modal/bright-id-check.svg"
              className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2"
            />
          </span>

          {/* eslint-disable-next-line no-restricted-globals */}
          <p
            className="mt-4 cursor-pointer text-xs text-white hover:underline"
            onClick={() => location.reload()}
          >
            If you verified your BrightID click here.
          </p>
        </div>
      </>
    );
  }

  return <div>{success ? successState() : failedState()}</div>;
};

export default BrightStatusModal;
