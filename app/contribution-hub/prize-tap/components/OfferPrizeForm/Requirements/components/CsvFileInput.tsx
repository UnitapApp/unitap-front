"use client";
import Icon from "@/components/ui/Icon";
import React, { useState } from "react";

interface Prop {
  requirementParamsList: any;
  setRequirementParamsList: any;
}
const CsvFileInput = ({
  setRequirementParamsList,
  requirementParamsList,
}: Prop) => {
  const [isUploadedFileValid, setIsUploadedFileValid] =
    useState<boolean>(false);

  const [uploadedFileName, setUploadedFileName] = useState<string | null>();

  const handleClearUploadedFile = () => {
    setIsUploadedFileValid(false);
  };

  const handleChangeUploadedFile = (e: any) => {
    if (!e.target.files[0]) return;
    const file = e.target.files[0];
    const fileName = file.name;
    const fileSuffix = fileName.slice(
      fileName.lastIndexOf("."),
      fileName.length
    );
    if (fileSuffix != ".csv") {
      setIsUploadedFileValid(false);
      return;
    } else {
      setRequirementParamsList({
        ...requirementParamsList,
        ["CSV_FILE"]: fileName,
      });
      setIsUploadedFileValid(true);
      setUploadedFileName(fileName);
    }
  };

  return (
    <div>
      {!isUploadedFileValid ? (
        <div className="flex w-full gap-1 items-center pl-3 bg-gray40 rounded-xl">
          <Icon
            width="16px"
            height="16px"
            iconSrc="/assets/images/provider-dashboard/upload.svg"
            className="-mt-1"
          />
          <div className="w-full relative mt-0">
            <input
              disabled={isUploadedFileValid}
              type="file"
              className="uploadFileInput w-[100%] flex cursor-pointer p-3 text-gray100"
              onChange={(e) => handleChangeUploadedFile(e)}
              accept=".csv, .txt"
            />
          </div>
        </div>
      ) : (
        <div className="flex  w-full gap-1 items-center pl-3 justify-between pr-3 bg-gray40 rounded-xl">
          <p className="text-gray100">file name: {uploadedFileName}</p>
          <button
            onClick={handleClearUploadedFile}
            className="text-white text-[10px] border border-gray60 bg-gray20 p-2 rounded-xl"
          >
            Reset Uploaded file
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvFileInput;
