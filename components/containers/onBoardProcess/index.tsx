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
    description:
      "Where everyone can claim any kind of tokens such as community tokens, NFT, UBI token.",
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
  const { brightidModalStatus } = useGlobalContext();

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
      document.cookie = "tutorial=false";
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
    document.cookie = "tutorial=false";
    document.body.classList.remove("overflow-hidden");
  };

  useEffect(() => {
    if (!showIntro || !currentState || !userProfile) return;
    document.body.classList.add("overflow-hidden");

    const element = document.getElementById(currentState.id);

    const offset = 20;

    if (!element) return;

    const highlightElement = document.createElement("div");

    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth",
    });

    const onScrollEnd = () => {
      element?.classList.add("overflow-hidden", "relative", "z-50");

      const diagonalLength = Math.sqrt(
        Math.pow(element.clientWidth, 2) + Math.pow(element.clientHeight, 2)
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
        "animate-spin-slow"
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
    if (!userProfile || brightidModalStatus !== BrightIdModalState.CLOSED)
      return;
    const showTutorial = cookies["tutorial"];

    const timeout = setTimeout(() => {
      if ((!showTutorial || showTutorial === "true") && pathname === "/") {
        setShowIntro(true);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [cookies, pathname, userProfile, brightidModalStatus]);

  if (!currentState) return null;

  return (
    <div
      className={
        "z-20 inset-0 flex flex-col px-2 items-center backdrop-blur-sm justify-center " +
        (showIntro ? "fixed animate-fade-in" : "hidden")
      }
    >
      <div className="absolute inset-0 -z-10 bg-gray10 opacity-80"></div>

      <div
        className={`w-[900px] max-w-full mt-52 lg:mt-8 transition-all relative z-80 border border-gray70 rounded-2xl shadow-lg overflow-hidden ${
          currentState.position && currentState.position === "above"
            ? "lg:-mt-72 -translate-y-1/2"
            : ""
        }`}
      >
        <div className="bg-gray40 p-5">
          <h3>{currentState.title}</h3>
          <p className="mt-3 text-sm">{currentState.description}</p>
        </div>
        <div className="bg-gray20 text-sm w-full p-3 flex items-center justify-between">
          <Button
            onClick={onSkip}
            className="border bg-gray40 text-gray100 !font-normal border-gray70"
          >
            Skip All
          </Button>

          <div className="flex gap-4 items-center">
            <Button
              onClick={onPreviousStep}
              disabled={step === 0}
              className="border disabled:cursor-not-allowed disabled:opacity-60 bg-gray40 text-gray100 !font-normal border-gray70"
            >
              Previous
            </Button>
            <button
              onClick={onNextStep}
              className="bg-g-primary p-[1px] rounded-xl"
            >
              <div className="bg-gray40 flex items-center justify-center px-8 h-[40px] rounded-xl">
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
