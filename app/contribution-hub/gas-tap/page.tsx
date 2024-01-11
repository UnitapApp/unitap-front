"use client";

import {
  ProviderDashboardButton,
  ProviderDashboardButtonSuccess,
} from "../Buttons";
import Icon from "@/components/ui/Icon";
import SearchInput from "@/app/gastap/components/searchInput";
import Styles from "../content.module.scss";
import Link from "next/link";
import RoutePath from "@/utils/routes";
const GasTapContent = () => {
  return (
    <div>
      <div>
        <div className="flex flex-col md:flex-row  items-center justify-between ">
          <SearchInput className="w-full md:w-1/3 st" />
          <div className="provider-dashboard__status justify-center mt-5 md:mt-0 flex h-[40px] text-[12px] items-center align-center text-gray90 bg-gray40 border-2 border-gray30 rounded-xl w-full  md:w-auto">
            <div>All</div>
            <div>ongoing</div>
            <div>verified</div>
            <div>rejected</div>
            <div>finished</div>
          </div>
        </div>
        <div className="refill-token h-auto md:h-[78px] mt-4 flex w-full justify-between overflow-hidden items-center">
          <div className="flex flex-col sm:flex-row justify-between w-full items-center py-5 px-7 text-white">
            <div className="flex items-center relative">
              <div>
                <p className="text-[16px] font-semibold">Refill Token</p>{" "}
                <p className="text-[14px] text-gray100">
                  Here you can provide Gas Fee.
                </p>
              </div>
              <Icon
                className="absolute right-0 sm:right-[-45px] top-[-17px]  h-[150px] sm:h-[80px]"
                iconSrc="/assets/images/provider-dashboard/gas-bg.png"
                // height="80px"
              />
            </div>
            <Link
              // onClick={() => handleSelectProvideGasFee(true)}
              href={RoutePath.PROVIDER_GASTAP_CREATE}
              className="flex mt-5 sm:mt-0 items-center justify-center cursor-pointer border-2 border-white rounded-[12px] bg-[#0C0C17] w-[226px] h-[46px]"
            >
              + Provide Gas Fee
            </Link>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-gray30 border-2 border-gray40 w-full  p-4 rounded-xl">
            <div className="flex justify-between items-center text-gray90">
              <div className="flex items-center text-white gap-2 font-medium text-[16px];">
                <Icon iconSrc="/assets/images/provider-dashboard/ic_polygon.svg" />
                <p>Polygon</p>
              </div>
              <div className="flex gap-2 text-[10px] items-center justify-center">
                <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-[6px]">
                  EVM
                </div>
                <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-[6px]">
                  Mainnet
                </div>
              </div>
            </div>
            <div className="flex mt-4 justify-between items-center">
              <div className="text-gray90 text-[12px]">
                <div className="mb-2">
                  Currency <span className="text-white ml-2"> Matic</span>
                </div>
                <div>
                  Refill Amount <span className="text-white ml-2">2,137</span>
                </div>
              </div>
              <div>
                <ProviderDashboardButton className="animate-blinking">
                  <p>Pending...</p>
                </ProviderDashboardButton>
              </div>
            </div>
          </div>

          <div className="bg-gray30 border-2 border-gray40 w-full  p-4 rounded-xl">
            <div className="flex justify-between items-center text-gray90">
              <div className="flex items-center text-white gap-2 font-medium text-[16px];">
                <Icon iconSrc="/assets/images/provider-dashboard/ic_polygon.svg" />
                <p>Polygon</p>
              </div>
              <div className="flex gap-2 text-[10px] items-center justify-center">
                <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-[6px]">
                  EVM
                </div>
                <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-[6px]">
                  Mainnet
                </div>
              </div>
            </div>
            <div className="flex mt-4 justify-between items-center">
              <div className="text-gray90 text-[12px]">
                <div className="mb-2">
                  Currency <span className="text-white ml-2"> Matic</span>
                </div>
                <div>
                  Refill Amount <span className="text-white ml-2">2,137</span>
                </div>
              </div>
              <div>
                <ProviderDashboardButtonSuccess
                  data-testid={`chain-show-claim`}
                  className="text-sm m-auto"
                >
                  <p>Done</p>
                </ProviderDashboardButtonSuccess>
              </div>
            </div>
          </div>

          <div className="bg-gray30 border-2 border-gray40 w-full  p-4 rounded-xl">
            <div className="flex justify-between items-center text-gray90">
              <div className="flex items-center text-white gap-2 font-medium text-[16px];">
                <Icon iconSrc="/assets/images/provider-dashboard/ic_polygon.svg" />
                <p>Polygon</p>
              </div>
              <div className="flex gap-2 text-[10px] items-center justify-center">
                <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-[6px]">
                  EVM
                </div>
                <div className="text-center w-[50px] bg-gray50 px-1 py-[3px] rounded-[6px]">
                  Mainnet
                </div>
              </div>
            </div>
            <div className="flex mt-4 justify-between items-center">
              <div className="text-gray90 text-[12px]">
                <div className="mb-2">
                  Currency <span className="text-white ml-2"> Matic</span>
                </div>
                <div>
                  Refill Amount <span className="text-white ml-2">2,137</span>
                </div>
              </div>
              <div>
                <ProviderDashboardButtonSuccess
                  data-testid={`chain-show-claim`}
                  className="text-sm m-auto"
                >
                  <p>Done</p>
                </ProviderDashboardButtonSuccess>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GasTapContent;
