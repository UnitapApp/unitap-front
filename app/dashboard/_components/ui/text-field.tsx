import { Input } from "@/components/ui/input";
import { cn } from "@/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export default function TextField<T extends FieldValues = FieldValues>({
  label,
  control,
  name,
  className,
  placeholder,
}: {
  label?: string;
  control: Control<T>;
  name: Path<T>;
  className?: string;
  placeholder?: string;
}) {
  return (
    <label className="block w-full">
      <span>{label}</span>
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, onBlur, value, ref, disabled },
          fieldState: { error, invalid },
        }) => (
          <>
            <Input
              placeholder={placeholder}
              className={cn(
                "mt-3 h-9 w-full transition-all",
                invalid ? "border-error" : "",
                className,
              )}
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={disabled}
              type="text"
            />
            {!!error && (
              <p className="mt-1 text-sm text-error">{error.message}</p>
            )}
          </>
        )}
      />
    </label>
  );
}
