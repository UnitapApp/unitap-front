"use client";

import Icon from "@/components/ui/Icon";
import { useUserProfileContext } from "@/context/userProfile";

export const RemainingRaffleComponent = () => {
  const { prizetapRoundClaimLimit } = useUserProfileContext();

  return (
    <div className="header__info inline-flex cursor-pointer items-center justify-between gap-x-5 rounded-lg border-2 border-gray80 bg-gray60 px-3 py-2">
      <Icon
        iconSrc="assets/images/prize-tap/header-prize-logo.svg"
        width="36px"
        height="32px"
      />
      <p className="header__info__prize-count mr-1 font-semibold text-white">
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
    <div className="header mb-6 flex h-[194px] w-full items-end justify-between overflow-hidden rounded-2xl border-3 border-gray30 bg-gray20 bg-[url('/assets/images/prize-tap/header-bg.svg')] bg-cover bg-center bg-no-repeat p-4">
      <div className="header__left h-auto items-center">
        <span className="header__left__type-logo mb-3 flex items-center gap-3">
          <img
            className="h-12 w-auto"
            src="assets/images/prize-tap/header-typography.png"
          />
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
