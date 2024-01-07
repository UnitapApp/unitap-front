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
    <div className="p-[1px] h-full w-full rounded-2xl" id={id}>
      <div
        className={`${
          className ? className : ""
        } flex flex-col justify-between uni-card px-4 pt-4 pb-3`}
      >
        <section>
          <header className={`flex gap-4 items-center justify-between h-10`}>
            <div
              className={`${
                titleClass ? titleClass : ""
              } flex gap-3 items-center flex-auto`}
            >
              <p className={"text-white text-xl font-semibold"}>{title}</p>
              {icon && (
                <img
                  className={`${iconSize ? iconSize : ""} widget-icon`}
                  src={`/assets/images/landing/${icon}`}
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
                "text-secondary-text text-xs leading-loose font-normal py-4"
              }
            >
              {description}
            </p>
          )}
        </section>
        <main className={"relative h-full z-10"}>{children}</main>
      </div>
    </div>
  );
};

export default Widget;
