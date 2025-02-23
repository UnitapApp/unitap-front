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
  className?: string;
};

const Select: FC<SelectProps> = ({
  hasError,
  onChange,
  options,
  value,
  label,
  placeholder,
  className = "",
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
    <div className="relative font-normal">
      {!!label && <p className="text-xs text-gray100">{label}</p>}

      <div ref={ref} className="relative w-full cursor-pointer">
        <div
          onClick={() => setShowItems(!showItems)}
          className={`flex items-center rounded-xl border-gray50 bg-stone-50 p-2 dark:border dark:border-stone-300 dark:bg-gray40 ${className}`}
        >
          {selectedItem?.icon ? (
            <Icon iconSrc={selectedItem.icon} width="24px" />
          ) : null}
          <input
            className="bg-transparent px-2 text-sm text-black placeholder:text-stone-500 dark:text-white"
            type="text"
            value={search ?? ""}
            placeholder={placeholder}
            onChange={handleSearch}
          />
          <Icon
            iconSrc={
              !showItems
                ? "/quest/assets/images/fund/arrow-down.png"
                : "/quest/assets/images/provider-dashboard/arrow-top.svg"
            }
            width="14px"
            height="auto"
          ></Icon>
        </div>
        {showItems && (
          <div className="styled-scroll absolute z-[2] mt-1 max-h-[205px] w-full cursor-pointer overflow-y-scroll rounded-xl border-2 border-stone-300 bg-stone-50 dark:border-gray60 dark:bg-gray40">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setShowItems(false);
                  handleValueChanged(item);
                }}
                className={`flex p-2 ${item.value === value ? "bg-stone-300 dark:bg-gray60" : ""} w-full items-center gap-2 px-2 text-sm hover:bg-stone-300 dark:text-white dark:hover:bg-gray70`}
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
