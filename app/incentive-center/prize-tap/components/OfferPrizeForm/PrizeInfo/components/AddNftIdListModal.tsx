"use client";

import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal/modal";
import { loadAnimationOption } from "@/constants/lottieCode";
import { usePrizeOfferFormContext } from "@/context/providerDashboardContext";
import { ContractValidationStatus } from "@/types";
import { useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";

const AddNftIdListModalModalBody = () => {
  const {
    data,
    nftContractStatus,
    closeAddNftIdListModal,
    handleCheckOwnerOfNfts,
    handleAddNftToData,
    setUploadedFile,
    uploadedFile,
    nftStatus,
    setNftStatus,
    nftRange,
    setNftRange,
  } = usePrizeOfferFormContext();

  const tabsName = {
    CHOOSE_RANGE: "Choose Range",
    PASTE_IDS: "Paste IDs",
    UPLOAD_FILE: "Upload File",
  };

  const tabs = [
    { name: tabsName.CHOOSE_RANGE, disabled: false },
    { name: tabsName.PASTE_IDS, disabled: false },
    { name: tabsName.UPLOAD_FILE, disabled: false },
  ];

  const isTextAriaDisabled =
    nftContractStatus.isValid === ContractValidationStatus.NotValid ||
    !!uploadedFile ||
    !!nftRange.from ||
    !!nftRange.to;

  const isUploadedFileDisabled =
    nftContractStatus.isValid === ContractValidationStatus.NotValid ||
    !!nftRange.from ||
    !!nftRange.to;

  const [nftIds, setNftIds] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [textAreaData, setTextAreaData] = useState<string | null>();

  const [invalidInput, setInvalidInput] = useState(false);

  const [checkingNft, setCheckingNft] = useState(false);

  const [selectedTab, setSelectedTab] = useState<string>(tabsName.CHOOSE_RANGE);

  const handleSelectTap = (tab: string) => {
    setSelectedTab(tab);
  };

  const polishText = (str: string) => {
    return str
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim() !== "");
  };

  const checkNftList = (nftIds: string[]) => {
    return nftIds.every((item) => Number(item) >= 0);
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
      fileName.length,
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
    // if (uploadedFile && data.nftTokenIds) {
    //   setNftIds(data.nftTokenIds);
    // }

    if (!uploadedFile && data.nftTokenIds && !(nftRange.to && nftRange.from)) {
      const arrToStr = data.nftTokenIds.join("\n");
      setTextAreaData(arrToStr);
      setNftIds(polishText(arrToStr));
    }
  }, []);

  const handleChangeRange = (range: string, target: string) => {
    setError(null);
    setNftRange((prev: any) => ({
      ...prev,
      [target]: range.replace(/[^0-9]/g, ""),
    }));
    if (
      target == "to" &&
      nftRange.from &&
      Number(range) > Number(nftRange.from)
    ) {
      createRangeNftArray(Number(nftRange.from), Number(range));
    } else if (
      target == "from" &&
      nftRange.to &&
      Number(nftRange.to) > Number(range)
    ) {
      createRangeNftArray(Number(range), Number(nftRange.to));
    } else {
      setNftIds([]);
    }
  };

  const createRangeNftArray = (start_: number, range: number) => {
    let arr: string[] = [];
    for (let start = Number(start_); start <= Number(range); start++) {
      arr.push(start.toString());
    }
    setNftIds(arr);
  };

  const toFindDuplicates = (array: string[]) =>
    array.filter((item: any, index: any) => array.indexOf(item) !== index);

  const handleAddNft = async () => {
    setNftStatus([]);
    if (nftIds.length == 0) {
      setError("Required");
      return;
    }
    const res = checkNftList(nftIds);
    const duplicateElement = toFindDuplicates(nftIds);
    setInvalidInput(!res || duplicateElement.length > 0);
    if (!res || duplicateElement.length > 0) {
      setError("Invalid input");
      return;
    }
    setError(null);
    handleCheckNftIdsInContract();
  };

  const handleCheckNftIdsInContract = async () => {
    setCheckingNft(true);
    const isOwner = await handleCheckOwnerOfNfts(nftIds);
    setCheckingNft(false);
    if (isOwner) {
      handleAddNftToData(nftIds);
      closeAddNftIdListModal();
    }
  };

  const handleClearUploadedFile = () => {
    setNftStatus([]);
    setNftIds([]);
    setUploadedFile(null);
  };

  const getAddNftIdListModalModalBody = () => {
    return (
      <div className="flex flex-col gap-4">
        <div className="tabs flex h-[43px] items-center justify-between overflow-hidden rounded-xl border border-gray50 bg-gray30 text-xs">
          {tabs.map((item: any, index) => (
            <div
              key={index}
              onClick={() => handleSelectTap(item.name)}
              className={`${
                selectedTab === item.name ? "bg-gray40" : ""
              } flex h-full w-full cursor-pointer items-center justify-center border-r border-gray50 text-center`}
            >
              {item.name}
            </div>
          ))}
        </div>
        {selectedTab === tabsName.CHOOSE_RANGE && (
          <section className="choose_range min-h-[148px] w-full">
            <div className="relative mt-1 flex gap-4">
              <div className="flex h-[43px] items-center overflow-hidden rounded-xl border border-gray40 bg-gray40">
                <div className="flex h-full w-[70px] items-center justify-center bg-gray30 text-xs text-gray100">
                  From
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  step={1}
                  className="h-full w-full bg-[initial] px-2 text-xs text-gray100 placeholder-gray80"
                  onChange={(e) => handleChangeRange(e.target.value, "from")}
                  value={nftRange.from}
                  disabled={!!uploadedFile || !!textAreaData}
                />
              </div>
              <div className="flex h-[43px] items-center overflow-hidden rounded-xl border border-gray40 bg-gray40">
                <div className="flex h-full w-[70px] items-center justify-center bg-gray30 text-xs text-gray100">
                  To
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  step={1}
                  className="h-full w-full bg-[initial] px-2 text-xs text-gray100 placeholder-gray80"
                  onChange={(e) => handleChangeRange(e.target.value, "to")}
                  value={nftRange.to}
                  disabled={!!uploadedFile || !!textAreaData}
                />
              </div>
              {!!Number(nftRange.to) &&
                Number(nftRange.from) >= Number(nftRange.to) && (
                  <p className="left-0` absolute -bottom-4 text-2xs text-error">
                    Invalid range
                  </p>
                )}
              {error &&
              !uploadedFile &&
              !invalidInput &&
              !(Number(nftRange.from) >= Number(nftRange.to)) ? (
                <p className="left-0` absolute -bottom-4 text-2xs text-error">
                  {error}
                </p>
              ) : null}
            </div>
          </section>
        )}

        {selectedTab === tabsName.PASTE_IDS && (
          <div className="relative">
            <div
              className={`mt-1 flex w-full overflow-hidden rounded-xl border border-gray60 bg-gray40 text-xs text-gray80 ${
                uploadedFile ? "opacity-[0.5]" : ""
              }`}
            >
              <div className="w-full">
                <textarea
                  disabled={isTextAriaDisabled}
                  placeholder={`... or paste ID, each one in a new line \n 1 \n 2 \n 3 `}
                  className={`nftIdTextarea flex h-[142px] w-[100%] border-none bg-gray40 p-2 pl-3 text-gray100 outline-none ${
                    isTextAriaDisabled ? "opacity-50" : "opacity-100"
                  }`}
                  onChange={(e) => handleChangeTextarea(e.target.value)}
                  value={textAreaData ?? ""}
                />
              </div>
            </div>
            {error && !textAreaData && !invalidInput ? (
              <p className="absolute -bottom-4 left-0 text-2xs text-error">
                {error}
              </p>
            ) : null}

            {error && textAreaData && invalidInput ? (
              <p className="absolute -bottom-4 left-0 text-2xs text-error">
                {error}
              </p>
            ) : null}
          </div>
        )}

        {selectedTab == tabsName.UPLOAD_FILE && (
          <div className="h-[148px]">
            <p className="-mb-2 text-xs text-gray80">
              Upload from file, only .txt or .csv{" "}
              <a
                href="/nftListSample/sample.csv"
                target="_blank"
                className="cursor-pointer"
              >
                (Download Sample)
              </a>
            </p>
            <div>
              <div
                className={`relative mt-3 flex h-[44px] w-full max-w-[452px] rounded-xl border border-gray60 bg-gray40 text-xs text-gray80 ${
                  textAreaData || nftRange.to || nftRange.from
                    ? "opacity-[.5]"
                    : ""
                }`}
              >
                {!uploadedFile ? (
                  <div className="flex w-full items-center gap-1 pl-3">
                    <Icon
                      width="16px"
                      height="16px"
                      iconSrc="/quest/assets/images/provider-dashboard/upload.svg"
                      className="-mt-1"
                    />
                    <div className="relative mt-0 w-full">
                      <input
                        disabled={isUploadedFileDisabled || !!textAreaData}
                        type="file"
                        className="uploadFileInput flex w-[100%] cursor-pointer p-3 text-gray100"
                        onChange={(e) => handleChangeUploadedFile(e)}
                        accept=".csv, .txt"
                      />
                    </div>

                    {error && !uploadedFile && !invalidInput ? (
                      <p className="absolute bottom-[-17px] left-0 text-2xs text-error">
                        {error}
                      </p>
                    ) : null}
                    {error && uploadedFile && invalidInput ? (
                      <p className="absolute bottom-[-17px] left-0 text-2xs text-error">
                        {error}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-between gap-1 pl-3 pr-3">
                    <p className="text-gray100">
                      file name: {uploadedFile.fileName}
                    </p>
                    <button
                      onClick={handleClearUploadedFile}
                      className="rounded-xl border border-gray60 bg-gray20 p-2 text-2xs text-white"
                    >
                      Reset Uploaded file
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          {checkingNft && (
            <div className="absolute flex items-center">
              <p className="text-xs text-gray90">Checking IDs</p>
              <Lottie
                width={16}
                height={16}
                options={loadAnimationOption}
              ></Lottie>
            </div>
          )}
          <p className="absolute left-0 text-xs text-error">
            {nftStatus.length > 0 && "Invalid NFT IDs is entered"}
          </p>

          {error && !!uploadedFile && nftIds.length > 0 && (
            <p className="absolute left-0 text-xs text-error">{error}</p>
          )}

          <button
            onClick={handleAddNft}
            className={`font mt-5 flex h-[43px] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-gray60 bg-gray40 text-sm font-semibold ${
              nftContractStatus.isValid === ContractValidationStatus.NotValid ||
              (selectedTab == tabsName.CHOOSE_RANGE &&
                (!nftRange.to || !nftRange.from)) ||
              (selectedTab == tabsName.CHOOSE_RANGE &&
                Number(nftRange.to) <= Number(nftRange.from)) ||
              (selectedTab == tabsName.PASTE_IDS && !textAreaData) ||
              (selectedTab == tabsName.UPLOAD_FILE && !uploadedFile)
                ? "text-gray80 opacity-[.8]"
                : "cursor-pointer text-white"
            } `}
            disabled={
              nftContractStatus.isValid === ContractValidationStatus.NotValid ||
              (selectedTab == tabsName.CHOOSE_RANGE &&
                (!nftRange.to || !nftRange.from)) ||
              (selectedTab == tabsName.CHOOSE_RANGE &&
                Number(nftRange.to) <= Number(nftRange.from)) ||
              (selectedTab == tabsName.PASTE_IDS && !textAreaData) ||
              (selectedTab == tabsName.UPLOAD_FILE && !uploadedFile)
            }
          >
            Add NFT
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="claim-modal-wrapper flex max-h-[550px] flex-col pt-5">
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
        className="provider-dashboard__modal"
      >
        <AddNftIdListModalModalBody />
      </Modal>
    </>
  );
};

export default AddNftIdListModal;
