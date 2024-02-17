"use client";
import { useParams } from "next/navigation";
import OfferTokenForm from "../../components/OfferTokenForm";

const Page = () => {
  const params = useParams();
  return <OfferTokenForm detailDistributionPk={params.id as string} />;
};

export default Page;
