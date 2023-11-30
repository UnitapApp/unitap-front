"use client";

import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal/modal";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";

const AddNftIdListModalModalBody = () => {
  const {
    data,
    isNftContractAddressValid,
    closeAddNftIdListModal,
    handleCheckOwnerOfNfts,
    handleAddNftToData,
    setUploadedFile,
    uploadedFile,
    nftStatus,
  } = usePrizeOfferFormContext();

  const [nftIds, setNftIds] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [textAreaData, setTextAreaData] = useState<string | null>();

  const [invalidInput, setInvalidInput] = useState(false);

  const [checkingNft, setCheckingNft] = useState(false);

  const polishText = (str: string) => {
    return str
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");
  };

  const checkNftList = (nftIds: string[]) => {
    return nftIds.every((item) => Number(item) >= 0);
  };

  const handleAddNft = async () => {
    if (!data.nftContractAddress) {
      setError("Required");
      return;
    }
    if (nftIds.length == 0) {
      setError("Required");
      return;
    }
    const res = checkNftList(nftIds);
    setInvalidInput(!res);
    if (!res) {
      setError("Invalid input");
      return;
    }
    setCheckingNft(true);
    const isOwner = await handleCheckOwnerOfNfts(nftIds);
    setCheckingNft(false);
    if (isOwner) {
      handleAddNftToData(nftIds);
      closeAddNftIdListModal();
    } else {
      // handleClearNfts();
    }
  };

  const handleClearNfts = () => {
    setNftIds([]);
    setUploadedFile(null);
    setTextAreaData(null);
  };

  const handleChangeTextarea = (e: string) => {
    setError(null);
    setTextAreaData(e);
    setNftIds(polishText(e));
  };

  const handleChangeUploadedFile = (e: any) => {
    setError(null);
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    const fileName = file.name;
    const fileSuffix = fileName.slice(
      fileName.lastIndexOf("."),
      fileName.length
    );
    if (fileSuffix != ".csv" && fileSuffix != ".txt") {
      setError("Invalid file format");
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (!reader.result) return;
      fileSuffix == ".csv"
        ? setNftIds(polishText(reader.result?.toString()))
        : setNftIds(reader.result?.toString().replaceAll("\n", "").split(","));
      reader.result
        ? setUploadedFile({ fileName: fileName, fileContent: reader.result })
        : setUploadedFile(null);
    };
    reader.onerror = (e) => {
      setNftIds([]);
      console.log(e);
    };
  };

  useEffect(() => {
    if (uploadedFile && data.nftTokenIds) {
      setNftIds(data.nftTokenIds);
    }

    if (!uploadedFile && data.nftTokenIds) {
      const arrToStr = data.nftTokenIds.join("\n");
      setTextAreaData(arrToStr);
      setNftIds(polishText(arrToStr));
    }
  }, []);

  const getAddNftIdListModalModalBody = () => {
    return (
      <div className="flex flex-col gap-4">
        <section
          className={`flex flex-col gap-4 ${
            !isNftContractAddressValid ? "opacity-[.5]" : ""
          }`}
        >
          <div
            className={`flex relative text-gray80 text-[12px] bg-gray40 border border-gray60 rounded-xl h-[44px]  w-full max-w-[452px] mt-3 ${
              textAreaData ? "opacity-[.5]" : ""
            }`}
          >
            <div className="flex  w-full gap-1 items-center pl-3 ">
              <Icon
                width="16px"
                height="16px"
                iconSrc="./assets/images/provider-dashboard/upload.svg"
              />
              <p className="absolute top-[-22px] left-0">
                Upload from file, only .txt or .csv{" "}
                <a
                  href="http://localhost:3000/src/constants/nftListSample/sample.csv"
                  className="cursor-pointer"
                >
                  (Download Sample)
                </a>
              </p>
              <div className="w-full relative">
                <input
                  disabled={!isNftContractAddressValid || !!textAreaData}
                  type="file"
                  className="uploadFileInput w-[100%] flex cursor-pointer p-3 text-gray100"
                  onChange={(e) => handleChangeUploadedFile(e)}
                  accept=".csv, .txt"
                />
              </div>
              {error && !uploadedFile && !invalidInput ? (
                <p className="absolute bottom-[-17px] left-0 text-[10px] text-error">
                  {error}
                </p>
              ) : null}
              {error && uploadedFile && invalidInput ? (
                <p className="absolute bottom-[-17px] left-0 text-[10px] text-error">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div
            className={`flex text-gray80 text-[12px] bg-gray40 border border-gray60 rounded-xl mb-[1em] w-full max-w-[452px]  ${
              uploadedFile ? "opacity-[0.5]" : ""
            }`}
          >
            <div className="w-full relative">
              <textarea
                disabled={!isNftContractAddressValid || !!uploadedFile}
                placeholder={`... or paste ID, each one in a new line \n 1 \n 2 \n 3 `}
                className="w-[100%] flex bg-gray40 h-[135px] p-2 text-gray100 nftIdTextarea pl-3"
                onChange={(e) => handleChangeTextarea(e.target.value)}
                value={textAreaData ?? ""}
              />
              {error && !textAreaData && !invalidInput ? (
                <p className="absolute bottom-[-17px] left-0 text-[10px] text-error">
                  {error}
                </p>
              ) : null}

              {error && textAreaData && invalidInput ? (
                <p className="absolute bottom-[-17px] left-0 text-[10px] text-error">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <p className="text-error mt-[-10px] min-h-[20px] text-[10px]">
          {nftStatus.length > 0
            ? `Invalid Ids: ${nftStatus.map((item) => " " + item.nftId)}`
            : null}
        </p>

        <div
          onClick={handleAddNft}
          className={`flex cursor-pointer relative w-full items-center justify-center mt-5 rounded-xl h-[43px] text-[14px] font bg-gray40 border-2 border-gray60 font-semibold overflow-hidden ${
            !isNftContractAddressValid
              ? "opacity-[.8] text-gray80"
              : "text-white"
          } `}
        >
          <button disabled={!isNftContractAddressValid}>Add NFT</button>
          {checkingNft ? (
            <div className="absolute right-0 bg-gray30">
              <Lottie
                width={40}
                height={50}
                options={loadAnimationOption}
              ></Lottie>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className="claim-modal-wrapper flex flex-col max-h-[550px] pt-5">
      {getAddNftIdListModalModalBody()}
    </div>
  );
};

const AddNftIdListModal = () => {
  const { closeAddNftIdListModal, isModalOpen } = usePrizeOfferFormContext();

  const isOpen = useMemo(() => {
    return isModalOpen;
  }, [isModalOpen]);

  return (
    <>
      <Modal
        title={"Add NFT"}
        size="small"
        closeModalHandler={closeAddNftIdListModal}
        isOpen={isOpen}
      >
        <AddNftIdListModalModalBody />
      </Modal>
    </>
  );
};

export default AddNftIdListModal;
