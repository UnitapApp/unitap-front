"use client";

import Icon from "@/components/ui/Icon";
import { useOutsideClick } from "@/utils/hooks/dom";
import { FC, useMemo, useRef, useState } from "react";

export type SelectProps = {
  hasError?: boolean;
  value: any;
  label?: string;
  onChange: (value: any) => void;
  placeholder?: string;
  options: { icon?: string; label: string; value: any }[];
};

const Select: FC<SelectProps> = ({
  hasError,
  onChange,
  options,
  value,
  label,
  placeholder,
}) => {
  const [search, setSearch] = useState("");

  const [showItems, setShowItems] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (showItems) setShowItems(false);
  });

  const handleSearch = (e: any) => {
    setShowItems(true);
    setSearch(e.target.value);
  };

  const handleValueChanged = (item: {
    icon?: string;
    label: string;
    value: any;
  }) => {
    setSearch(item.label);

    onChange(item.value);
  };

  const selectedItem = useMemo(() => {
    return options.find((item) => item.value === value);
  }, [options, value]);

  const filteredItems = useMemo(() => {
    const existingElement = options.find((item) => item.value === value);
    if (
      existingElement &&
      existingElement.label.toLowerCase() === search?.toLowerCase()
    ) {
      return options;
    }

    return options.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search, value]);

  return (
    <div className="relative w-full font-normal">
      {!!label && <p className="mb-2 text-xs text-gray100">{label}</p>}

      <div ref={ref} className="relative w-full cursor-pointer">
        <div
          onClick={() => setShowItems(!showItems)}
          className="flex w-full items-center rounded-xl border border-gray50 bg-gray40 p-2"
        >
          {selectedItem?.icon ? (
            <Icon iconSrc={selectedItem.icon} width="24px" />
          ) : null}
          <input
            className="w-full bg-transparent px-2 text-sm text-white"
            type="text"
            value={search ?? ""}
            placeholder={placeholder}
            onChange={handleSearch}
          />
          <Icon
            iconSrc={
              !showItems
                ? "/assets/images/fund/arrow-down.png"
                : "/assets/images/provider-dashboard/arrow-top.svg"
            }
            width="14px"
            height="auto"
          ></Icon>
        </div>
        {showItems && (
          <div className="styled-scroll absolute z-[2] mt-1 max-h-[205px] w-full cursor-pointer overflow-y-scroll rounded-xl border-2 border-gray60 bg-gray40 p-1">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setShowItems(false);
                  handleValueChanged(item);
                }}
                className={`flex p-2 ${item.value === value ? "bg-gray60" : ""} w-full items-center gap-2 rounded-xl px-2 text-sm text-white hover:bg-gray70`}
              >
                {!!item.icon && <Icon iconSrc={item.icon} width="24px" />}
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {hasError && (
        <p className="absolute left-1 m-0 p-0 text-[8px] text-error">
          Required
        </p>
      )}
    </div>
  );
};

export default Select;
