"use client"

import React, { PropsWithChildren } from "react"

export interface UButtonPropsInterface
  extends React.HTMLAttributes<HTMLElement> {
  className?: string
  description?: string
  title?: string
  buttonTitle?: string
  icon?: string
  size?: string
  disabled?: boolean
  buttonClassName?: string
  unClickable?: boolean

  onClick?(): void
}

export type UButtonProps = PropsWithChildren<UButtonPropsInterface>
// todo btn-small is not reactive
const UButton = (props: UButtonProps) => {
  const {
    className,
    buttonClassName,
    children,
    size,
    onClick,
    icon,
    unClickable,
    disabled,
  } = props

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`before:rounded-lg rounded-lg ${size ? size : "btn-default"} ${
        className ? className : "text-sm"
      } ${disabled ? "opacity-60" : ""} ${
        unClickable || disabled
          ? "cursor-default"
          : "cursor-pointer before:cursor-pointer"
      } flex justify-center items-center ${icon ? "gap-2" : "gap-0"}`}
    >
      <button
        className={`${buttonClassName ? buttonClassName : ""} ${
          unClickable || disabled
            ? "cursor-default"
            : "cursor-pointer before:cursor-pointer"
        }`}
        disabled={disabled}
      >
        {children}
      </button>
      <img src={icon} />
    </div>
  )
}

export default UButton
