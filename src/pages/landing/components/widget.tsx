import React, { PropsWithChildren } from 'react';
import UButton from '../../../components/basic/Button/UButton';

export interface WidgetPropsInterface extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  description?: string;
  title?: string;
  buttonTitle?: string;
  icon?: string;

  buttonAction?(): void;
}

export type WidgetProps = PropsWithChildren<WidgetPropsInterface>;

const Widget = (props: WidgetProps) => {
  const { className, children, description, title, icon, buttonTitle, buttonAction } = props;
  return (
    <div className={`${className ? className : ''} home-widget px-4 py-4`}>
      <header className={'flex gap-4 justify-between'}>
        <div className={'flex gap-3 flex-auto'}>
          <p className={'text-white text-xl font-semibold'}>{title}</p>
          {icon && <img src={`/assets/images/landing/${icon}`} />}
        </div>
        <div>
          {/*<button>{buttonTitle}</button>*/}
          <UButton className={'gradient-outline-button'} size={'small'}>
            {buttonTitle}
          </UButton>
        </div>
      </header>
      <p className={'text-gray-100 text-xs font-normal py-4'}>{description}</p>
      <main>{children}</main>
    </div>
  );
};

export default Widget;
