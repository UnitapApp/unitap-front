import React from 'react';
import Icon from '../Icon/Icon';
import Label from '../Lable/label';
import { DropdownWrapper } from './dropdownWrapper';

interface props {
  label?: string;
  icon?: string;
  value: string;
}

const Dropdown = ({ label, value, icon }: props) => {
  return (
    <DropdownWrapper>
      {label ? <Label>{label}</Label> : null}
      <div className='dropdown'>
        {icon ? <Icon iconSrc={icon} width="32px" /> : null}
        <p className="dropdown-value">{value}</p>
        <Icon iconSrc={'assets/images/fund/arrow-down.png'} width="14px" height="auto"></Icon>
      </div>
    </DropdownWrapper>
  );
};

export default Dropdown;
