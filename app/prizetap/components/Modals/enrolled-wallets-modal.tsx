"use client";

import { useMemo } from "react";

import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { usePrizeTapContext } from "@/context/prizeTapProvider";
import Modal from "@/components/ui/Modal/modal";
import { shortenAddress } from "@/utils";

const ModalBody = ({
  enrolledWalletListApi,
}: {
  enrolledWalletListApi: any;
}) => {
  const count = enrolledWalletListApi.count;
  const nextPage = enrolledWalletListApi.next;
  const prevPage = enrolledWalletListApi.prev;
  return (
    <div className="max-h-[300px] min-h-[250px] flex-col gap-3 bg-gray20 p-2 pt-5">
      <div className="mb-3 flex h-[44px] items-center rounded bg-gray50 pl-4">
        <img src="/quest/assets/images/modal/search-icon.svg" />
        <input
          className="ml-3 h-full w-full bg-inherit text-xs leading-[12px] text-gray90"
          placeholder="Search Wallet"
        />
      </div>
      <div className="flex flex-col gap-2">
        {!enrolledWalletListApi ||
        enrolledWalletListApi.entries.length == 0 ||
        !enrolledWalletListApi.entries
          ? "No items fount"
          : enrolledWalletListApi.entries.map((item: any) => (
              <div
                className="flex items-center rounded bg-gray60 py-4 pl-3 text-sm font-normal leading-[14px] text-gray100"
                key={item.pk}
              >
                {shortenAddress(item.userWalletAddress)}
              </div>
            ))}
      </div>
    </div>
  );
};

const EnrolledPreEnrollmentWallets = () => {
  const { isOpenEnrolledModal, enrolledWalletListApi, setIsOpenEnrolledModal } =
    usePrizeTapContext();
  const isOpen = useMemo(() => {
    return isOpenEnrolledModal;
  }, [isOpenEnrolledModal]);

  const closeModal = () => {
    setIsOpenEnrolledModal(false);
  };
  return (
    <>
      <Modal
        // $backgroundColor="bg-gray20"
        title="Enrolled wallets"
        size="small"
        closeModalHandler={closeModal}
        isOpen={isOpen}
        className="provider-dashboard__modal"
      >
        <ModalBody enrolledWalletListApi={enrolledWalletListApi} />
      </Modal>
    </>
  );
};

export default EnrolledPreEnrollmentWallets;
