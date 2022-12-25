import React, { PropsWithChildren } from 'react';

export interface UButtonPropsInterface extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  description?: string;
  title?: string;
  buttonTitle?: string;
  icon?: string;
  size?: string;
  buttonClassName?: string;
  unClickable?: boolean;

  onClick?(): void;
}

export type UButtonProps = PropsWithChildren<UButtonPropsInterface>;
// todo btn-small is not reactive
const UButton = (props: UButtonProps) => {
  const { className, buttonClassName, children, size, onClick, icon, unClickable } = props;

  function buttonSize(size: string) {
    return `btn-${size}`;
  }

  return (
    <div
      onClick={onClick}
      className={`before:rounded-lg rounded-lg ${size ? size : 'btn-default'} ${className ? className : 'text-sm'} ${
        unClickable ? 'cursor-default' : 'cursor-pointer before:cursor-pointer'
      } flex justify-center items-center ${icon ? 'gap-2' : 'gap-0'}`}
    >
      <button
        className={`${buttonClassName ? buttonClassName : ''} ${
          unClickable ? 'cursor-default' : 'cursor-pointer before:cursor-pointer'
        }`}
      >
        {children}
      </button>
      <img src={icon} />
    </div>
  );
};

export default UButton;
