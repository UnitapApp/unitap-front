"use client";

import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Link from "next/link";
import { FC } from "react";

const ProviderTokenCreateStep2: FC = () => {
  const { age, setAge, name } = useTokenTapFromContext();


	
  return (
    <div className="w-full">
      <div>
        <p>Your name is: {name}</p>
        <div>Age:</div>
        <input
          type="number"
          placeholder="Age"
          className="p-2 m-3 text-black"
          onChange={(e) => setAge(Number(e.target.value))}
          value={age}
        />
      </div>
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

export default ProviderTokenCreateStep2;
