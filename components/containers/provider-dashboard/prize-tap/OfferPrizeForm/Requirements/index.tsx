import RequirementModal from "./components/RequirementModal";
import { ProviderFormPaginationProp } from "@/types";
import NewAddedConstraint from "../NewAddedConstraint";
import Pagination from "../../pagination";
import { useEffect } from "react";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";

export const RequirementDescription = {
  id: 2,
  prevIcon: "/assets/images/provider-dashboard/step-2-green.png",
  activeIcon: "/assets/images/provider-dashboard/step-2-active.png",
  nextIcon: "/assets/images/provider-dashboard/step-2-off.png",
  title: "Requirements",
  description: "Add requirements for Enrollment",
};

const Requirements = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const {
    openRequirementModal,
    page,
    requirementList,
    handleGetConstraints,
    isShowingDetails,
  } = usePrizeOfferFormContext();
  useEffect(() => {
    handleGetConstraints();
  }, []);
  return (
    <div className="flex flex-col justify-center items-center w-full animate-fadeIn">
      <div className="text-gray100 min-h-[424px] text-[12px] font-medium flex flex-col w-full  max-w-[452px] min-w-[300px] select-not">
        <p className="mb-4">
          Add any requirements for Enrolling or leave it free.
        </p>
        {requirementList.map((requirement, key) => (
          <NewAddedConstraint key={key} requirement={requirement} />
        ))}
        <div
          onClick={openRequirementModal}
          className=" flex cursor-pointer items-center gap-2 bg-gray40 h-[44px] rounded-xl px-4 text-white text-[12px]"
        >
          <Icon
            iconSrc="/assets/images/provider-dashboard/add-requirement.svg"
            height="16px"
            width="16px"
          />
          <p>Add requirement</p>
        </div>

        <RequirementModal />
      </div>
      <Pagination
        handleChangeFormPagePrev={handleChangeFormPagePrev}
        handleNextPage={handleChangeFormPageNext}
        page={page}
      />
    </div>
  );
};

export default Requirements;
