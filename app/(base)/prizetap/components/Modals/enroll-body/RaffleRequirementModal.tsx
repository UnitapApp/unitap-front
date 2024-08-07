import { appInfos } from "@/app/(base)/incentive-center/constants/integrations";
import {
  checkConnections,
  loadingAnimationRequirementsOption,
  renderLinkValue,
  requirementsConnections,
  requirementWithoutApps,
  useRequirementLinkGenerator,
} from "@/components/containers/token-tap/Modals/TokenRequirementModal";
import { ClaimAndEnrollButton } from "@/components/ui/Button/button";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import { useUserProfileContext } from "@/context/userProfile";
import { Permission, Prize, UserConnection } from "@/types";
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
    <aside className="h-full w-44 overflow-auto rounded-lg bg-gray20 p-2 text-sm">
      <div className="mt-3">
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
          className={`mt-3 block w-full rounded-xl border-2 border-space-green p-2 text-center disabled:border-gray50 disabled:opacity-60`}
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

  useEffect(() => {
    if (!constraint || !userToken || !selectedRaffleForEnroll) return;

    getAllConnections(userToken).then(setConnections);
  }, [constraint, selectedRaffleForEnroll, userToken]);

  const link = useRequirementLinkGenerator({
    params,
    constraint,
    appName,
  });

  if (!constraint)
    return (
      <main className="h-full flex-1 rounded-lg bg-gray20 p-2 text-sm"></main>
    );

  return (
    <main className="flex h-full flex-1 flex-col rounded-lg bg-gray20 p-2 text-center text-sm text-white">
      {app && (
        <Image
          className="mx-auto"
          src={app.logo}
          width={70}
          height={70}
          alt={app.label}
        />
      )}
      <h3 className="mt-4 text-base text-white">{constraint.title}</h3>
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
      <div className="mt-auto flex w-full items-center p-2">
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
            <div className="flex w-full items-center justify-end gap-3">
              {link === "#" || (
                <Link target="_blank" href={link} className="w-full">
                  <ClaimAndEnrollButton className="!w-full flex-1">
                    <p>Let{"'"}s Do it</p>
                  </ClaimAndEnrollButton>
                </Link>
              )}
              {/* {!!linkWithoutApp && (
                <Link target="_blank" href={linkWithoutApp} className="w-full">
                  <ClaimAndEnrollButton className="!w-full flex-1">
                    <p>Let{"'"}s Do it</p>
                  </ClaimAndEnrollButton>
                </Link>
              )} */}
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
    </main>
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
    <div className="-mt-3 flex h-72 w-full items-center justify-start gap-2 overflow-y-auto">
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
