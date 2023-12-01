"use client";

import { ProviderDashboardFormDataProp } from "@/types";
import FormYouFilled from "./FormYouFilled";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ProviderDashboardButtonSubmit } from "@/components/containers/provider-dashboard/Buttons";

interface Prop {
  data: ProviderDashboardFormDataProp;
}

const RenderInitialBody = ({ data }: Prop) => {
  const { handleCreateRaffle, createRaffleLoading, createRaffleResponse } =
    usePrizeOfferFormContext();

  return (
    <div className="flex flex-col">
      <div className="text-gray100 text-[14px] ">
        This is how your card will appear. If you are sure of the accuracy of
        the form you filled out, please submit your contribution.
      </div>
      <FormYouFilled data={data} />
      <ProviderDashboardButtonSubmit
        onClick={handleCreateRaffle}
        $width="100%"
        className="text-[14px] md:text-[12px] lg:text-[14px] mt-10"
      >
        {createRaffleLoading ? (
          <p>Submit Contribution...</p>
        ) : createRaffleResponse?.state === "Retry" ? (
          <p>Retry</p>
        ) : (
          <p>Submit Contribution</p>
        )}
      </ProviderDashboardButtonSubmit>
    </div>
  );
};

export default RenderInitialBody;
