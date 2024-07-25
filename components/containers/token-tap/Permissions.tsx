"use client";

import { getTokenConstraintsVerifications } from "@/utils/api";
import { FC, useEffect, useMemo, useState } from "react";
import { Permission, Token } from "@/types";
import { useUserProfileContext } from "@/context/userProfile";
import Tooltip from "@/components/ui/Tooltip";
import { ClaimAndEnrollButton } from "@/components/ui/Button/button";
import { replacePlaceholders } from "@/utils";
import ReactMarkdown from "react-markdown";

const TokenPermissions: FC<{ token: Token; onClose: () => void }> = ({
  token,
  onClose,
}) => {
  const { userToken } = useUserProfileContext();

  const [loading, setLoading] = useState(false);

  const [permissions, SetPermissions] = useState<
    (Permission & { isVerified: boolean })[]
  >([]);

  const params = useMemo(
    () => JSON.parse(token.constraintParams ?? "{}"),
    [token.constraintParams],
  );

  useEffect(() => {
    if (!userToken) return;

    setLoading(true);

    getTokenConstraintsVerifications(token.id, userToken)
      .then((res) => {
        SetPermissions(res.constraints);
      })
      .catch(() => {
        SetPermissions(
          token.constraints.map((constraint) => ({
            ...constraint,
            isVerified: false,
          })),
        );
      })
      .finally(() => setLoading(false));
  }, [userToken, token.constraints, token.id, SetPermissions]);

  return (
    <div className="w-full">
      <div className="relative mb-20 text-center">
        <div className="mx-auto h-40 w-64" />
        <img
          src={token.imageUrl}
          className="absolute left-1/2 top-5 -translate-x-1/2"
          alt={token.name}
          width={168}
        />
      </div>

      {loading ? (
        <div className="relative mt-10 animate-pulse">
          <div className="flex items-center gap-2 overflow-x-auto overflow-y-hidden text-xs">
            {Array.from(new Array(5)).map((_, index) => (
              <div
                key={index}
                className="relative inline-block h-7 w-20 flex-1 rounded-lg border border-gray70 bg-gray50 px-2 py-2"
              />
            ))}
          </div>

          <div className="relative mt-5 h-14 w-full rounded-xl border-2 border-solid border-gray70 bg-gray50 py-3 text-center"></div>
        </div>
      ) : (
        <>
          <div
            className={`flex flex-wrap items-center gap-2 text-xs text-white`}
          >
            {permissions.map((permission, key) => (
              <Tooltip
                className={
                  "rounded-lg border border-gray70 bg-gray50 px-2 py-2 transition-colors hover:bg-gray10 " +
                  (permission.isVerified ? "text-space-green" : "text-warn")
                }
                data-testid={`token-verification-modal-${token.id}-${permission.name}`}
                key={key}
                text={
                  <ReactMarkdown className="markdown">
                    {replacePlaceholders(
                      (permission.isReversed
                        ? permission.negativeDescription
                        : permission.description)!,
                      params[permission.name],
                    )}
                  </ReactMarkdown>
                }
              >
                <div className="flex items-center gap-1">
                  <img
                    alt={permission.name}
                    src={
                      permission.isVerified
                        ? "/assets/images/token-tap/check.svg"
                        : "/assets/images/token-tap/not-verified.svg"
                    }
                  />
                  {permission.title}
                </div>
              </Tooltip>
            ))}
          </div>

          {permissions.some((item) => !item.isVerified) ? (
            <button
              disabled
              className="mt-5 w-full rounded-xl border-2 border-solid border-warn bg-[#392821] py-3 text-center text-warn"
            >
              Complete requirements first!
            </button>
          ) : (
            <ClaimAndEnrollButton
              height="48px"
              $fontSize="14px"
              className="mt-5 !w-full"
              onClick={onClose}
            >
              <div className="relative w-full">
                <p> Claim </p>
              </div>
            </ClaimAndEnrollButton>
          )}
        </>
      )}
    </div>
  );
};

export default TokenPermissions;
