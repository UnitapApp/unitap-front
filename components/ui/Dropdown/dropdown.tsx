"use client";

import Icon from "../Icon";
import Label from "../label";
import { DropdownWrapper } from "./dropdownWrapper";

interface DropdownProps {
  label?: string;
  icon?: string;
  value: string;
  onClick?: () => void;
  "data-testid"?: string;
}

const Dropdown = (props: DropdownProps) => {
  const { label, value, icon, onClick } = props;
  return (
    <DropdownWrapper onClick={onClick} data-testid={props["data-testid"]}>
      {label ? <Label>{label}</Label> : null}
      <div className="dropdown">
        {icon ? <Icon iconSrc={icon} width="32px" /> : null}
        <p className="dropdown-value">{value}</p>
        <Icon
          iconSrc={"/assets/images/fund/arrow-down.png"}
          width="14px"
          height="auto"
        ></Icon>
      </div>
    </DropdownWrapper>
  );
};

export default Dropdown;
