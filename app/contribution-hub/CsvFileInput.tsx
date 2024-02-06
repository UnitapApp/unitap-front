"use client";
import Icon from "@/components/ui/Icon";
import React, { useEffect, useState } from "react";

interface Prop {
  requirementParamsList: any;
  setRequirementParamsList: any;
  setConstraintFile: (item: any) => void;
  constraintFile: any;
}
const CsvFileInput = ({
  setRequirementParamsList,
  requirementParamsList,
  setConstraintFile,
  constraintFile,
}: Prop) => {
  const [isUploadedFileValid, setIsUploadedFileValid] =
    useState<boolean>(false);

  console.log(constraintFile);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>();

  useEffect(() => {
    if (!requirementParamsList) return;
    if (!requirementParamsList.CSV_FILE) return;
    setIsUploadedFileValid(true);
    setUploadedFileName(requirementParamsList.CSV_FILE);
  }, [requirementParamsList]);

  const handleChangeUploadedFile = (e: any) => {
    if (!e.target.files[0]) return;
    const timeStamp = e.timeStamp.toFixed();
    const file = e.target.files[0];
    const fileName = file.name;
    const lastIndex = fileName.lastIndexOf(".");
    const newFileName =
      file.name.slice(0, lastIndex) + timeStamp + file.name.slice(lastIndex);
    const newFile = new File([file], `${newFileName}`);
    console.log(newFile);
    const fileSuffix = fileName.slice(lastIndex, fileName.length);
    if (fileSuffix != ".csv") {
      setIsUploadedFileValid(false);
      return;
    } else {
      setRequirementParamsList({
        ...requirementParamsList,
        ["CSV_FILE"]: newFileName,
      });
      setIsUploadedFileValid(true);
      setUploadedFileName(fileName);
      setConstraintFile(newFile);
    }
  };

  const handleClearUploadedFile = () => {
    setIsUploadedFileValid(false);
    setUploadedFileName(null);
    setRequirementParamsList({
      ...requirementParamsList,
      ["CSV_FILE"]: "",
    });
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
            Reset file
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvFileInput;
