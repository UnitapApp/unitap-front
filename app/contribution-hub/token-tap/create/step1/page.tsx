"use client";

import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Link from "next/link";
import { FC } from "react";

const ProviderTokenCreateStep1: FC = () => {
  const { name, setName } = useTokenTapFromContext();

  const isNameValid = name.length > 5;

  return (
    <div className="w-full">
      <div>
        <div>Name:</div>
        <input
          type="text"
          placeholder="Name"
          className="p-2 m-3 text-black"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      {isNameValid || "name must have more than 5 characters"}
      <div className="text-right">
        <Link
          href="/provider-dashboard/token-tap/create/step2"
          className="mt-5 px-4 py-2 rounded bg-space-green"
        >
          Next step
        </Link>
      </div>
    </div>
  );
};

export default ProviderTokenCreateStep1;
