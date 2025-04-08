"use client";

import { cn } from "@/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export default function ToggleButtonField<T extends FieldValues = FieldValues>({
  label,
  control,
  name,
  className,
  choices,
}: {
  label?: string;
  control: Control<T>;
  name: Path<T>;
  className?: string;
  choices: { label: string; value: any }[];
}) {
  return (
    <label className={cn("block w-full", className)}>
      <span>{label}</span>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, onBlur, value, ref, disabled },
          fieldState: { error, invalid },
        }) => (
          <div className={cn("mt-2 flex gap-1 rounded-xl border p-1")}>
            {choices.map((choice, key) => (
              <button
                key={key}
                className={cn(
                  value === choice.value
                    ? "bg-primary-dashboard text-white"
                    : "bg-transparent",
                  "flex-1 rounded-xl px-4 py-2 transition-all",
                )}
                onClick={onChange.bind(null, choice.value)}
              >
                {choice.label}
              </button>
            ))}
            {!!error && (
              <p className="mt-1 text-sm text-error">{error.message}</p>
            )}
          </div>
        )}
      />
    </label>
  );
}
