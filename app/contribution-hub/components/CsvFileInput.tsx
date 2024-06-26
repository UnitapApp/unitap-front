"use client";
import Icon from "@/components/ui/Icon";
import { RequirementProps } from "@/types";
import { useEffect, useState } from "react";

interface Prop {
  requirementParamsList: any;
  setRequirementParamsList: any;
  setConstraintFile: (item: any) => void;
  constraintFile: any;
  requirement: RequirementProps | undefined;
}
const CsvFileInput = ({
  setRequirementParamsList,
  requirementParamsList,
  setConstraintFile,
  requirement,
}: Prop) => {
  const [isUploadedFileValid, setIsUploadedFileValid] =
    useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>();

  useEffect(() => {
    if (!requirementParamsList) return;
    if (!requirementParamsList.CSV_FILE) return;
    if (requirement) {
      if (!requirement.constraintFile) return;
      setConstraintFile(requirement.constraintFile);
    }
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
        <div className="flex w-full items-center gap-1 rounded-xl bg-gray40 pl-3">
          <Icon
            width="16px"
            height="16px"
            iconSrc="/assets/images/provider-dashboard/upload.svg"
            className="-mt-1"
          />
          <div className="relative mt-0 w-full">
            <input
              disabled={isUploadedFileValid}
              type="file"
              className="uploadFileInput flex w-[100%] cursor-pointer p-3 text-gray100"
              onChange={(e) => handleChangeUploadedFile(e)}
              accept=".csv"
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-between gap-1 rounded-xl bg-gray40 pl-3 pr-3">
          <p className="text-gray100">file name: {uploadedFileName}</p>
          <button
            onClick={handleClearUploadedFile}
            className="rounded-xl border border-gray60 bg-gray20 p-2 text-2xs text-white"
          >
            Reset file
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvFileInput;
