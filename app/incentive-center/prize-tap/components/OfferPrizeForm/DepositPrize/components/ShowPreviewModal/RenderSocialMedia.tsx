"use client";

import Icon from "@/components/ui/Icon";
import { ProviderDashboardFormDataProp } from "@/types";

const socialMedias = ["email", "telegram", "twitter", "discord"];
interface Prop {
  data: ProviderDashboardFormDataProp;
}

const RenderSocialMedia = ({ data }: Prop) => {
  return (
    <div className="grid grid-cols-[1fr] gap-5 text-xs text-gray100 md:grid-cols-[1fr_1fr]">
      {socialMedias.map(
        (item, index) =>
          data[item as keyof ProviderDashboardFormDataProp] && (
            <div
              key={index}
              className="flex h-[44px] items-center gap-2 overflow-hidden rounded-lg border border-gray50 bg-gray40"
            >
              <div className="flex h-[100%] w-[54px] items-center justify-center bg-gray30">
                <Icon iconSrc="/quest/assets/images/provider-dashboard/email.svg" />
              </div>
              {data[item as keyof ProviderDashboardFormDataProp]}
            </div>
          ),
      )}
    </div>
  );
};

export default RenderSocialMedia;
