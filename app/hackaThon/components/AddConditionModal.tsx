import Modal from "@/components/ui/Modal/modal";
import React, { useEffect, useState } from "react";
import { ConditionDataProps } from "../page";
import ChainList from "./ChailList";

interface ModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  conditionData: ConditionDataProps;
  handleSetConditionData: (e: any) => void;
  setConditionData: React.Dispatch<React.SetStateAction<ConditionDataProps>>;
}

const AddConditionModal = ({
  isOpen,
  handleCloseModal,
  conditionData,
  handleSetConditionData,
  setConditionData,
}: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
    handleCloseModal();
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const [showMethods, setShowMethods] = useState(false);
  const [setSelectedMethod, selectedMethod] = useState();

  const handleShowMethods = () => {
    setShowMethods(!showMethods);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      conditionData.contractAddress = clipboardText;
      setConditionData((prev) => ({ ...prev, contractAddress: clipboardText }));
      console.log(clipboardText);
    } catch (error) {
      console.error("Failed to read clipboard contents:", error);
    }
  };

  return (
    <div className="" onClick={handleOpenModal}>
      <Modal
        title="Add Condition"
        isOpen={isModalOpen}
        closeModalHandler={handleOpenModal}
        className={"provider-dashboard__modal"}
      >
        <div className="mt-5 flex flex-col gap-4 px-3">
          <div className="flex h-[43px] cursor-pointer items-center overflow-hidden rounded-xl border border-[#212130] bg-[#1E1E2C] pr-3 text-xs">
            <input
              type="text"
              placeholder="Condition Name"
              className="h-full w-full bg-inherit pl-3 placeholder-gray80"
              value={conditionData.conditionName ?? ""}
              onChange={handleSetConditionData}
              name="conditionName"
            />
          </div>

          <ChainList
            setConditionData={setConditionData}
            conditionData={conditionData}
          />

          <div className="flex h-[43px] items-center overflow-hidden rounded-xl border border-[#212130] bg-[#1E1E2C] pr-3 text-xs">
            <input
              type="text"
              placeholder="Contract Address"
              className="h-full w-full bg-inherit pl-3 placeholder-gray80"
              value={conditionData.contractAddress ?? ""}
              name="contractAddress"
              onChange={handleSetConditionData}
            />
            <div
              onClick={handlePaste}
              className="flex h-[19px] w-[42px] cursor-pointer items-center justify-center rounded-[6px] border border-gray80 text-2xs font-semibold text-gray90"
            >
              Paste
            </div>
          </div>

          <div className="relative">
            <div
              onClick={handleShowMethods}
              className="flex cursor-pointer items-center justify-between rounded-xl border border-gray50 bg-gray40 p-3 px-6"
            >
              <div className="text-sm text-gray80">Select Method</div>
              <svg
                width="12"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.7071 0.292893C13.3166 -0.0976309 12.6834 -0.0976309 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683418 -0.0976311 0.292894 0.292893C-0.0976312 0.683417 -0.0976312 1.31658 0.292894 1.70711L6.29289 7.70711C6.68342 8.09763 7.31658 8.09763 7.70711 7.70711L13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893Z"
                  fill="white"
                />
              </svg>
            </div>
            <div
              className={`absolute ${showMethods ? "flex flex-col" : "hidden"} mt-1 h-[120px] w-full overflow-y-scroll rounded-xl border-gray50 bg-gray40`}
            >
              <div className="flex h-[44px] w-full cursor-pointer items-center p-4 hover:bg-gray50">
                test
              </div>
              <div className="flex h-[44px] w-full cursor-pointer items-center p-4 hover:bg-gray50">
                test
              </div>
            </div>
          </div>

          <div className="flex h-[43px] overflow-hidden rounded-xl border border-[#212130] bg-[#1E1E2C] px-2">
            <input
              className="h-full w-full bg-inherit text-xs placeholder-gray80"
              placeholder="Number of Points"
              value={conditionData.numberOfPoints ?? ""}
              onChange={handleSetConditionData}
              name="numberOfPoints"
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
            />
          </div>
          <div className="borer mt-28 flex h-[43px] w-full cursor-pointer items-center justify-center rounded-xl border-[#2C6E59] bg-dark-space-green">
            Add Condition
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddConditionModal;
