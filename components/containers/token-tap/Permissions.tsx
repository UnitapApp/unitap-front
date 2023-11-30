"use client"

import { getTokenConstraintsVerifications } from "@/utils/api"
import { FC, useEffect, useState } from "react"
import { Permission, Token } from "@/types"
import { useUserProfileContext } from "@/context/userProfile"
import Tooltip from "@/components/ui/Tooltip"
import { ClaimAndEnrollButton } from "@/components/ui/Button/button"

const TokenPermissions: FC<{ token: Token; onClose: () => void }> = ({
  token,
  onClose,
}) => {
  const { userToken } = useUserProfileContext()

  const [loading, setLoading] = useState(false)

  const [permissions, SetPermissions] = useState<
    (Permission & { isVerified: boolean })[]
  >([])

  useEffect(() => {
    if (!userToken) return

    setLoading(true)

    getTokenConstraintsVerifications(token.id, userToken)
      .then((res) => {
        SetPermissions(res.constraints)
      })
      .catch(() => {
        SetPermissions(
          token.permissions.map((constraint) => ({
            ...constraint,
            isVerified: false,
          }))
        )
      })
      .finally(() => setLoading(false))
  }, [userToken, token.permissions, token.id, SetPermissions])

  return (
    <div className="w-full">
      <div className="mb-20 text-center relative">
        <div className="w-64 h-40 mx-auto" />
        <img
          src={token.imageUrl}
          className="absolute left-1/2 -translate-x-1/2 top-5"
          alt={token.name}
          width={168}
        />
      </div>

      {loading ? (
        <div className="relative animate-pulse mt-10">
          <div className="flex overflow-y-hidden overflow-x-auto items-center text-xs gap-2">
            {Array.from(new Array(5)).map((_, index) => (
              <div
                key={index}
                className="relative inline-block border-gray70 bg-gray50 border px-2 py-2 rounded-lg flex-1 w-20 h-7"
              />
            ))}
          </div>

          <div className="mt-5 text-center relative py-3 bg-gray50 border-gray70 border-2 border-solid w-full h-14 rounded-xl"></div>
        </div>
      ) : (
        <>
          <div
            className={`flex items-center flex-wrap text-xs gap-2 text-white`}
          >
            {permissions.map((permission, key) => (
              <Tooltip
                className={
                  "border-gray70 bg-gray50 hover:bg-gray10 transition-colors border px-2 py-2 rounded-lg " +
                  (permission.isVerified ? "text-space-green" : "text-warn")
                }
                data-testid={`token-verification-modal-${token.id}-${permission.name}`}
                key={key}
                text={permission.description}
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
              className="mt-5 text-center text-warn py-3 bg-[#392821] border-warn border-2 border-solid w-full rounded-xl"
            >
              Complete requirements first!
            </button>
          ) : (
            <ClaimAndEnrollButton
              height="48px"
              $fontSize="14px"
              className="!w-full mt-5"
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
  )
}

export default TokenPermissions
