"use client";

import Collapse from "@/components/containers/pass/Collapse";
import NFTTimer from "@/components/containers/pass/nftTimer";
import Header from "@/components/containers/pass/Header";
import RoutePath from "@/utils/routes";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const MintNFTCard = dynamic(
  () => import("@/components/containers/pass/mintNftCard"),
  { ssr: false }
);

const NftPass = () => {
  const [isPreLaunch, setIsPreLaunch] = useState(false);

  const [countClicked, setCountClicked] = useState(0);

  const deadline = useMemo(() => new Date("January 12, 2023 16:00:00 UTC"), []);

  const [displayIndex, setDisplayIndex] = useState(0);

  const advantagesItem = [
    {
      id: 1, title: 'Early Adaptor NFT',
      description: "Unitap Pass holders are the Unitap early adaptors and they'll govern Unitap.",
      imgUrl: 'assets/images/pass/adaptor.svg'
    },
    {
      id: 2,
      title: 'More winning chances in Prize Tap',
      description: 'By holding the Unitap Pass, you get some more Prize Tap tickets that can increase your winning chance.',
      imgUrl: 'assets/images/pass/chance.svg'
    },
    {
      id: 2,
      title: 'Exclusive spot in Token Taps',
      description: `Unitap secures %10 of each Token Tap for the Unitap Pass holders for the first 30% of the Tap's duration.
    Example: $1 for 1000 participants to be live for 9 days. We secure 100 spots for Unitap Pass holders in the first 3 days.`,
      imgUrl: 'assets/images/pass/spot.svg'
    },
    {
      id: 4,
      title: 'Unitap pass presents',
      description: `Unitap Pass holders can pass the Uniqueness verification requirements in Unitap. BrightID, Gitcoin Passport, PolygonID, Idena, ENS, etc.`,
      imgUrl: 'assets/images/pass/verification.svg'
    }
  ]


  useEffect(() => {
    const timer = setInterval(() => {
      if (deadline.getTime() < Date.now()) {
        setIsPreLaunch(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const handleNFTClicked = () => {
    setCountClicked(countClicked + 1);
    if (countClicked > 10) {
      setIsPreLaunch(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountClicked(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countClicked]);

  return (
    <div className="m-auto flex flex-col justify-center items-center w-full max-w-[990px]">
      <div className="flex wrap w-full">
        <Header />
      </div>
      <div className="flex flex-col-reverse md:flex-row wrap w-full gap-4 mb-4 overflow-hidden ">
        <div className="relative card flex flex-col overflow-hidden h-[490px] w-full">
          <div className="bg-gray30 text-gray100 text-base font-medium h-[54px] flex items-center pl-5">
            Unitap Pass advantages
          </div>
          <div className="flex w-full justify-between h-full mt-8">
            <div className="h-full mt-12 ml-8 w-[292px]">
              <p className="text-white font-bold text-base">{advantagesItem[displayIndex].title}</p>
              <p className="text-sm text-gray100 leading-6 mt-5">{advantagesItem[displayIndex].description}</p>
            </div>
            <div className="h-full mr-1 sm:mr-9 mt-8 sm:tm-0">
              <img className="" src={advantagesItem[displayIndex].imgUrl} />
            </div>
          </div>
          <div className=" flex flex-col justify-center items-center z-10 absolute bottom-0 w-full text-[#8F9A97] text-sm font-normal">
            <div className="flex items-center justify-center h-[54px] bg-gray30 gap-5 px-5 rounded-[16px_16px_0px_0px]">
              <div className="cursor-pointer">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.2828 11.0934L16.4565 9.3888C16.5492 8.4789 16.6095 7.8786 16.5618 7.4997H16.5798C17.3637 7.4997 18 6.8283 18 6.0003C18 5.1723 17.3637 4.5 16.5789 4.5C15.7941 4.5 15.1578 5.1714 15.1578 6.0003C15.1578 6.3747 15.2883 6.7176 15.5034 6.9804C15.1947 7.1811 14.7906 7.6059 14.1822 8.2449C13.7142 8.7372 13.4802 8.9829 13.2192 9.0216C13.0742 9.04255 12.9262 9.02065 12.7935 8.9586C12.5523 8.847 12.3912 8.5428 12.0699 7.9335L10.3743 4.725C10.1763 4.3497 10.0098 4.0356 9.8595 3.7827C10.4742 3.4515 10.8945 2.7774 10.8945 2.0007C10.8945 0.8946 10.0467 0 9 0C7.9533 0 7.1055 0.8955 7.1055 1.9998C7.1055 2.7774 7.5258 3.4515 8.1405 3.7818C7.9902 4.0356 7.8246 4.3497 7.6257 4.725L5.931 7.9344C5.6088 8.5428 5.4477 8.847 5.2065 8.9595C5.07377 9.02155 4.92581 9.04345 4.7808 9.0225C4.5198 8.9838 4.2858 8.7372 3.8178 8.2449C3.2094 7.6059 2.8053 7.1811 2.4966 6.9804C2.7126 6.7176 2.8422 6.3747 2.8422 5.9994C2.8422 5.1723 2.205 4.5 1.4202 4.5C0.6372 4.5 0 5.1714 0 6.0003C0 6.8283 0.6363 7.4997 1.4211 7.4997H1.4382C1.3896 7.8777 1.4508 8.4789 1.5435 9.3888L1.7172 11.0934C1.8135 12.0393 1.8936 12.9393 1.9926 13.7502H16.0074C16.1064 12.9402 16.1865 12.0393 16.2828 11.0934ZM7.9695 18H10.0305C12.717 18 14.0607 18 14.9571 17.154C15.3477 16.7832 15.5961 16.1172 15.7743 15.2496H2.2257C2.4039 16.1172 2.6514 16.7832 3.0429 17.1531C3.9393 18 5.283 18 7.9695 18Z" fill="#4C4C5C" />
                </svg>
              </div>
              <div className="cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.33333 1C1.49238 1 0 2.51104 0 4.375V7.75C1.2273 7.75 2.22222 8.75736 2.22222 10C2.22222 11.2426 1.2273 12.25 0 12.25V15.625C0 17.489 1.49238 19 3.33333 19H16.6667C18.5076 19 20 17.489 20 15.625V12.25C18.7727 12.25 17.7778 11.2426 17.7778 10C17.7778 8.75736 18.7727 7.75 20 7.75V4.375C20 2.51104 18.5076 1 16.6667 1H3.33333ZM5 9.4375V7.1875L6.66667 6.0625H13.3333L15 7.1875V9.4375L10 14.5L5 9.4375Z" fill="#B5B5C6" />
                </svg>
              </div>
              <div className="cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02941 1 1 5.02944 1 10C1 14.9706 5.02941 19 10 19ZM10.3078 4.52696C10.4236 4.64486 10.4885 4.80472 10.4885 4.97143V5.60001C10.9992 5.59991 11.4972 5.7611 11.9141 6.06134C12.331 6.36155 12.6463 6.78609 12.8165 7.2764C12.8675 7.43268 12.8563 7.60316 12.7853 7.75113C12.7142 7.89907 12.5889 8.01273 12.4364 8.06757C12.2839 8.12244 12.1164 8.11415 11.9698 8.04447C11.8233 7.97478 11.7095 7.84932 11.6528 7.69504C11.5677 7.44989 11.41 7.23766 11.2015 7.08759C10.993 6.93751 10.7439 6.857 10.4885 6.85716V9.37143C11.1433 9.37143 11.7712 9.63632 12.2341 10.1079C12.6971 10.5794 12.9571 11.2189 12.9571 11.8857C12.9571 12.5525 12.6971 13.1921 12.2341 13.6636C11.7712 14.1351 11.1433 14.4 10.4885 14.4V15.0286C10.4885 15.1953 10.4236 15.3551 10.3078 15.473C10.1921 15.5909 10.0351 15.6571 9.87143 15.6571C9.70776 15.6571 9.55075 15.5909 9.43505 15.473C9.31929 15.3551 9.25431 15.1953 9.25431 15.0286V14.4C8.74367 14.4001 8.24564 14.2389 7.82873 13.9387C7.41181 13.6385 7.0966 13.2139 6.9264 12.7236C6.87536 12.5673 6.88654 12.3968 6.9576 12.2489C7.02867 12.1009 7.15398 11.9873 7.30647 11.9324C7.45896 11.8776 7.62645 11.8859 7.77304 11.9555C7.91957 12.0252 8.03338 12.1507 8.09007 12.305C8.1752 12.5501 8.3329 12.7623 8.54139 12.9124C8.74988 13.0625 8.99899 13.143 9.25431 13.1428V10.6286C8.59959 10.6286 7.97167 10.3637 7.50874 9.89215C7.04581 9.42064 6.78571 8.78111 6.78571 8.11428C6.78571 7.44747 7.04581 6.80794 7.50874 6.33641C7.97167 5.8649 8.59959 5.60001 9.25431 5.60001V4.97143C9.25431 4.80472 9.31929 4.64486 9.43505 4.52696C9.55075 4.40909 9.70776 4.34286 9.87143 4.34286C10.0351 4.34286 10.1921 4.40909 10.3078 4.52696ZM8.38149 7.22536C8.61296 6.98959 8.92692 6.85716 9.25431 6.85716V9.37143C8.92692 9.37143 8.61296 9.23899 8.38149 9.00323C8.15003 8.76746 8.02001 8.4477 8.02001 8.11428C8.02001 7.78086 8.15003 7.46112 8.38149 7.22536ZM10.4885 13.1428V10.6286C10.8159 10.6286 11.1299 10.761 11.3614 10.9968C11.5928 11.2325 11.7228 11.5523 11.7228 11.8857C11.7228 12.2191 11.5928 12.5389 11.3614 12.7746C11.1299 13.0104 10.8159 13.1428 10.4885 13.1428Z" fill="#303043" />
                </svg>
              </div>
              <div className="cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1ZM10.3409 7.4314C10.2505 7.34701 10.1279 7.2996 10 7.2996C9.87213 7.2996 9.74949 7.34701 9.65907 7.4314C9.56865 7.5158 9.51786 7.63026 9.51786 7.7496V12.1538C9.51786 13.3017 9.81679 14.2463 10.4976 14.9015C11.1817 15.5594 12.1721 15.8496 13.375 15.8496C13.5029 15.8496 13.6255 15.8022 13.7159 15.7178C13.8063 15.6334 13.8571 15.5189 13.8571 15.3996C13.8571 15.2803 13.8063 15.1658 13.7159 15.0814C13.6255 14.997 13.5029 14.9496 13.375 14.9496C12.3278 14.9496 11.6306 14.6985 11.1899 14.2746C10.7464 13.8485 10.4821 13.1699 10.4821 12.1538V7.7496C10.4821 7.63026 10.4313 7.5158 10.3409 7.4314ZM5.17857 7.40535C5.17857 4.94385 7.59603 3.2496 10 3.2496C12.404 3.2496 14.8214 4.94385 14.8214 7.40535V12.0449C14.8214 12.44 14.7395 12.8603 14.508 13.1978C14.2602 13.5587 13.8567 13.7949 13.3224 13.7949C13.0846 13.7968 12.8495 13.7468 12.6361 13.6487C12.4227 13.5506 12.2369 13.4073 12.0935 13.2302C11.8191 12.8999 11.6875 12.4728 11.6875 12.0449V7.8567C11.6888 7.42562 11.51 7.01106 11.189 6.7011C10.8712 6.3969 10.4436 6.2286 10 6.2286C9.77806 6.22904 9.55847 6.27104 9.35424 6.35212C9.15001 6.43321 8.9653 6.55173 8.81104 6.70065C8.49004 7.01061 8.31119 7.42517 8.3125 7.85625V13.0839C8.3125 14.2859 8.95664 15.3969 10.3987 15.8762C10.5193 15.9161 10.6178 15.9992 10.6727 16.107C10.7277 16.2148 10.7345 16.3385 10.6916 16.451C10.6488 16.5635 10.5598 16.6555 10.4443 16.7068C10.3288 16.758 10.1962 16.7644 10.0757 16.7244C8.19582 16.0989 7.34821 14.6108 7.34821 13.0839V7.8567C7.34693 7.19091 7.62405 6.55092 8.12061 6.0729C8.36465 5.83788 8.65672 5.65092 8.97953 5.52308C9.30234 5.39524 9.64933 5.32911 10 5.3286C10.3506 5.32905 10.6976 5.39511 11.0204 5.52287C11.3432 5.65064 11.6353 5.83751 11.8794 6.07245C12.376 6.55047 12.6531 7.19045 12.6518 7.85625V12.044C12.6518 12.3095 12.7347 12.5322 12.8557 12.6785C12.9695 12.8162 13.1214 12.8945 13.3224 12.8945C13.5114 12.8945 13.6166 12.8274 13.6961 12.7113C13.7925 12.5714 13.8571 12.3419 13.8571 12.0444V7.40535C13.8571 5.55495 12.0023 4.1496 10 4.1496C7.99766 4.1496 6.14286 5.55495 6.14286 7.4058V13.052C6.14286 13.5308 6.21952 14.0078 6.36705 14.4074C6.51748 14.8124 6.72528 15.0977 6.95671 15.2507C7.00956 15.2844 7.05468 15.3276 7.08944 15.3778C7.1242 15.4279 7.14791 15.4841 7.15918 15.5429C7.17046 15.6017 7.16907 15.662 7.1551 15.7203C7.14113 15.7786 7.11486 15.8338 7.07782 15.8825C7.04078 15.9312 6.99372 15.9726 6.93937 16.0041C6.88503 16.0357 6.82449 16.0569 6.76129 16.0664C6.69809 16.0759 6.63349 16.0736 6.57127 16.0595C6.50904 16.0455 6.45044 16.02 6.39887 15.9846C5.94277 15.6831 5.64239 15.2052 5.4558 14.7012C5.26728 14.1909 5.17857 13.6127 5.17857 13.0524V7.40535Z" fill="#303043" />
                  <path d="M13.3228 13.8448C13.8732 13.8448 14.2922 13.6005 14.5494 13.226L14.5494 13.2259C14.7885 12.8773 14.8716 12.4458 14.8716 12.0448V7.40526C14.8716 4.90673 12.4212 3.19951 10.0001 3.19951C7.57904 3.19951 5.12871 4.90673 5.12871 7.40526V13.0523C5.12871 13.6175 5.21816 14.2017 5.40904 14.7184L5.40905 14.7185L9.37283 6.3985C9.57116 6.31976 9.78452 6.27893 10.0002 6.27851C10.4312 6.27854 10.8463 6.44205 11.1544 6.73705C11.466 7.03791 11.6389 7.43956 11.6376 7.85646V7.85661V12.0448C11.6376 12.4825 11.7722 12.9212 12.0549 13.2618C12.2033 13.445 12.3953 13.5929 12.6154 13.6941C12.8355 13.7952 13.0777 13.8468 13.3228 13.8448ZM13.3228 13.8448C13.3227 13.8448 13.3226 13.8448 13.3226 13.8448V13.7948L13.323 13.8448C13.3229 13.8448 13.3228 13.8448 13.3228 13.8448ZM13.655 12.6829L13.6551 12.6828C13.7438 12.5541 13.8073 12.3358 13.8073 12.0443V7.40526C13.8073 5.5915 11.9848 4.19951 10.0001 4.19951C8.01544 4.19951 6.193 5.59149 6.193 7.40571V13.0519C6.193 13.5257 6.26893 13.9967 6.4141 14.3899L6.36719 14.4073L6.41406 14.3899C6.56221 14.7887 6.76463 15.0634 6.98409 15.2086C7.04223 15.2458 7.09211 15.2935 7.13068 15.3492C7.16933 15.405 7.19582 15.4676 7.20843 15.5334C7.22104 15.5992 7.21949 15.6667 7.20387 15.7319C7.18825 15.7971 7.15892 15.8585 7.11777 15.9126C7.07663 15.9668 7.02452 16.0125 6.96463 16.0473C6.90474 16.0821 6.83819 16.1053 6.76886 16.1157C6.69954 16.1262 6.62869 16.1236 6.5604 16.1082C6.49226 16.0928 6.42789 16.0649 6.37108 16.026C6.37095 16.0259 6.37083 16.0258 6.37071 16.0257L6.39901 15.9845L13.655 12.6829ZM13.655 12.6829C13.6186 12.736 13.5782 12.7754 13.5273 12.802C13.4763 12.8287 13.4111 12.8444 13.3226 12.8444C13.1367 12.8444 12.9989 12.7729 12.8944 12.6465L12.8944 12.6465M13.655 12.6829L12.8944 12.6465M12.8944 12.6465C12.7818 12.5104 12.7019 12.2994 12.7019 12.0439L12.7019 7.85626M12.8944 12.6465L12.7019 7.85626M11.8795 6.07236L11.9142 6.03634C12.4202 6.52341 12.7032 7.17624 12.7019 7.85616C12.7019 7.85619 12.7019 7.85623 12.7019 7.85626M11.8795 6.07236L12.6519 7.85616L12.7019 7.85626M11.8795 6.07236L11.9142 6.03634C11.6653 5.79677 11.3677 5.60639 11.039 5.47629C10.7103 5.34619 10.357 5.27897 10.0002 5.27851L10.0001 5.27851M11.8795 6.07236L10.0001 5.27851M10.0001 5.27851C9.64319 5.27903 9.28996 5.34632 8.96126 5.4765M10.0001 5.27851L8.96126 5.4765M8.96126 5.4765C8.63255 5.60668 8.33492 5.79714 8.08607 6.03679L8.96126 5.4765ZM11.2247 14.2385L11.2247 14.2385C10.7942 13.8249 10.5323 13.1615 10.5323 12.1537V7.74951C10.5323 7.61575 10.4753 7.48822 10.3752 7.39476C10.2752 7.30141 10.1402 7.24951 10.0001 7.24951C9.86008 7.24951 9.72511 7.30141 9.6251 7.39476C9.52496 7.48822 9.468 7.61575 9.468 7.74951V12.1537C9.468 13.3098 9.76916 14.2696 10.463 14.9374L10.4631 14.9374C11.16 15.6076 12.165 15.8995 13.3751 15.8995C13.5152 15.8995 13.6502 15.8476 13.7502 15.7543C13.8503 15.6608 13.9073 15.5333 13.9073 15.3995C13.9073 15.2657 13.8503 15.1382 13.7502 15.0448C13.6502 14.9514 13.5152 14.8995 13.3751 14.8995C12.3352 14.8995 11.6527 14.6501 11.2247 14.2385ZM8.36264 7.85601C8.36137 7.43908 8.53432 7.0374 8.8459 6.73653L10.4445 16.7067C10.56 16.6554 10.6489 16.5634 10.6918 16.4509C10.7346 16.3385 10.7278 16.2147 10.6729 16.1069C10.618 15.9991 10.5194 15.916 10.3989 15.8761L10.4146 15.8286C10.4146 15.8286 10.4146 15.8286 10.4146 15.8286C8.99411 15.3565 8.36264 14.2654 8.36264 13.0838L8.36264 7.85616L8.36264 7.85601ZM8.08606 6.0368C7.58008 6.52388 7.29704 7.17676 7.29835 7.85671L8.08606 6.0368Z" fill="#1B1B29" stroke="#1B1B29" stroke-width="0.1" />
                </svg>
              </div>
            </div>
            <div className="flex gap-4 bg-gray30  items-center justify-center h-[54px] w-full px-5 md:px-1 py-2 sm:py-0">
              <img width={"20px"} height={'20px'} src="/assets/images/pass/check.svg" />
              As Unitap grows there will be more and more features for Unitap Pass holders.
            </div>
          </div>
          <div className="absolute bottom-0" >
            <img src="/assets/images/pass/advBg.svg" />
          </div>
        </div>
        {isPreLaunch ? (
          <div
            onClick={handleNFTClicked}
            className="card w-full md:w-5/12 p-2 select-none"
          >
            <NFTTimer deadline={deadline} className="mb-14" />
            <img
              className={"w-52 mt-28 animate-rocket m-auto relative right-3"}
              src={"/assets/images/nft/rocketship.png"}
            />
            <img
              className={"w-44 m-auto"}
              src={"/assets/images/nft/rocket-base.png"}
            />
          </div>
        ) : (
          <div className="card md:w-[50%] p-0 overflow-hidden select-none">
            <MintNFTCard />
          </div>
        )}
      </div>
      <div className="flex flex-wrap bg-gray20 w-full gap-2 rounded-2xl overflow-hidden p-2">
        <div className="box-1 h-full rounded-xl bg-gray40  overflow-hidden w-[260px]">
          <div className="flex h-[40px] bg-gray60 pl-2 text-xs items-center gap-[7px]">
            <span>@aqa_reza</span>
            <span className="w-1 h-1 rounded-full bg-gray100" ></span>
            <span className="text-gray100 text-xs font-normal leading-[4px]">0x7835...a592</span>
          </div>
          <div className="flex items-center justify-around h-[58px] bg-gray40">
            <div className="flex items-center gap-1">
              <img src="/assets/images/pass/up.svg" />
              2 UPs
            </div>
            <div className="flex items-center gap-1">
              <img src="/assets/images/pass/ticket.svg" />
              3 TICKETS</div>
          </div>
        </div>
        <div className="box-2 flex flex-col items-center justify-center border border-gray80 w-[438px]">
          <div>You will earn 2 more tickets next round! </div>
          <div>1 UP = 1 ticket in new round</div>
          <div>Mint more UP</div>
        </div>
        <div className="box-3 flex-col items-center flex  w-[260px] bg-gray40 overflow-hidden rounded-xl">
          <div className="bg-gray60 w-full text-gray100 text-xs h-[40px] flex items-center justify-center">Next Round in:</div>
          <div className="flex items-center justify-center h-[58px] font-digital-numbers">06:23:59:59</div>
        </div>
      </div>
      <Collapse
        className="mb-4"
        title="Unitap Pass Sale"
        icon="assets/images/nft/nft-pass-sale-icon.svg"
        initState
      >
        <>
          <p className="collapse-text mb-8">
            10,000 Unitap Passes total will be sold starting at 0.1 Eth each
            using a small batch sale followed by a BrightID Aura gated sale.
          </p>
          <p className="collapse-title">Small batch sale</p>
          <p className="collapse-text mb-8">
            A maximum of 2,000 Unitap Passes will be sold in small batches, with
            a starting batch size of 100. Anyone can buy Passes up to the number
            left in the current batch. When a batch sells out, Unitap will
            decide whether to start a new batch or to transition to the Aura
            gated sale.
          </p>
          <p className="collapse-title">Aura gated sale</p>
          <p className="collapse-text">
            The remaining Unitap Passes will be sold gated by{" "}
            <span
              className="in-text-link"
              onClick={() =>
                window.open("https://brightid.gitbook.io/aura/", "_blank")
              }
            >
              {" "}
              BrightID Aura verification
            </span>
            . Anyone with Aura verification can deposit Eth to automatically
            purchase one Unitap Pass per day while supplies last.
          </p>
        </>
      </Collapse>
      <Collapse
        className="mb-4"
        title="Questions"
        icon="assets/images/nft/nft-questions-icon.svg"
      >
        <>
          <p className="collapse-title">
            Will Unitap Passes contribute to wealth disparity?
          </p>
          <p className="collapse-text mb-8">
            No. Unitap strives to provide immense value to every person for
            free. Even if Unitap Passes are worth much more than their purchase
            price, the value one person will get from holding multiple Passes
            will not exceed the immense value each person will receive from
            Unitap for free.
          </p>
          <p className="collapse-title">Where will the money go?</p>
          <p className="collapse-text">
            All money received from the sale of Unitap Passes will go to support
            Unitap and BrightID (a core component of Unitap). Unitap has chosen
            to use Bright DAO for its governance and will make proposals to
            receive $BRIGHT as needed to pay for its operations. Any money
            raised that exceeds the immediate needs of the Unitap team will be
            used to buy $BRIGHT tokens and deposit them in Bright DAO&apos;s
            community pool.
            <br /> <br />
            <span
              className="in-text-link"
              onClick={() => window.open("https://dao.brightid.org", "_blank")}
            >
              Bright DAO
            </span>{" "}
            is a large community{" "}
            <span
              className="in-text-link"
              onClick={() => window.open("https://gardens.1hive.org", "_blank")}
            >
              Gardens DAO
            </span>{" "}
            with over 1400 members.
          </p>
        </>
      </Collapse>
    </div>
  );
};

export default NftPass;
