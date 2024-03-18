import { ProviderFormPaginationProp } from "@/types";
import NewAddedConstraint from "../NewAddedConstraint";
import Pagination from "@/app/contribution-hub/pagination";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import Icon from "@/components/ui/Icon";
import ConstraintListModal from "./components/ConstraintListModal";

const Requirements = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const { openRequirementModal, page, requirementList } =
    usePrizeOfferFormContext();

  return (
    <div className="flex flex-col justify-center items-center w-full animate-fadeIn">
      <div className="text-gray100 min-h-[424px] text-xs font-medium flex flex-col w-full  max-w-[452px] min-w-[300px] select-not">
        <p className="mb-4">
          Add enrollment requirements. You can skip this part but it is advised to have at least one requirement to prevent bot attacks and fake accounts.
        </p>
        {requirementList.map((requirement, key) => (
          <NewAddedConstraint key={key} requirement={requirement} />
        ))}
        <div
          onClick={openRequirementModal}
          className=" flex cursor-pointer items-center gap-2 bg-gray40 h-[44px] rounded-xl px-4 text-white text-xs"
        >
          <Icon
            iconSrc="/assets/images/provider-dashboard/add-requirement.svg"
            height="16px"
            width="16px"
          />
          <p>Add requirement</p>
        </div>

        <ConstraintListModal />
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
