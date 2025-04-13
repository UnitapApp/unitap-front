import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Control, useController, UseFormWatch } from "react-hook-form";
import { FC, useEffect, useState } from "react";
import {
  AppCondition,
  Condition,
  ConditionMethod,
  ConditionType,
  ConditionTypeApps,
} from "@/types/dashboard/condition";
import { Card } from "@chakra-ui/react";
import { cn } from "@/lib/utils";
import ToggleButtonField from "../ui/toggle-button";
import Icon from "@/components/ui/Icon";
import { toTitle } from "@/utils";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddConditionModal({
  onOpenChange,
  open,
  control,
  watch,
}: {
  open?: boolean;
  onOpenChange: (open: boolean) => void | undefined;
  control: Control<any>;
  watch: UseFormWatch<any>;
}) {
  const [selectedCondition, setSelectedCondition] = useState(
    null as AppCondition | null,
  );

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "conditions",
  });
  const focusedTab = watch("focusedConditionTab") as ConditionType;

  const onConditionAdd = (data: Omit<Condition, "type">) => {
    onChange([...(value || []), { ...data, type: focusedTab }]);
    onOpenChange(false);
  };

  return (
    <DialogContent
      className={cn(
        selectedCondition ? "w-96" : "min-w-[800px]",
        "rounded-xl border-none p-0",
      )}
    >
      <DialogHeader className="rounded-t-lg bg-[#867FEE] p-4">
        <DialogTitle className="flex items-center gap-4 text-xl text-white">
          {!!selectedCondition && (
            <button
              onClick={() => {
                setSelectedCondition(null);
              }}
            >
              <FaArrowLeft />
            </button>
          )}
          Add Condition
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <main className="w-full">
        <div className="p-4">
          {selectedCondition ? (
            <ConditionFormBuilder
              onConditionAdd={onConditionAdd}
              condition={selectedCondition}
            />
          ) : (
            <>
              <ToggleButtonField
                choices={Object.keys(ConditionTypeApps).map((item) => ({
                  label: toTitle(item),
                  value: item,
                }))}
                control={control}
                name="focusedConditionTab"
                className="-mt-2"
              />

              <div className="mt-5">
                <AddConditionAppBody
                  setSelectedCondition={setSelectedCondition}
                  selectedCondition={selectedCondition}
                  selectedApp={ConditionTypeApps[focusedTab]}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </DialogContent>
  );
}

const AddConditionAppBody: FC<{
  selectedApp: AppCondition[];
  selectedCondition: AppCondition | null;
  setSelectedCondition: (arg: AppCondition | null) => void;
}> = ({ selectedApp, selectedCondition, setSelectedCondition }) => {
  if (selectedApp.length === 1) {
    return (
      <Card
        as={"button"}
        className="flex w-full items-center justify-center rounded-lg border border-dashed p-10 text-center hover:bg-stone-50"
        onClick={() => setSelectedCondition(selectedApp[0])}
      >
        <Icon
          iconSrc={selectedApp[0].logo}
          alt={selectedApp[0].label}
          width="20"
          height="20"
        />{" "}
        {selectedApp[0].label}
      </Card>
    );
  }

  if (selectedApp.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Card
          onClick={() => setSelectedCondition(selectedApp[0])}
          as={"button"}
          className="flex items-center justify-center rounded-lg border border-dashed p-5 text-center hover:bg-stone-50"
        >
          <Icon
            iconSrc={selectedApp[0].logo}
            alt={selectedApp[0].label}
            width="20"
            height="20"
          />{" "}
          {selectedApp[0].label}
        </Card>
        <Card
          onClick={() => setSelectedCondition(selectedApp[1])}
          as={"button"}
          className="flex items-center justify-center rounded-lg border border-dashed p-5 text-center hover:bg-stone-50"
        >
          <Icon
            iconSrc={selectedApp[1].logo}
            alt={selectedApp[1].label}
            width="20"
            height="20"
          />
          {selectedApp[1].label}
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", `grid-cols-3`)}>
      {selectedApp.map((method, key) => (
        <Card
          onClick={() => setSelectedCondition(method)}
          as={"button"}
          key={key}
          className="flex !flex-row items-center gap-2 rounded-lg border p-3 text-center hover:bg-stone-50"
        >
          <Icon
            iconSrc={method.logo}
            alt={method.label}
            width="20"
            height="20"
          />
          <span className="text-sm">{method.label}</span>
          <FaChevronRight className="ml-auto text-stone-300" />
        </Card>
      ))}
    </div>
  );
};

const ConditionFormBuilder: FC<{
  condition: AppCondition;
  onConditionAdd: (arg: Omit<Condition, "type">) => void;
}> = ({ condition, onConditionAdd }) => {
  const [selectedMethod, setSelectedMethod] = useState<ConditionMethod | null>(
    null,
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!selectedMethod) {
      setIsValid(false);
      return;
    }

    const valid = Object.entries(selectedMethod.params).every(
      ([key, config]) => {
        if (!config.required) return true;
        const value = formData[key];
        return config.type === "file"
          ? !!value
          : value !== "" && value !== undefined;
      },
    );

    setIsValid(valid);
  }, [formData, selectedMethod]);

  return (
    <Card className="space-y-6">
      <header className="flex items-center gap-4">
        <img
          src={condition.logo}
          alt={condition.label}
          width={20}
          height={20}
        />
        <h2 className="text-lg font-medium">{condition.label}</h2>
      </header>

      <Select
        onValueChange={(val: string) => {
          const method = condition.children.find((m) => m.name === val);
          setSelectedMethod(method || null);
          setFormData({});
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select method..." />
        </SelectTrigger>
        <SelectContent>
          {condition.children.map((method) => (
            <SelectItem key={method.name} value={method.name}>
              {method.label || method.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedMethod && (
        <div className="space-y-4">
          {Object.entries(selectedMethod.params).map(([key, config]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key}>
                {config.label || key} {config.required && "*"}
              </Label>
              {config.type === "file" ? (
                <Input
                  id={key}
                  type="file"
                  onChange={(e) => handleInputChange(key, e.target.files?.[0])}
                  required={config.required}
                />
              ) : (
                <Input
                  id={key}
                  type={config.type}
                  value={formData[key] || ""}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  required={config.required}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 text-right">
        <button
          className="rounded-xl border border-black bg-primary-dashboard px-5 py-2 text-white hover:bg-primary-dashboard/90 disabled:opacity-50"
          disabled={!isValid}
          onClick={() => {
            onConditionAdd({
              constraintName: selectedMethod!.name,
              params: formData,
              thirdpartyapp: condition.label,
              logo: condition.logo,
            });
          }}
        >
          Add
        </button>
      </div>
    </Card>
  );
};
