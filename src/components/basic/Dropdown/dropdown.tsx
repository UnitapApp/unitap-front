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
      {icon? <Icon iconSrc={icon} /> : null}
      <p className='dropdown-value'>{ value }</p>
      <Icon iconSrc={'assets/images/fund/arrow-down.png'}></Icon>
    </DropdownWrapper>
  );
};

export default Dropdown;
