"use client";
import OfferPrizeForm from "@/components/containers/provider-dashboard/prize-tap/OfferPrizeForm";
import { useParams, usePathname } from "next/navigation";

const Page = () => {
  const params = useParams();
  return (
    <div>
      <OfferPrizeForm verificationRafflePK={params.id as string} />
    </div>
  );
};

export default Page;