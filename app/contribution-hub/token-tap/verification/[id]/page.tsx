"use client";
import React from "react";
import OfferTokenForm from "../../components/OfferTokenForm";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  return <OfferTokenForm verificationDistributePK={params.id as string} />;
};

export default Page;
