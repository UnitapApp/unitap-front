"use client";

import Icon from "@/components/ui/Icon";
import { ProviderDashboardFormDataProp } from "@/types";

const socialMedias = ["email", "telegram", "twitter", "discord"];
interface Prop {
  data: ProviderDashboardFormDataProp;
}

const RenderSocialMedia = ({ data }: Prop) => {
  return (
    <div className="grid gap-5 text-gray100 text-[12px] grid-cols-[1fr] md:grid-cols-[1fr_1fr]">
      {socialMedias.map(
        (item, index) =>
          data[item as keyof ProviderDashboardFormDataProp] && (
            <div
              key={index}
              className=" overflow-hidden h-[44px] flex gap-2 items-center rounded-lg bg-gray40 border border-gray50"
            >
              <div className="bg-gray30 h-[100%] w-[54px] flex items-center justify-center">
                <Icon iconSrc="/assets/images/provider-dashboard/email.svg" />
              </div>
              {data[item as keyof ProviderDashboardFormDataProp]}
            </div>
          )
      )}
    </div>
  );
};

export default RenderSocialMedia;
