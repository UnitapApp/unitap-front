import React, { PropsWithChildren } from 'react';

export interface UButtonPropsInterface extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  description?: string;
  title?: string;
  buttonTitle?: string;
  icon?: string;
  size?: string;

  buttonAction?(): void;
}

export type UButtonProps = PropsWithChildren<UButtonPropsInterface>;
// todo btn-small is not reactive
const UButton = (props: UButtonProps) => {
  const { className, children, description, title, icon, buttonTitle, size } = props;
  return (
    <div
      className={`btn-small ${size ? `btn-${size}` : 'btn-default'} ${
        className ? className : 'text-sm'
      } flex justify-center items-center`}
    >
      <button>{children}</button>
    </div>
  );
};

export default UButton;
