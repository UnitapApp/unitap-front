"use client";

import { useMemo } from "react";
import RenderInitialBody from "./RenderInitialBody";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
import Modal from "@/components/ui/Modal/modal";

const ShowPreviewModalBody = () => {
  const { data } = useTokenTapFromContext();

  const getShowPreviewBody = () => {
    return <RenderInitialBody data={data} />;
  };

  return (
    <div className="flex flex-col pt-5 p-2 min-h-[250px] bg-gray20">
      {getShowPreviewBody()}
    </div>
  );
};

const ShowPreviewModal = () => {
  const { closeShowPreviewModal, isModalOpen } = useTokenTapFromContext();
  const isOpen = useMemo(() => {
    return isModalOpen;
  }, [isModalOpen]);

  return (
    <>
      <Modal
        // $backgroundColor="bg-gray20"
        title="Your Token Tap Card"
        size="large"
        closeModalHandler={closeShowPreviewModal}
        isOpen={isOpen}
        className="provider-dashboard__modal"
      >
        <ShowPreviewModalBody />
      </Modal>
    </>
  );
};

export default ShowPreviewModal;
