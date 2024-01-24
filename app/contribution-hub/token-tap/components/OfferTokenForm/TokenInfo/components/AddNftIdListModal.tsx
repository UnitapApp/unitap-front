"use client";

import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal/modal";
import { loadAnimationOption } from "@/constants/lottieCode";
import { useTokenTapFromContext } from "@/context/providerDashboardTokenTapContext";
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
  } = useTokenTapFromContext();

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
        <div className="tabs flex border border-gray50 bg-gray30 overflow-hidden h-[43px] rounded-xl items-center justify-between text-xs">
          {tabs.map((item: any, index) => (
            <div
              key={index}
              onClick={() => handleSelectTap(item.name)}
              className={`${
                selectedTab === item.name ? "bg-gray40" : ""
              } w-full text-center border-r border-gray50 h-full flex items-center justify-center cursor-pointer`}
            >
              {item.name}
            </div>
          ))}
        </div>
        {selectedTab === tabsName.CHOOSE_RANGE && (
          <section className="choose_range  w-full min-h-[148px]">
            <div className="relative flex gap-4 mt-1">
              <div className="flex rounded-xl h-[43px] items-center bg-gray40 border border-gray40 overflow-hidden">
                <div className="flex items-center bg-gray30 text-gray100 text-xs h-full w-[70px] justify-center">
                  From
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  step={1}
                  className="w-full bg-[initial] h-full px-2 placeholder-gray80 text-xs text-gray100"
                  onChange={(e) => handleChangeRange(e.target.value, "from")}
                  value={nftRange.from}
                  disabled={!!uploadedFile || !!textAreaData}
                />
              </div>
              <div className="flex rounded-xl h-[43px] items-center bg-gray40 border border-gray40 overflow-hidden">
                <div className="flex items-center bg-gray30 text-gray100 text-xs h-full w-[70px] justify-center">
                  To
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]"
                  step={1}
                  className="w-full bg-[initial] h-full px-2 placeholder-gray80 text-xs text-gray100"
                  onChange={(e) => handleChangeRange(e.target.value, "to")}
                  value={nftRange.to}
                  disabled={!!uploadedFile || !!textAreaData}
                />
              </div>
              {!!Number(nftRange.to) &&
                Number(nftRange.from) >= Number(nftRange.to) && (
                  <p className="absolute -bottom-4 left-0` text-2xs text-error">
                    Invalid range
                  </p>
                )}
              {error &&
              !uploadedFile &&
              !invalidInput &&
              !(Number(nftRange.from) >= Number(nftRange.to)) ? (
                <p className="absolute -bottom-4 left-0` text-2xs text-error">
                  {error}
                </p>
              ) : null}
            </div>
          </section>
        )}

        {selectedTab === tabsName.PASTE_IDS && (
          <div className="relative">
            <div
              className={`flex text-gray80 text-[12px] mt-1  bg-gray40 border border-gray60 rounded-xl w-full  overflow-hidden ${
                uploadedFile ? "opacity-[0.5]" : ""
              }`}
            >
              <div className="w-full ">
                <textarea
                  disabled={isTextAriaDisabled}
                  placeholder={`... or paste ID, each one in a new line \n 1 \n 2 \n 3 `}
                  className={`w-[100%] flex bg-gray40 h-[142px] p-2 text-gray100 nftIdTextarea pl-3 border-none outline-none ${
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
            <p className="text-xs text-gray80 -mb-2">
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
                className={` flex relative text-gray80 text-[12px] bg-gray40 border border-gray60 rounded-xl h-[44px]  w-full max-w-[452px] mt-3 ${
                  textAreaData || nftRange.to || nftRange.from
                    ? "opacity-[.5]"
                    : ""
                }`}
              >
                {!uploadedFile ? (
                  <div className="flex  w-full gap-1 items-center pl-3 ">
                    <Icon
                      width="16px"
                      height="16px"
                      iconSrc="/assets/images/provider-dashboard/upload.svg"
                      className="-mt-1"
                    />
                    <div className="w-full relative mt-0">
                      <input
                        disabled={isUploadedFileDisabled || !!textAreaData}
                        type="file"
                        className="uploadFileInput w-[100%] flex cursor-pointer p-3 text-gray100"
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
                  <div className="flex  w-full gap-1 items-center pl-3 justify-between pr-3">
                    <p className="text-gray100">
                      file name: {uploadedFile.fileName}
                    </p>
                    <button
                      onClick={handleClearUploadedFile}
                      className="text-white text-2xs border border-gray60 bg-gray20 p-2 rounded-xl"
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
          <p className="absolute left-0 text-error text-[12px]">
            {nftStatus.length > 0 && "Invalid NFT IDs is entered"}
          </p>

          {error && !!uploadedFile && nftIds.length > 0 && (
            <p className="absolute left-0 text-error text-[12px]">{error}</p>
          )}

          <button
            onClick={handleAddNft}
            className={`flex w-full items-center justify-center mt-5 rounded-xl h-[43px] text-[14px] font bg-gray40 border-2 border-gray60 font-semibold overflow-hidden ${
              nftContractStatus.isValid === ContractValidationStatus.NotValid ||
              (selectedTab == tabsName.CHOOSE_RANGE &&
                (!nftRange.to || !nftRange.from)) ||
              (selectedTab == tabsName.CHOOSE_RANGE &&
                Number(nftRange.to) <= Number(nftRange.from)) ||
              (selectedTab == tabsName.PASTE_IDS && !textAreaData) ||
              (selectedTab == tabsName.UPLOAD_FILE && !uploadedFile)
                ? "opacity-[.8] text-gray80"
                : "text-white cursor-pointer"
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
    <div className="claim-modal-wrapper flex flex-col max-h-[550px] pt-5">
      {getAddNftIdListModalModalBody()}
    </div>
  );
};

const AddNftIdListModal = () => {
  const { closeAddNftIdListModal, isModalOpen } = useTokenTapFromContext();

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
