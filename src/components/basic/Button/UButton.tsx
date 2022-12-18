import React, { PropsWithChildren } from 'react';

export interface UButtonPropsInterface extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  description?: string;
  title?: string;
  buttonTitle?: string;
  icon?: string;
  size?: string;
  buttonClassName?: string;

  onClick?(): void;
}

export type UButtonProps = PropsWithChildren<UButtonPropsInterface>;
// todo btn-small is not reactive
const UButton = (props: UButtonProps) => {
  const { className, buttonClassName, children, size, onClick, icon } = props;

  function buttonSize(size: string) {
    return `btn-${size}`;
  }

  return (
    <div
      onClick={onClick}
      className={`before:rounded-lg rounded-lg ${size ? size : 'btn-default'} ${
        className ? className : 'text-sm'
      } flex justify-center items-center gap-2`}
    >
      <button className={`${buttonClassName ? buttonClassName : ''}`}>{children}</button>
      <img src={icon} />
    </div>
  );
};

export default UButton;
