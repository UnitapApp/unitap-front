"use client";

import { useState } from "react";
import { ContactField, ProviderFormPaginationProp } from "@/types";
import Pagination from "@/app/contribution-hub/pagination";
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
    <div className="flex flex-col w-full items-center  animate-fadeIn">
      <div className="flex mb-2 w-full max-w-[452px] items-center gap-1">
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
      <div className="text-gray100 text-[12px] min-h-[400px] font-medium flex flex-col gap-5 w-full max-w-[452px]">
        {contactFields.map((field, index) => (
          <div key={index}>
            {index == 3 ? <p className=" mb-2">Contact info</p> : ""}
            <section className="relative" key={index}>
              <div
                className={`flex gap-5 overflow-hidden text-gray80 text-[12px] bg-gray40 border ${
                  (field.required && showErrors && !data[field.name]) ||
                  (showErrors &&
                    data[field.name] &&
                    !(socialMediaValidation as any)[field.name])
                    ? "border-error"
                    : "border-gray50"
                } rounded-xl h-[43px] items-center justify-between w-full max-w-[452px]`}
              >
                <div className="w-[54px] bg-gray30 h-full flex items-center justify-center">
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
                <p className="text-error text-2xs m-0 mt-[2px] p-0 absolute left-1">
                  Required
                </p>
              )}
              {showErrors &&
                data[field.name] &&
                !(socialMediaValidation as any)[field.name] && (
                  <p className="text-error text-2xs m-0 mt-[2px] p-0 absolute left-1">
                    Invalid input
                  </p>
                )}
            </section>
          </div>
        ))}
        <section>
          <textarea
            placeholder="Please provide any necessary information"
            className="text-white text-[12px] focus:!outline-none placeholder-gray80 bg-gray40 border border-gray50 rounded-xl max-h-[55px] p-1 pl-3 w-full"
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
