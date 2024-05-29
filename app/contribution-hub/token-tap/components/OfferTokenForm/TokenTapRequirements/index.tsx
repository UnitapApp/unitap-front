import { ProviderFormPaginationProp } from "@/types";
import NewAddedConstraint from "../NewAddedConstraint";
import Pagination from "@/app/contribution-hub/components/pagination";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Icon from "@/components/ui/Icon";
import ConstraintListModal from "./components/ConstraintListModal";
import { useEffect } from "react";

const TokenTapRequirements = ({
  handleChangeFormPagePrev,
  handleChangeFormPageNext,
}: ProviderFormPaginationProp) => {
  const { openRequirementModal, page, requirementList } =
    useTokenTapFromContext();
  return (
    <div className="flex w-full animate-fadeIn flex-col items-center justify-center">
      <div className="flex min-h-[424px] w-full min-w-[300px] max-w-[452px] select-none flex-col  text-xs font-medium text-gray100">
        <p className="mb-4">
          Add enrollment requirements. You can skip this part but it is advised
          to have at least one requirement to prevent bot attacks and fake
          accounts.
        </p>
        {requirementList.map((requirement, key) => (
          <NewAddedConstraint key={key} requirement={requirement} />
        ))}
        <div
          onClick={openRequirementModal}
          className=" flex h-[44px] cursor-pointer items-center gap-2 rounded-xl bg-gray40 px-4 text-xs text-white"
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

export default TokenTapRequirements;
