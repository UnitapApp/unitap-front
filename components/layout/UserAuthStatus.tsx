"use client";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/utils/hooks/dom";
import { useUserProfileContext } from "@/context/userProfile";
import { RenderNavbarWalletAddress, ProfileDropdown } from "./auth";

export const UserAuthStatus = () => {
  const divRef = useRef<HTMLDivElement>(null);

  const [dropDownActive, setDropDownActive] = useState(false);

  useOutsideClick(divRef, () => setDropDownActive(false));

  const { userProfile } = useUserProfileContext();

  return (
    <div ref={divRef} className="md:relative ml-5">
      <div className={`ml-5 p-[1px] rounded-lg mr-3`} id="profile-dropdown">
        <div className="cursor-pointer flex rounded-lg h-9 items-center justify-between bg-gray40">
          <div
            onClick={() => {
              if (!userProfile) return;
              setDropDownActive(!dropDownActive);
            }}
            className="cursor-pointer relative z-20 pr-0.5 pl-2 flex rounded-lg h-9 items-center justify-between bg-gray40"
          >
            <span className="ml-2 hidden md:block text-sm">
              @ {userProfile?.username || `User${userProfile?.pk}`}
            </span>

            <span className="text-gray90 hidden md:block ml-8 mr-5">
              level: ?{" "}
            </span>
            <RenderNavbarWalletAddress />
          </div>

          {dropDownActive && (
            <ProfileDropdown setDropDownActive={setDropDownActive} />
          )}
        </div>
      </div>
    </div>
  );
};
