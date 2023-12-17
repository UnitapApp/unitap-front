"use client";

import { Button } from "@/components/ui/Button/button";
import { useUserProfileContext } from "@/context/userProfile";
import { parseCookies } from "@/utils/cookies";
import { useEffect, useMemo, useState } from "react";

const steps = [
  {
    id: "profile-dropdown",
    title: "Profile Drop down",
    description:
      "Where you can go to your own profile or check your credits in GasTap, TokenTap or PrizeTap",
  },
];

const OnBoardProcess = () => {
  const cookies = useMemo(() => parseCookies(), []);
  const { userProfile } = useUserProfileContext();

  const [showIntro, setShowIntro] = useState(true);
  const [step, setStep] = useState(0);

  const currentState = steps[step];

  useEffect(() => {
    if (!showIntro || !currentState) return;

    const selectedElement = document.getElementById(currentState.id);

    if (!selectedElement) return;
  }, [step, showIntro, currentState]);

  return (
    <div
      className={
        "z-50 inset-0 flex flex-col items-center justify-center " +
        (showIntro ? "fixed" : "hidden")
      }
    >
      <div className="absolute inset-0 -z-10 bg-gray10 opacity-40"></div>

      <div className="w-[900px] border-2 border-gray70 rounded-lg overflow-hidden">
        <div className="bg-gray40 p-5">
          <h3>Profile Drop down</h3>
          <p className="mt-3 text-sm">
            Where you can go to your own profile or check your credits in
            GasTap, TokenTap or PrizeTap.
          </p>
        </div>
        <div className="bg-gray20 text-sm w-full p-3 flex items-center justify-between">
          <Button className="border bg-gray40 text-gray100 !font-normal border-gray70">
            Skip All
          </Button>

          <div className="flex gap-4 items-center">
            <Button className="border disabled:cursor-not-allowed disabled:opacity-60 bg-gray40 text-gray100 !font-normal border-gray70">
              Previous
            </Button>
            <button className="bg-g-primary p-[1px] rounded-xl">
              <div className="bg-gray40 flex items-center justify-center px-8 h-[40px] rounded-xl">
                Next
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardProcess;
