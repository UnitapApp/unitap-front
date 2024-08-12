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
          style={{
            background: "url('/assets/images/prize-tap/enroll.svg')",
          }}
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
      ? selectedRaffleForEnroll?.constraints[currentRequirementIndex]
      : null;

  const appName = constraint?.name.split(".").splice(1).join(".");

  const app = appName ? appInfos[requirementsConnections[appName]!] : undefined;

  const params = useMemo(
    () =>
      selectedRaffleForEnroll
        ? JSON.parse(selectedRaffleForEnroll.constraintParams || "{}")
        : {},
    [selectedRaffleForEnroll],
  );

  console.log(params);
  useEffect(() => {
    if (!constraint || !userToken || !selectedRaffleForEnroll) return;

    getAllConnections(userToken).then(setConnections);
  }, [constraint, selectedRaffleForEnroll, userToken]);

  const link = useRequirementLinkGenerator({
    params,
    constraint,
    appName,
  });

  const [twitterBatchPermissions, setTwitterBatchPermissions] =
    useState<null | PermissionInfoProp>(null);

  const [followedCount, setFollowedCount] = useState<number>(0);

  const [twitterCountList, setTwitterCountList] = useState<number>(0);

  useEffect(() => {
    const res = permissions.find(
      (item) => item.name === "core.IsFollowingTwitterBatch",
    );
    if (res) {
      setFollowedCount(
        Object.values(res.info).filter((value) => value === true).length,
      );
      setTwitterCountList(Object.keys(res.info).length);

      setTwitterBatchPermissions(res.info);
    }
  }, [permissions]);

  if (!constraint)
    return (
      <main className="h-full flex-1 rounded-lg bg-gray20 p-2 text-sm"></main>
    );

  return (
    <div className="flex h-[420px] flex-1 flex-col gap-2">
      <main className="flex h-full max-h-[380px] flex-1 flex-col overflow-y-scroll rounded-lg bg-gray20 p-2 text-center text-sm text-white">
        {app && (
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
                      {twitterBatchPermissions &&
                      twitterBatchPermissions[id] ? (
                        <div className="flex h-[33px] w-[109px] items-center justify-center gap-2 rounded-lg border border-space-green bg-gray30 text-space-green">
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
                              fill-opacity="0.2"
                              stroke="#4CE6A1"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11.0168 6.64871C11.1421 6.76888 11.1421 6.9637 11.0168 7.08386L7.48591 10.4685C7.36055 10.5886 7.15731 10.5886 7.03196 10.4685L5.42702 8.93001C5.30167 8.80985 5.30167 8.61503 5.42702 8.49487C5.55238 8.37471 5.75561 8.37471 5.88097 8.49487L7.25893 9.81576L10.5628 6.64871C10.6882 6.52855 10.8914 6.52855 11.0168 6.64871Z"
                              fill="#4CE6A1"
                            />
                          </svg>
                          Followed
                        </div>
                      ) : (
                        <div className="follow-btn-wrapper overflow-hidden rounded-lg p-[1px]">
                          <Link
                            href={`https://x.com/${FarcasterObject[id].name}`}
                            target="_blank"
                          >
                            <div className="rounded-lg bg-gray30">
                              <div className="gradient-text-follow flex h-[33px] w-[109px] cursor-pointer items-center justify-center rounded-[7px] font-semibold">
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
                        <div className="flex h-[33px] w-[109px] items-center justify-center gap-2 rounded-lg border border-space-green bg-gray30 text-space-green">
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
                              fill-opacity="0.2"
                              stroke="#4CE6A1"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M11.0168 6.64871C11.1421 6.76888 11.1421 6.9637 11.0168 7.08386L7.48591 10.4685C7.36055 10.5886 7.15731 10.5886 7.03196 10.4685L5.42702 8.93001C5.30167 8.80985 5.30167 8.61503 5.42702 8.49487C5.55238 8.37471 5.75561 8.37471 5.88097 8.49487L7.25893 9.81576L10.5628 6.64871C10.6882 6.52855 10.8914 6.52855 11.0168 6.64871Z"
                              fill="#4CE6A1"
                            />
                          </svg>
                          Followed
                        </div>
                      ) : (
                        <div className="follow-btn-wrapper overflow-hidden rounded-lg p-[1px]">
                          <Link
                            href={`https://x.com/${TwitterObject[id].name}`}
                            target="_blank"
                          >
                            <div className="rounded-lg bg-gray30">
                              <div className="gradient-text-follow flex h-[33px] w-[109px] cursor-pointer items-center justify-center rounded-[7px] font-semibold">
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
                <div className="flex items-center justify-center gap-5">
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
              {constraint.name === "core.IsFollowingTwitterBatch" ? (
                <button
                  onClick={refreshPermissions}
                  disabled={loading}
                  className={`text-[12px]font-bold ml-auto w-[136px] rounded-xl border border-gray90 bg-gray30 px-2 py-2 disabled:opacity-50 ${isExhusted ? "!border-warn !text-warn" : ""}`}
                >
                  {loading ? (
                    <Lottie
                      width={40}
                      height={20}
                      options={loadingAnimationRequirementsOption}
                    ></Lottie>
                  ) : isExhusted ? (
                    "Try Again"
                  ) : (
                    "Verify All"
                  )}
                </button>
              ) : (
                <button
                  onClick={refreshPermissions}
                  disabled={loading}
                  className={`ml-auto w-20 rounded-xl border-gray100 bg-gray70 px-2 py-2 disabled:opacity-50 ${isExhusted ? "!border-warn !text-warn" : ""}`}
                >
                  {loading ? (
                    <Lottie
                      width={40}
                      height={20}
                      options={loadingAnimationRequirementsOption}
                    ></Lottie>
                  ) : isExhusted ? (
                    "Try Again"
                  ) : (
                    "Verify"
                  )}
                </button>
              )}
            </div>
          )
        ) : (
          <Link href="/profile" className="w-full">
            <ClaimAndEnrollButton className="!w-full">
              <p>Connect {app?.label}</p>
            </ClaimAndEnrollButton>
          </Link>
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
