import { appInfos } from "@/app/incentive-center/constants/integrations";
import {
  checkConnections,
  loadingAnimationRequirementsOption,
  renderLinkValue,
  requirementsConnections,
  requirementWithoutApps,
  useRequirementLinkGenerator,
} from "@/components/containers/token-tap/Modals/TokenRequirementModal";
import { ClaimAndEnrollButton } from "@/components/ui/Button/button";
import { FarcasterObject, TwitterObject } from "@/constants/twitterAddresses";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { Permission, PermissionInfoProp, Prize, UserConnection } from "@/types";
import { replacePlaceholders } from "@/utils";
import {
  getRaffleConstraintsVerifications,
  getTokenConstraintsVerifications,
} from "@/utils/api";
import { getAllConnections } from "@/utils/serverApis";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { FC, Fragment, useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import ReactMarkdown from "react-markdown";

const Sidebar: FC<{
  prize: Prize;
  permissions: (Permission & { isVerified: boolean })[];
  currentRequirementIndex: number;
  setCurrentRequirementIndex: (value: number) => void;
}> = ({
  prize,
  permissions,
  currentRequirementIndex,
  setCurrentRequirementIndex,
}) => {
  const { setMethod } = usePrizeTapContext();
  useEffect(() => {
    setCurrentRequirementIndex(
      prize.constraints.findIndex((item) => item.type === "VER"),
    );
  }, []);

  useEffect(() => {
    if (
      (!!permissions.length ? permissions : prize.constraints).length !==
      (!!permissions.length ? permissions : prize.constraints).filter(
        (item: any) => item.isVerified,
      ).length
    )
      return;

    setMethod("Verify");
  }, [permissions, prize, setMethod]);

  return (
    <aside className="relative h-full w-[230px] rounded-lg bg-gray20 p-2 text-sm">
      <div className=" relative mb-8 flex h-[112px] items-center justify-center rounded-2xl border border-gray60">
        <img
          src={prize.imageUrl}
          width="80px"
          height="140px"
          className="opacity-30"
        />
        <div className="absolute left-4 top-2 font-medium text-white">
          {prize.name}
        </div>
        <div className="absolute left-4 top-6 font-medium text-gray90">
          by {prize.creatorName}
        </div>
        <div className="absolute bottom-2 left-4 font-medium text-gray90">
          Requirements
        </div>
      </div>
      <div className="relative mt-3">
        <div className="rounded-xl border-2 border-dark-space-green bg-dark-space-green/30 p-2 text-center font-semibold">
          {
            (!!permissions.length ? permissions : prize.constraints).filter(
              (item: any) => item.isVerified,
            ).length
          }
          /{(!!permissions.length ? permissions : prize.constraints).length}{" "}
          Done
        </div>
        <div className="mx-auto h-3 w-[2px] bg-gray80"></div>
        {(!!permissions.length ? permissions : prize.constraints).map(
          (constraint: any, index) => (
            <Fragment key={index}>
              <button
                onClick={() => setCurrentRequirementIndex(index)}
                className={`block w-full rounded-xl border-2 border-gray50 p-2 text-center text-gray100 ${index === currentRequirementIndex ? "!border-gray100 bg-gray70 text-white" : ""} ${constraint.isVerified ? "!border-dark-space-green" : ""}`}
              >
                {constraint.title}
              </button>
              {index === prize.constraints.length - 1 || (
                <div className="mx-auto h-3 w-[2px] bg-gray80"></div>
              )}
            </Fragment>
          ),
        )}

        <button
          disabled={
            (!!permissions.length ? permissions : prize.constraints).length !==
            (!!permissions.length ? permissions : prize.constraints).filter(
              (item: any) => item.isVerified,
            ).length
          }
          className={` mt-3 block w-full rounded-xl border-2 border-space-green p-2 text-center disabled:border-gray50 disabled:opacity-60`}
          // style={{
          //   background: "url('/assets/images/prize-tap/enroll.svg')",
          // }}
          onClick={() => setMethod("Verify")}
        >
          Enroll
        </button>
      </div>
    </aside>
  );
};

const PrizeRequirementBody: FC<{
  permissions: (Permission & { isVerified: boolean })[];
  refreshPermissions: () => void;
  currentRequirementIndex: number;
  setCurrentRequirementIndex: (value: number) => void;
  loading: boolean;
  isExhusted: boolean;
}> = ({
  permissions,
  refreshPermissions,
  loading,
  currentRequirementIndex,
  setCurrentRequirementIndex,
  isExhusted,
}) => {
  const { selectedRaffleForEnroll } = usePrizeTapContext();

  const { userToken } = useUserProfileContext();

  const [connections, setConnections] = useState<UserConnection>({});

  const constraint =
    currentRequirementIndex !== undefined
      ? permissions[currentRequirementIndex] ??
        selectedRaffleForEnroll?.constraints[currentRequirementIndex]
      : null;

  const { seconds, reset } = useTimer({ seconds: 60, minutes: 0, hours: 0 });

  useEffect(() => {
    if (isExhusted) reset();
  }, [isExhusted]);

  const appName = constraint?.name.split(".").splice(1).join(".");

  const app = appName ? appInfos[requirementsConnections[appName]!] : undefined;

  const params = useMemo(
    () =>
      selectedRaffleForEnroll
        ? JSON.parse(selectedRaffleForEnroll.constraintParams || "{}")
        : {},
    [selectedRaffleForEnroll],
  );

  const [isConnectionReady, setIsConnectionReady] = useState(false);

  const handleGetConnection = async () => {
    setIsConnectionReady(false);
    await getAllConnections(userToken!).then(setConnections);
    setIsConnectionReady(true);
  };

  useEffect(() => {
    if (!constraint || !userToken || !selectedRaffleForEnroll) return;
    handleGetConnection();
  }, [constraint, selectedRaffleForEnroll, userToken]);

  const link = useRequirementLinkGenerator({
    params,
    constraint,
    appName,
  });

  const [twitterBatchPermissions, setTwitterBatchPermissions] =
    useState<null | PermissionInfoProp>(null);

  const [farCasterBatchPermissions, setFarCasterBatchPermissions] =
    useState<null | PermissionInfoProp>(null);

  const [followedCount, setFollowedCount] = useState<number>(0);
  const [farcasterFollowedCount, setFarcasterFollowedCount] =
    useState<number>(0);

  const [twitterCountList, setTwitterCountList] = useState<number>(0);
  const [farcasterCountList, setFarcasterCountList] = useState<number>(0);

  useEffect(() => {
    const res = permissions.find(
      (item) => item.name === "core.IsFollowingTwitterBatch",
    );
    const farcasterRes = permissions.find(
      (item) => item.name === "core.IsFollowingFarcasterBatch",
    );

    if (farcasterRes && farcasterRes.info) {
      setFarcasterFollowedCount(
        Object.values(farcasterRes.info).filter((value) => value === true)
          .length,
      );
      setFarcasterCountList(Object.keys(farcasterRes.info).length);

      setFarCasterBatchPermissions(farcasterRes.info);
    }

    if (res && res.info) {
      setFollowedCount(
        Object.values(res.info).filter((value) => value === true).length,
      );
      setTwitterCountList(Object.keys(res.info).length);

      setTwitterBatchPermissions(res.info);
    }
  }, [permissions]);

  useEffect(() => {
    let isMounted = false;

    const windowObj: any = window;

    windowObj.onloadTurnstileCallback = function () {
      isMounted = true;
      windowObj.turnstile.render("#captcha-cloudflare-container", {
        sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSITE_SITEKEY,
        callback: function (token: string) {
          localStorage.setItem("captcha-token", token);
        },
      });
    };

    if (!permissions.length) return;

    const isCloudflareCaptcha =
      constraint?.name === "core.HasVerifiedCloudflareCaptcha";

    const handleLoadTurnstile = () => {
      if (!isCloudflareCaptcha) return;

      if (!windowObj.turnstile) {
        setTimeout(handleLoadTurnstile, 300);
        return;
      }

      windowObj.turnstile.render("#captcha-cloudflare-container", {
        sitekey: process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSITE_SITEKEY,
        callback: function (token: string) {
          localStorage.setItem("captcha-token", token);
        },
      });
    };

    handleLoadTurnstile();

    // @ts-ignore
    window.captchaCallback = (token: string) => {
      localStorage.setItem("captcha-token", token);
    };

    return () => {
      isMounted = false;
      // @ts-ignore
      window.captchaCallback = undefined;
    };
  }, [permissions, constraint]);

  if (!constraint)
    return (
      <main className="h-full flex-1 rounded-lg bg-gray20 p-2 text-sm"></main>
    );

  return (
    <div className="flex h-[420px] flex-1 flex-col gap-2">
      <main className="flex h-full max-h-[380px] flex-1 flex-col overflow-y-scroll rounded-lg bg-gray20 p-2 text-center text-sm text-white">
        {app && constraint.name !== "core.IsFollowingTwitterBatch" && (
          <Image
            className="mx-auto"
            src={app.logo}
            width={70}
            height={70}
            alt={app.label}
          />
        )}
        {constraint.name !== "core.IsFollowingTwitterBatch" &&
          constraint.name !== "core.IsFollowingFarcasterBatch" && (
            <h3 className="mt-4 text-base text-white">{constraint.title}</h3>
          )}
        {params["core.IsFollowingFarcasterBatch"] &&
          constraint.name === "core.IsFollowingFarcasterBatch" && (
            <div className=" flex flex-col gap-4 px-2">
              {params["core.IsFollowingFarcasterBatch"]["FARCASTER_FIDS"].map(
                (id: number, index: number) => (
                  <div
                    key={index}
                    className="flex h-[64px] items-center justify-between rounded-xl border border-gray50 bg-gray30 px-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={FarcasterObject[id].logo}
                        width={40}
                        height={40}
                      />
                      <div>{FarcasterObject[id].name}</div>
                    </div>
                    <div className="">
                      {farCasterBatchPermissions &&
                      farCasterBatchPermissions[id] ? (
                        <div className="flex h-[33px] w-[109px] items-center justify-center gap-2 rounded-lg border-2 border-dark-space-green bg-gray30 text-space-green opacity-50">
                          <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="8"
                              cy="8.33643"
                              r="7.5"
                              fill="#4CE6A1"
                              fillOpacity="0.2"
                              stroke="#4CE6A1"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.0168 6.64871C11.1421 6.76888 11.1421 6.9637 11.0168 7.08386L7.48591 10.4685C7.36055 10.5886 7.15731 10.5886 7.03196 10.4685L5.42702 8.93001C5.30167 8.80985 5.30167 8.61503 5.42702 8.49487C5.55238 8.37471 5.75561 8.37471 5.88097 8.49487L7.25893 9.81576L10.5628 6.64871C10.6882 6.52855 10.8914 6.52855 11.0168 6.64871Z"
                              fill="#4CE6A1"
                            />
                          </svg>
                          Followed
                        </div>
                      ) : (
                        <div className="follow-btn-wrapper overflow-hidden rounded-lg p-[2px]">
                          <Link
                            href={`https://warpcast.com/${FarcasterObject[id].name}`}
                            target="_blank"
                          >
                            <div className="rounded-[6px] bg-gray30">
                              <div className="gradient-text-follow flex h-[30px] w-[109px] cursor-pointer items-center justify-center rounded-[5px] font-semibold">
                                Follow
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

        {params["core.IsFollowingTwitterBatch"] &&
          constraint.name === "core.IsFollowingTwitterBatch" && (
            <div className=" flex flex-col gap-4 px-2">
              {params["core.IsFollowingTwitterBatch"]["TWITTER_IDS"].map(
                (id: number, index: number) => (
                  <div
                    key={index}
                    className="flex h-[64px] items-center justify-between rounded-xl border border-gray50 bg-gray30 px-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={TwitterObject[id].logo}
                        width={40}
                        height={40}
                      />
                      <div>{TwitterObject[id].name}</div>
                    </div>
                    <div className="">
                      {twitterBatchPermissions &&
                      twitterBatchPermissions[id] ? (
                        <div className="flex h-[33px] w-[109px] items-center justify-center gap-2 rounded-lg border-2 border-dark-space-green bg-gray30 text-space-green opacity-20">
                          <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="8"
                              cy="8.33643"
                              r="7.5"
                              fill="#4CE6A1"
                              fillOpacity="0.2"
                              stroke="#4CE6A1"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M11.0168 6.64871C11.1421 6.76888 11.1421 6.9637 11.0168 7.08386L7.48591 10.4685C7.36055 10.5886 7.15731 10.5886 7.03196 10.4685L5.42702 8.93001C5.30167 8.80985 5.30167 8.61503 5.42702 8.49487C5.55238 8.37471 5.75561 8.37471 5.88097 8.49487L7.25893 9.81576L10.5628 6.64871C10.6882 6.52855 10.8914 6.52855 11.0168 6.64871Z"
                              fill="#4CE6A1"
                            />
                          </svg>
                          Followed
                        </div>
                      ) : (
                        <div className="follow-btn-wrapper flex h-[33px] items-center justify-center overflow-hidden rounded-lg p-[2px]">
                          <Link
                            href={`https://x.com/${TwitterObject[id].name}`}
                            target="_blank"
                          >
                            <div className="overflow-hidden rounded-[6px] bg-gray30">
                              <div className="gradient-text-follow flex h-[29px] w-[109px] cursor-pointer items-center justify-center rounded-[5px] font-semibold">
                                Follow
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}

        {constraint.name !== "core.IsFollowingTwitterBatch" &&
          constraint.name !== "core.IsFollowingFarcasterBatch" && (
            <p className="mt-2 text-sm text-gray100">
              <ReactMarkdown className="markdown">
                {replacePlaceholders(
                  (constraint.isReversed
                    ? constraint.negativeDescription
                    : constraint.description)!,
                  params[constraint.name],
                )}
              </ReactMarkdown>
            </p>
          )}

        {constraint.name === "core.HasVerifiedCloudflareCaptcha" && (
          <div className="mt-10">
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              async
              defer
            ></Script>

            <div
              id="captcha-cloudflare-container"
              data-sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSITE_SITEKEY}
              // data-sitekey="1x00000000000000000000AA"
              data-callback="captchaCallback"
            ></div>
          </div>
        )}
      </main>
      <div className="mt-auto flex w-full items-center rounded-lg bg-gray20 p-2">
        {checkConnections(connections, constraint.name) ? (
          permissions.find((item) => item.name === constraint.name)
            ?.isVerified ? (
            <button
              className="w-full rounded-lg border border-dark-space-green bg-dark-space-green/10 px-5 py-2 text-sm font-semibold text-space-green"
              onClick={() =>
                setCurrentRequirementIndex(currentRequirementIndex + 1)
              }
              disabled
            >
              Verified
            </button>
          ) : (
            <div className="flex w-full items-center justify-end gap-3 px-2">
              {constraint.name === "core.IsFollowingTwitterBatch" ||
                link === "#" || (
                  <Link target="_blank" href={link} className="w-full">
                    <ClaimAndEnrollButton className="!w-full flex-1">
                      <p>Let{"'"}s Do it</p>
                    </ClaimAndEnrollButton>
                  </Link>
                )}

              {constraint.name === "core.IsFollowingTwitterBatch" && (
                <div className="flex h-[45px] items-center justify-center gap-5">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.0475 13.5514L30.9622 0H28.1398L17.7899 11.7641L9.52963 0H0L12.4939 17.791L0 32H2.82241L13.7451 19.5741L22.4705 32H32.0001M3.84108 2.08253H8.17709L28.1377 30.0198H23.8006"
                      fill="white"
                    />
                  </svg>

                  <div>
                    <div className="text-xs font-medium text-gray90">
                      Follow {twitterCountList} projects on X
                    </div>
                    <div>
                      <span className="text-space-green">
                        {twitterCountList - followedCount}
                      </span>{" "}
                      left to follow
                    </div>
                  </div>
                </div>
              )}

              {constraint.name === "core.IsFollowingFarcasterBatch" && (
                <div className="flex h-[45px] items-center justify-center gap-5">
                  <svg
                    width="32"
                    height="30"
                    viewBox="0 0 32 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.49108 0H26.1301V4.25802H32L30.7692 8.5161H29.7278V25.742C30.2507 25.742 30.6746 26.1752 30.6746 26.7097V27.871H30.8639C31.3868 27.871 31.8107 28.3043 31.8107 28.8387V30L26.1301 30H23.1005L21.2071 30V28.8387C21.2071 28.3043 21.631 27.871 22.1538 27.871H22.3432V26.7097C22.3432 26.2415 22.6684 25.851 23.1005 25.7613V16.2581H23.0709C22.736 12.4601 19.6133 9.48385 15.8106 9.48385C12.0079 9.48385 8.88522 12.4601 8.55036 16.2581H8.52067V25.742H8.71005C9.23292 25.742 9.65682 26.1752 9.65682 26.7097V27.871H9.84615C10.369 27.871 10.7929 28.3043 10.7929 28.8387V30L8.52067 30H5.49108L0.18933 30V28.8387C0.18933 28.3043 0.613236 27.871 1.13611 27.871H1.32544V26.7097C1.32544 26.1752 1.7493 25.742 2.27218 25.742V8.5161H1.23077L0 4.25802H5.49108V0Z"
                      fill="#815AC7"
                    />
                  </svg>

                  <div>
                    <div className="text-xs font-medium text-gray90">
                      Follow {farcasterCountList} projects on X
                    </div>
                    <div>
                      <span className="text-space-green">
                        {farcasterCountList - farcasterFollowedCount}
                      </span>{" "}
                      left to follow
                    </div>
                  </div>
                </div>
              )}

              {constraint.name === "core.IsFollowingTwitterBatch" ? (
                <div className="flex h-[43px] items-center justify-between rounded-xl border border-gray90 bg-gray30">
                  <button
                    onClick={refreshPermissions}
                    disabled={loading || (isExhusted && seconds > 0)}
                    className={`ml-auto h-full w-[121px] border-r border-gray90 text-[12px] text-sm font-bold disabled:opacity-50 ${isExhusted && seconds > 0 ? "!border-warn !text-warn" : ""}`}
                  >
                    {loading ? (
                      <Lottie
                        width={40}
                        height={20}
                        options={loadingAnimationRequirementsOption}
                      ></Lottie>
                    ) : isExhusted && seconds > 0 ? (
                      "Try Again" + " " + seconds
                    ) : (
                      "Verify All"
                    )}
                  </button>
                  <div className="verify-button-toolTip relative flex h-full w-[40px] cursor-pointer items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.0003 17.0837C13.8933 17.0837 17.0837 13.8933 17.0837 10.0003C17.0837 6.10735 13.8933 2.91699 10.0003 2.91699C6.10735 2.91699 2.91699 6.10735 2.91699 10.0003C2.91699 13.8933 6.10735 17.0837 10.0003 17.0837ZM18.3337 10.0003C18.3337 14.5837 14.5837 18.3337 10.0003 18.3337C5.41699 18.3337 1.66699 14.5837 1.66699 10.0003C1.66699 5.41699 5.41699 1.66699 10.0003 1.66699C14.5837 1.66699 18.3337 5.41699 18.3337 10.0003Z"
                        fill="#B5B5C6"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.25 8.95801C10.4571 8.95801 10.625 9.1259 10.625 9.33301V13.9997C10.625 14.2068 10.4571 14.3747 10.25 14.3747H9.75C9.54289 14.3747 9.375 14.2068 9.375 13.9997V9.33301C9.375 9.1259 9.54289 8.95801 9.75 8.95801H10.25Z"
                        fill="#B5B5C6"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.37012 6.41699C9.37012 6.20989 9.53801 6.04199 9.74512 6.04199H10.2526C10.4597 6.04199 10.6276 6.20989 10.6276 6.41699V6.91699C10.6276 7.1241 10.4597 7.29199 10.2526 7.29199H9.74512C9.53801 7.29199 9.37012 7.1241 9.37012 6.91699V6.41699Z"
                        fill="#B5B5C6"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <button
                  onClick={refreshPermissions}
                  disabled={loading || (isExhusted && seconds > 0)}
                  className={`ml-auto w-20 rounded-xl border-gray100 bg-gray70 px-2 py-2 disabled:opacity-50 ${isExhusted && seconds > 0 ? "!border-warn !text-warn" : ""}`}
                >
                  {loading ? (
                    <Lottie
                      width={40}
                      height={20}
                      options={loadingAnimationRequirementsOption}
                    ></Lottie>
                  ) : isExhusted && seconds > 0 ? (
                    "Try Again" + " " + seconds
                  ) : (
                    "Verify"
                  )}
                </button>
              )}
            </div>
          )
        ) : isConnectionReady ? (
          <Link href="/profile" className="w-full">
            <ClaimAndEnrollButton className="!w-full">
              <p>Connect {app?.label}</p>
            </ClaimAndEnrollButton>
          </Link>
        ) : (
          <div className="h-[45px]"></div>
        )}
      </div>
    </div>
  );
};

const PrizeRequirementModal: FC<{
  prize: Prize;
}> = ({ prize }) => {
  const { userToken } = useUserProfileContext();
  const [loading, setLoading] = useState(false);
  const [currentRequirementIndex, setCurrentRequirementIndex] = useState(0);
  const [isExhusted, setIsExhusted] = useState(false);

  const [permissions, SetPermissions] = useState<
    (Permission & { isVerified: boolean })[]
  >([]);

  const refreshPermissions = () => {
    if (!userToken) return;
    setIsExhusted(false);
    setLoading(true);
    getRaffleConstraintsVerifications(prize.pk, userToken)
      .then((res) => {
        SetPermissions(res.constraints);
      })
      .catch(() => {
        SetPermissions(
          prize.constraints.map((constraint) => ({
            ...constraint,
            isVerified: false,
          })),
        );
      })
      .finally(() => {
        setIsExhusted(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!userToken) return;
    setLoading(true);
    getRaffleConstraintsVerifications(prize.pk, userToken)
      .then((res) => {
        SetPermissions(res.constraints);
      })
      .catch(() => {
        SetPermissions(
          prize.constraints.map((constraint) => ({
            ...constraint,
            isVerified: false,
          })),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [prize.constraints, prize.pk, userToken]);

  return (
    <div className="-mt-3 flex h-[420px] w-full items-center justify-start gap-2 overflow-y-auto">
      <Sidebar
        currentRequirementIndex={currentRequirementIndex}
        setCurrentRequirementIndex={setCurrentRequirementIndex}
        permissions={permissions}
        prize={prize}
      />
      <PrizeRequirementBody
        isExhusted={isExhusted}
        loading={loading}
        permissions={permissions}
        refreshPermissions={refreshPermissions}
        currentRequirementIndex={currentRequirementIndex}
        setCurrentRequirementIndex={setCurrentRequirementIndex}
      />
    </div>
  );
};

export default PrizeRequirementModal;

const fillTime = ({
  hours,
  minutes,
  seconds,
}: {
  hours?: number;
  minutes?: number;
  seconds?: number;
}) => {
  return (hours ?? 0) * 3600 + (minutes ?? 0) * 60 + (seconds ?? 0);
};

function useTimer({
  hours,
  minutes,
  seconds,
}: {
  hours?: number;
  minutes?: number;
  seconds?: number;
}) {
  const [timer, setTimer] = useState(fillTime({ hours, minutes, seconds }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const reset = () => {
    setTimer(fillTime({ hours, minutes, seconds }));
  };

  return {
    reset,
    seconds: timer % 60,
    minutes: timer % 3600,
    hours: timer / 3600,
  };
}
