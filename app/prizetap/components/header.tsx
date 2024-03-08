"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";

export const RemainingRaffleComponent = () => {
  const { prizetapRoundClaimLimit } = useUserProfileContext();

  return (
    <div className="header__info cursor-pointer border-2 border-gray80 bg-gray60 inline-flex px-3 py-2 justify-between items-center rounded-lg gap-x-5">
      <Icon
        iconSrc="assets/images/prize-tap/header-prize-logo.svg"
        width="36px"
        height="32px"
      />
      <p className="header__info__prize-count text-white font-semibold mr-1">
        {prizetapRoundClaimLimit ?? 3}
      </p>
      <Icon
        iconSrc="assets/images/prize-tap/header-info-logo.svg"
        width="12px"
        height="12px"
      />
    </div>
  );
};

const Header = () => {
  return (
    <div className="header bg-no-repeat bg-cover relative bg-center bg-[url('/assets/images/prize-tap/header-bg.svg')] w-full h-[199px] bg-gray20 rounded-3xl flex justify-between items-end overflow-hidden p-4 mb-6 border-3 border-gray30">
      <div className="header__left items-center h-auto">
        <span className="items-center flex mb-3 gap-3">
          <p className="leading-[24.38px] font-semibold tracking-[10px] absolute top-[12px] left-[24px] text-[20px] text-[#AEF2D1]">
            PRIZETAP
          </p>
          {/* <img
            className="h-12 w-auto"
            src="assets/images/prize-tap/header-typography.png"
          /> */}
          {/* <div>
            <div className="bg-gray10 px-3 py-2 border font-bold border-gray50 text-white text-xs rounded-lg">
              <p className="text-gradient-primary">Beta</p>
            </div>
          </div> */}

          {/* <img className="h-12 w-auto" src="assets/images/prize-tap/header-logo.svg" /> */}
        </span>
      </div>
    </div>
  );
};

export default Header;
