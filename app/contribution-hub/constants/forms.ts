import { DisplayStepsProps } from "@/types";
import PrizeInfo from "../prize-tap/components/OfferPrizeForm/PrizeInfo";
import TimeEnrollLimitation from "../prize-tap/components/OfferPrizeForm/TimeEnrollLimitation";
import Requirements from "../prize-tap/components/OfferPrizeForm/Requirements";
import ContactInformation from "../prize-tap/components/OfferPrizeForm/ContactInformation";
import DepositPrize from "../prize-tap/components/OfferPrizeForm/DepositPrize";
import InformationVerification from "../prize-tap/components/OfferPrizeForm/InformationVerification";
import TokenInfo from "../token-tap/components/OfferTokenForm/TokenInfo";
import TokenTapTimeEnrollLimitation from "../token-tap/components/OfferTokenForm/TokenTapTimeEnrollLimitation";
import DepositToken from "../token-tap/components/OfferTokenForm/DepositToken";
import TokenTapRequirements from "../token-tap/components/OfferTokenForm/TokenTapRequirements";
import TokenContactInformation from "../token-tap/components/OfferTokenForm/TokenContactInformation";
import TokenInformationVerification from "../token-tap/components/OfferTokenForm/TokenInformationVerification";

export const tokenTapForms = [
  TokenInfo,
  TokenTapTimeEnrollLimitation,
  TokenTapRequirements,
  TokenContactInformation,
  DepositToken,
  TokenInformationVerification,
];

export const TokenTapDisplaySteps: DisplayStepsProps[] = [
  {
    id: 0,
    title: "Token info",
    description: "Your Token information",
		prevIcon:
			"/assets/images/provider-dashboard/token-tap-green.svg",
		activeIcon: "/assets/images/provider-dashboard/token-tap-active.png",
		nextIcon: "/assets/images/provider-dashboard/token-tap-active.png",
  },
  {
    id: 1,
    title: "Time/Claim Limitation",
    description: "Information of time and Claims ",
		prevIcon: "/assets/images/provider-dashboard/step-1-green.svg",
		activeIcon: "/assets/images/provider-dashboard/step-1-active.svg",
		nextIcon: "/assets/images/provider-dashboard/step-1-off.svg",
  },
  {
    id: 2,
    title: "Requirements",
    description: "Add requirements for Enrollment",
		prevIcon: "/assets/images/provider-dashboard/step-2-green.png",
		activeIcon: "/assets/images/provider-dashboard/step-2-active.png",
		nextIcon: "/assets/images/provider-dashboard/step-2-off.png",
  },
  {
    id: 3,
    title: "Social Media  & Contact Info",
    description: "Public Website, Twitter & Discord",
		prevIcon: "/assets/images/provider-dashboard/step-3-green.png",
		activeIcon: "/assets/images/provider-dashboard/step-3-active.png",
		nextIcon: "/assets/images/provider-dashboard/step-3-off.png",
  },
  {
    id: 4,
    title: "Deposit Token",
    description: "Deposit Token or Nft",
		prevIcon: "/assets/images/provider-dashboard/step-4-green.svg",
		activeIcon: "/assets/images/provider-dashboard/step-4-active.svg",
		nextIcon: "/assets/images/provider-dashboard/step-4-off.svg",
  },
  {
    id: 5,
    title: "Verification",
    description: "Processing your request",
		prevIcon: "/assets/images/provider-dashboard/step-5-active.svg",
		activeIcon: "/assets/images/provider-dashboard/step-5-active.svg",
		nextIcon: "/assets/images/provider-dashboard/step-5-off.svg",
  },
];

export const prizeTapForms = [
  PrizeInfo,
  TimeEnrollLimitation,
  Requirements,
  ContactInformation,
  DepositPrize,
  InformationVerification,
];



export const PrizeTapDisplaySteps: DisplayStepsProps[] = [
	{
		id: 0,
		prevIcon:
			"/assets/images/provider-dashboard/prizerForm-step-diamond-green.svg",
		activeIcon: "/assets/images/provider-dashboard/prizeForm-step-diamond.png",
		nextIcon: "/assets/images/provider-dashboard/prizeForm-step-diamond.svg",
		title: "Prize info",
		description: "Your prize information",
	},
	{
		id: 1,
		prevIcon: "/assets/images/provider-dashboard/step-1-green.svg",
		activeIcon: "/assets/images/provider-dashboard/step-1-active.svg",
		nextIcon: "/assets/images/provider-dashboard/step-1-off.svg",
		title: "Time/Enrollment Limitation",
		description: "Information of time and enrollment ",
	},
	{
		id: 2,
		prevIcon: "/assets/images/provider-dashboard/step-2-green.png",
		activeIcon: "/assets/images/provider-dashboard/step-2-active.png",
		nextIcon: "/assets/images/provider-dashboard/step-2-off.png",
		title: "Requirements",
		description: "Add requirements for Enrollment",
	},
	{
		id: 3,
		prevIcon: "/assets/images/provider-dashboard/step-3-green.png",
		activeIcon: "/assets/images/provider-dashboard/step-3-active.png",
		nextIcon: "/assets/images/provider-dashboard/step-3-off.png",
		title: "Social Media  & Contact Info",
		description: "Add your contact info & Social Media ",
	},
	{
		id: 4,
		prevIcon: "/assets/images/provider-dashboard/step-4-green.svg",
		activeIcon: "/assets/images/provider-dashboard/step-4-active.svg",
		nextIcon: "/assets/images/provider-dashboard/step-4-off.svg",
		title: "Deposit Prize",
		description: "Deposit Token or Nft",
	},
	{
		id: 5,
		prevIcon: "/assets/images/provider-dashboard/step-5-active.svg",
		activeIcon: "/assets/images/provider-dashboard/step-5-active.svg",
		nextIcon: "/assets/images/provider-dashboard/step-5-off.svg",
		title: "Verification",
		description: "Processing your request",
	},
];