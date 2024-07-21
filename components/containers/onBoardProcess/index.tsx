"use client";

import { Button } from "@/components/ui/Button/button";
import { useGlobalContext } from "@/context/globalProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { BrightIdModalState } from "@/types";
import { parseCookies } from "@/utils/cookies";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const steps = [
  {
    id: "profile-dropdown",
    title: "Profile Drop down",
    description:
      "Where you can go to your own profile or check your credits in GasTap, TokenTap or PrizeTap.",
    insetY: 290,
    insetX: 30,
  },
  {
    id: "gastap",
    title: "Gas Tap",
    description: "Claim gas fees for any reason and make transactions easily",
    insetY: 220,
    insetX: 150,
  },
  {
    id: "tokentap",
    title: "Token Tap",
    description: "Get the tasks done and claim your rewards.",
    insetY: 220,
    insetX: 150,
  },
  {
    id: "prizetap",
    title: "Prize Tap",
    description: "Where everyone has chances to win larger prizes.",
    insetY: 220,
    insetX: 150,
  },
  {
    id: "learntap",
    title: "Learn Tap",
    description: "Where users can learn to use web3 technologies.",
    position: "above",
    insetY: 1000,
    insetX: 30,
  },
];

const OnBoardProcess = () => {
  const { userProfile } = useUserProfileContext();
  const { brightidModalStatus, isWalletPromptOpen } = useGlobalContext();

  const [showIntro, setShowIntro] = useState(false);
  const [step, setStep] = useState(0);
  const pathname = usePathname();

  const currentState = steps[step];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cookies = useMemo(() => parseCookies(), [pathname]);

  const onNextStep = () => {
    if (step === steps.length - 1) {
      setStep(0);
      setShowIntro(false);
      document.cookie = "tutorial=false;path=/;";
      document.body.classList.remove("overflow-hidden");

      return;
    }
    setStep(step + 1);
  };

  const onPreviousStep = () => {
    setStep(step - 1);
  };

  const onSkip = () => {
    setShowIntro(false);
    document.cookie = "tutorial=false;path=/;";
    document.body.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    if (!showIntro || !currentState || !userProfile) return;

    const element = document.getElementById(currentState.id);

    const offset = 20;

    if (!element) return;

    document.body.classList.add("overflow-hidden");

    const highlightElement = document.createElement("div");

    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth",
    });

    const onScrollEnd = () => {
      element?.classList.add("overflow-hidden", "relative", "z-50");

      const diagonalLength = Math.sqrt(
        Math.pow(element.clientWidth, 2) + Math.pow(element.clientHeight, 2),
      );

      // highlightElement.style.width = `${diagonalLength}px`;
      // highlightElement.style.height = `${diagonalLength}px`;
      highlightElement.style.top = `-${currentState.insetY / 2}px`;
      highlightElement.style.bottom = `-${currentState.insetY / 2}px`;
      highlightElement.style.left = `-${currentState.insetX / 2}px`;
      highlightElement.style.right = `-${currentState.insetX / 2}px`;

      highlightElement.classList.add(
        "absolute",
        "bg-g-primary",
        "animate-spin-slow",
      );

      element.appendChild(highlightElement);
    };

    if (
      window.scrollY === element.offsetTop - offset ||
      (step === 0 && window.scrollY === 0)
    )
      onScrollEnd();

    document.addEventListener("scrollend", onScrollEnd);

    return () => {
      document.removeEventListener("scrollend", onScrollEnd);
      element?.classList.remove("bg-g-primary", "relative", "z-50");
      try {
        element?.removeChild(highlightElement);
      } catch (e) {
        console.log(e);
      }
    };
  }, [step, showIntro, currentState, userProfile]);

  useEffect(() => {
    if (
      !userProfile ||
      brightidModalStatus !== BrightIdModalState.CLOSED ||
      isWalletPromptOpen
    )
      return;
    const showTutorial = cookies["tutorial"];

    const timeout = setTimeout(() => {
      if (showTutorial === "true" && pathname === "/") {
        setShowIntro(true);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [cookies, pathname, userProfile, brightidModalStatus, isWalletPromptOpen]);

  if (!currentState) return null;

  return (
    <div
      className={
        "inset-0 z-20 flex flex-col items-center justify-center px-2 backdrop-blur-sm " +
        (showIntro ? "animate-fade-in fixed" : "hidden")
      }
    >
      <div className="absolute inset-0 -z-10 bg-gray10 opacity-80"></div>

      <div
        className={`z-80 relative mt-52 w-[900px] max-w-full overflow-hidden rounded-2xl border border-gray70 shadow-lg transition-all lg:mt-8 ${
          currentState.position && currentState.position === "above"
            ? "!-translate-y-1/2 lg:!-mt-72"
            : ""
        }`}
      >
        <div className="bg-gray40 p-5">
          <h3>{currentState.title}</h3>
          <p className="mt-3 text-sm">{currentState.description}</p>
        </div>
        <div className="flex w-full items-center justify-between bg-gray20 p-3 text-sm">
          <Button
            onClick={onSkip}
            className="border border-gray70 bg-gray40 !font-normal text-gray100"
          >
            Skip All
          </Button>

          <div className="flex items-center gap-4">
            <Button
              onClick={onPreviousStep}
              disabled={step === 0}
              className="border border-gray70 bg-gray40 !font-normal text-gray100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Previous
            </Button>
            <button
              onClick={onNextStep}
              className="rounded-xl bg-g-primary p-[1px]"
            >
              <div className="flex h-[40px] items-center justify-center rounded-xl bg-gray40 px-8">
                {step === steps.length - 1 ? "Done" : "Next"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardProcess;
