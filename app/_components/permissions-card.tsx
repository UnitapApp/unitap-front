import Tooltip from "@/components/ui/Tooltip";
import { Permission } from "@/types";
import { replacePlaceholders } from "@/utils";
import Image from "next/image";
import { FC, useMemo, useState } from "react";

const PermissionsCard: FC<{
  pk: number;
  constraints: Permission[];
  constraintParams: string;
}> = ({ pk, constraints, constraintParams }) => {
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  const params = useMemo(
    () => JSON.parse(constraintParams || "{}"),
    [constraintParams],
  );

  const verificationsList = showAllPermissions
    ? constraints.filter((permission) => permission.type === "VER")
    : constraints
        .filter((permission) => permission.type === "VER")
        .slice(0, 10);

  return (
    <div className="constraints-wrapper relative flex flex-wrap items-center gap-2 rounded-2xl pl-4 text-xs">
      {verificationsList.map((permission, key) => (
        <div key={key}>
          <span className="text-lg text-[#D9D9D9]">{key === 0 || "|"}</span>
          <Tooltip
            className={"rounded-lg px-3 py-1 "}
            data-testid={`verification-${pk}-${permission.name}`}
            text={replacePlaceholders(
              (permission.isReversed
                ? permission.negativeDescription
                : permission.description)!,
              params[permission.name],
            )}
          >
            <div className="flex items-center gap-3 text-[#B5B5C6]">
              {permission.title}
            </div>
          </Tooltip>
        </div>
      ))}

      {constraints.length > 2 && (
        <button
          onClick={setShowAllPermissions.bind(null, !showAllPermissions)}
          className={`collapse-handler absolute bottom-0 right-0 top-0 z-10 ml-auto flex items-center rounded-r-2xl px-3 py-4`}
        >
          <Image
            alt="angle-down"
            width={12}
            height={7}
            src="/assets/images/token-tap/angle-down.svg"
            className={`ml-2 ${
              showAllPermissions ? "rotate-180" : ""
            } transition-transform`}
          />
        </button>
      )}
    </div>
  );
};

export default PermissionsCard;
