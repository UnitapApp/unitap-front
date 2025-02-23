import React, { PropsWithChildren } from "react";
import UButton from "@/components/ui/Button/UButton";

export interface WidgetPropsInterface
  extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  description?: string;
  title?: string;
  buttonTitle?: string;
  buttonClass?: string;
  titleClass?: string;
  icon?: string;
  iconSize?: string;
  buttonClassName?: string;
  unClickable?: boolean;

  onButtonClick?(): void;
}

export type WidgetProps = PropsWithChildren<WidgetPropsInterface>;

const Widget = (props: WidgetProps) => {
  const {
    className,
    buttonClassName,
    children,
    description,
    title,
    icon,
    buttonTitle,
    buttonClass,
    titleClass,
    iconSize,
    onButtonClick,
    unClickable,
    id,
  } = props;
  return (
    <div className="h-full w-full rounded-2xl p-[1px]" id={id}>
      <div
        className={`${
          className ? className : ""
        } uni-card flex flex-col justify-between px-4 pb-3 pt-4`}
      >
        <section>
          <header className={`flex h-10 items-center justify-between gap-4`}>
            <div
              className={`${
                titleClass ? titleClass : ""
              } flex flex-auto items-center gap-3`}
            >
              <p className={"text-xl font-semibold text-white"}>{title}</p>
              {icon && (
                <img
                  className={`${iconSize ? iconSize : ""} widget-icon`}
                  src={`/quest/assets/images/landing/${icon}`}
                  alt={"widget"}
                />
              )}
            </div>
            {buttonTitle && (
              <div>
                <UButton
                  unClickable={unClickable}
                  className={`${
                    buttonClass ? buttonClass : "gradient-outline-button"
                  } `}
                  size={"btn-small"}
                  onClick={onButtonClick}
                  buttonClassName={buttonClassName}
                >
                  {buttonTitle}
                </UButton>
              </div>
            )}
          </header>
          {description && (
            <p
              className={
                "py-4 text-xs font-normal leading-loose text-secondary-text"
              }
            >
              {description}
            </p>
          )}
        </section>
        <main className={"relative z-10 h-full"}>{children}</main>
      </div>
    </div>
  );
};

export default Widget;
