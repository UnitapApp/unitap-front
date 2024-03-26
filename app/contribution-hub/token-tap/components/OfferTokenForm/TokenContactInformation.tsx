"use client";

import { useState } from "react";
import { ContactField, ProviderFormPaginationProp } from "@/types";
import Pagination from "@/app/contribution-hub/components/pagination";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";

const contactFields: ContactField[] = [
  {
    name: "creatorUrl",
    placeholder: "www.example.com (Optional)",
    icon: "/assets/images/provider-dashboard/creatorUrl.svg",
    required: false,
    baseUrl: "",
  },
  {
    name: "twitter",
    placeholder: "@providerUsername (Optional)",
    icon: "/assets/images/provider-dashboard/twitter.svg",
    required: false,
    baseUrl: "https://twitter.com/",
  },
  {
    name: "discord",
    placeholder: "Discord link (Optional)",
    icon: "/assets/images/provider-dashboard/discord.svg",
    required: false,
    baseUrl: "https://discord.com/",
  },
  {
    name: "email",
    placeholder: "example@email.com",
    icon: "/assets/images/provider-dashboard/email.svg",
    required: true,
    baseUrl: "",
  },
  {
    name: "telegram",
    placeholder: "@yourTelegramHandle (Optional)",
    icon: "/assets/images/provider-dashboard/telegram.svg",
    required: false,
    baseUrl: "https://t.me/",
  },
];

const ContactInformation = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    handleChange,
    data,
    page,
    canGoStepFive,
    isShowingDetails,
    socialMediaValidation,
  } = useTokenTapFromContext();
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const handleNextPage = () => {
    const res = canGoStepFive();
    setShowErrors(!res);
    res && handleChangeFormPageNext();
  };

  return (
    <div className="flex w-full animate-fadeIn flex-col  items-center">
      <div className="mb-2 flex w-full max-w-[452px] items-center gap-1">
        <div className="min-w-[16px]">
          <Icon
            width="16px"
            height="16px"
            iconSrc="/assets/images/provider-dashboard/exclamationMark-1.svg"
          />
        </div>
        <p className="text-xs text-gray100">
          Your website, twitter & discord will be shown on PrizeTap card.
        </p>
      </div>
      <div className="flex min-h-[400px] w-full max-w-[452px] flex-col gap-5 text-xs font-medium text-gray100">
        {contactFields.map((field, index) => (
          <div key={index}>
            {index == 3 ? (
              <div className="mb-2 flex items-center gap-2">
                <p className="">Contact info </p>
                <div className="h-[3px] w-[3px] rounded-full bg-gray90"></div>{" "}
                <span className="text-2xs text-gray90">
                  These info will not share with anybody.
                </span>
              </div>
            ) : (
              ""
            )}
            <section className="relative" key={index}>
              <div
                className={`flex gap-5 overflow-hidden border bg-gray40 text-xs text-gray80 ${
                  (field.required && showErrors && !data[field.name]) ||
                  (showErrors &&
                    data[field.name] &&
                    !(socialMediaValidation as any)[field.name])
                    ? "border-error"
                    : "border-gray50"
                } h-[43px] w-full max-w-[452px] items-center justify-between rounded-xl`}
              >
                <div className="flex h-full w-[54px] items-center justify-center bg-gray30">
                  <Icon iconSrc={field.icon} />
                </div>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="provider-dashboard-input"
                  name={field.name}
                  onChange={handleChange}
                  value={data[field.name] ? data[field.name] : ""}
                  disabled={isShowingDetails}
                />
              </div>
              {field.required && showErrors && !data[field.name] && (
                <p className="absolute left-1 m-0 mt-[2px] p-0 text-2xs text-error">
                  Required
                </p>
              )}
              {showErrors &&
                data[field.name] &&
                !(socialMediaValidation as any)[field.name] && (
                  <p className="absolute left-1 m-0 mt-[2px] p-0 text-2xs text-error">
                    Invalid input
                  </p>
                )}
            </section>
          </div>
        ))}
        <section>
          <textarea
            placeholder="Please provide any necessary information"
            className="max-h-[55px] w-full rounded-xl border border-gray50 bg-gray40 p-1 pl-3 text-xs text-white placeholder-gray80 focus:!outline-none"
            name="necessaryInfo"
            onChange={handleChange}
            value={data.necessaryInfo ? data.necessaryInfo : ""}
            disabled={isShowingDetails}
          />
        </section>
      </div>
      <Pagination
        handleChangeFormPagePrev={handleChangeFormPagePrev}
        handleNextPage={handleNextPage}
        page={page}
      />
    </div>
  );
};

export default ContactInformation;
