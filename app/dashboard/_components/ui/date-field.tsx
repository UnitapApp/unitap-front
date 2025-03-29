"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, FieldValues, Path, useController } from "react-hook-form";

export function DateField<T extends FieldValues = FieldValues>({
  control,
  name,
  className,
  label,
  placeholder,
}: {
  label?: string;
  control: Control<T>;
  name: Path<T>;
  className?: string;
  placeholder?: string;
}) {
  const {
    field: { onBlur, onChange, ref, value, disabled },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const date = value;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={className}>
          <label>{label}</label>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
          {error && <p className="text-sm text-error">{error.message}</p>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
