import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export default function TextareaField<T extends FieldValues = FieldValues>({
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
            <Textarea
              placeholder={placeholder}
              rows={5}
              cols={20}
              className={cn(
                "mt-3 h-auto w-full min-w-48 rounded-md border border-slate-200 p-3 ring-stone-200 transition-all focus:ring-2",
                invalid ? "border-error" : "",
                className,
              )}
              value={value ?? ""}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              disabled={disabled}
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
