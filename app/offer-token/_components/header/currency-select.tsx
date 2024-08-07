"use client";

import { Select, SelectItem } from "@nextui-org/react";
import Image from "next/image";

const tokens: any[] = [];

const CurrencySelect = () => {
  return (
    <div className="background-dashboard rounded-4xl flex items-center gap-4 border-2 border-gray60 p-10">
      <Select
        className="max-w-xs"
        defaultSelectedKeys={["cat"]}
        placeholder="USDC / UXP"
        size="lg"
        radius="lg"
        startContent={
          <Image
            src="/assets/images/offer-token/coins.svg"
            alt="coins"
            width={40}
            height={40}
          />
        }
      >
        {tokens.map((animal: any) => (
          <SelectItem key={animal.key}>{animal.label}</SelectItem>
        ))}
      </Select>

      <div className="ml-auto text-center">
        <p className="text-gray90">24h Change</p>
        <p className="font-semibold text-white">-1,172.00</p>
      </div>

      <div className="text-center">
        <p className="text-gray90">24h Change</p>
        <p className="font-semibold text-white">-1,172.00</p>
      </div>

      <div className="text-center">
        <p className="text-gray90">24h Change</p>
        <p className="font-semibold text-white">-1,172.00</p>
      </div>
    </div>
  );
};

export default CurrencySelect;
