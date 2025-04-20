import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Control, useController, UseFormWatch } from "react-hook-form";
import { FC, useEffect, useState } from "react";
import { Card } from "@chakra-ui/react";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/Icon";
import { FaArrowLeft } from "react-icons/fa";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Select,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AppEffect,
  Effect,
  EffectMethod,
  EffectType,
  effectTypeApps,
} from "@/types/dashboard/effect";

export default function AddEffectModal({
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
  const [selectedEffect, setSelectedEffect] = useState(
    null as AppEffect | null,
  );
  const [selectedEffectType, setSelectedEffectType] = useState(
    null as null | EffectType,
  );

  const {
    field: { value, onChange },
  } = useController({
    control,
    name: "effects",
  });

  const onEffectAdd = (data: Omit<Effect, "type">) => {
    onChange([...(value || []), { ...data, type: selectedEffectType }]);
    onOpenChange(false);
  };

  return (
    <DialogContent
      className={cn(
        selectedEffect ? "w-96" : "min-w-[500px]",
        "rounded-xl border-none p-0",
      )}
    >
      <DialogHeader className="rounded-t-lg bg-[#867FEE] p-4">
        <DialogTitle className="flex items-center gap-4 text-xl text-white">
          {!!selectedEffect && (
            <button
              onClick={() => {
                setSelectedEffect(null);
              }}
            >
              <FaArrowLeft />
            </button>
          )}
          Add Effect
        </DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <main className="w-full">
        <div className="p-4">
          {selectedEffect ? (
            <ConditionFormBuilder
              onEffectAdd={onEffectAdd}
              effect={selectedEffect}
            />
          ) : (
            <>
              <div className="mt-5">
                <AddConditionAppBody
                  setSelectedEffectType={setSelectedEffectType}
                  setSelectedEffectApp={setSelectedEffect}
                  selectedEffectApp={selectedEffect}
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
  selectedEffectApp: AppEffect | null;
  setSelectedEffectType: (arg: EffectType | null) => void;
  setSelectedEffectApp: (arg: AppEffect | null) => void;
}> = ({ selectedEffectApp, setSelectedEffectApp, setSelectedEffectType }) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.keys(effectTypeApps).map((effectApp, key) => (
        <Card
          key={key}
          onClick={() => {
            setSelectedEffectApp(effectTypeApps[effectApp as EffectType]);
            setSelectedEffectType(effectApp as EffectType);
          }}
          as={"button"}
          className="flex items-center justify-center rounded-lg border border-dashed p-5 text-center hover:bg-stone-50"
        >
          <Icon
            iconSrc={effectTypeApps[effectApp as EffectType].logo}
            alt={effectTypeApps[effectApp as EffectType].label}
            width="20"
            height="20"
          />{" "}
          {effectTypeApps[effectApp as EffectType].label}
        </Card>
      ))}
    </div>
  );
};

const ConditionFormBuilder: FC<{
  effect: AppEffect;
  onEffectAdd: (arg: Omit<Effect, "type">) => void;
}> = ({ effect: condition, onEffectAdd }) => {
  const [selectedMethod, setSelectedMethod] = useState<EffectMethod | null>(
    null,
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);
  const [customPoint, setCustomPoint] = useState<string>("");
  const [pointOptions, setPointOptions] = useState<string[]>(["Unitap Point"]);
  const [isAddingPointer, setIsAddingPointer] = useState(false);

  const handleCustomPointChange = (value: string) => {
    setCustomPoint(value);
    if (value && !pointOptions.includes(value)) {
      setPointOptions((prev) => [...prev, value]);
      localStorage.setItem("customPoint", value); // Store custom point in localStorage
    }
  };

  useEffect(() => {
    const storedPoint = localStorage.getItem("customPoint");
    if (storedPoint && !pointOptions.includes(storedPoint)) {
      setPointOptions((prev) => [...prev, storedPoint]);
    }
  }, []);

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

  const handleAddPointer = (newPoint: string) => {
    setPointOptions((prev) => [...prev, newPoint]);
    setIsAddingPointer(false);
    setCustomPoint(newPoint);
  };

  const handleAddPointerClick = () => {
    setIsAddingPointer(true);
  };

  const handleCancelAddingPointer = () => {
    setIsAddingPointer(false);
  };

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
      {isAddingPointer ? (
        // Show the NewPointerForm when adding a new pointer
        <NewPointerForm
          onAddPointer={handleAddPointer}
          onCancel={handleCancelAddingPointer}
        />
      ) : (
        <>
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
                      onChange={(e) =>
                        handleInputChange(key, e.target.files?.[0])
                      }
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

          {condition.label === "Point" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="pointSelection">Select Point</Label>
                <Select
                  onValueChange={(val) =>
                    handleInputChange("selectedPoint", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a point..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pointOptions.map((point) => (
                      <SelectItem key={point} value={point}>
                        {point}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  className="mt-5 block rounded-xl px-3 py-1"
                  onClick={handleAddPointerClick} // Button to add new pointer
                >
                  Add New Pointer
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 text-right">
            <button
              className="rounded-xl border border-black bg-primary-dashboard px-5 py-2 text-white hover:bg-primary-dashboard/90 disabled:opacity-50"
              disabled={!isValid}
              onClick={() => {
                onEffectAdd({
                  effectName: selectedMethod!.name,
                  params: formData,
                  thirdpartyapp: condition.label,
                  logo: condition.logo,
                });
              }}
            >
              Add
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

const NewPointerForm: FC<{
  onAddPointer: (point: string) => void;
  onCancel: () => void;
}> = ({ onAddPointer, onCancel }) => {
  const [newPointer, setNewPointer] = useState("");

  const handleAddClick = () => {
    if (newPointer) {
      onAddPointer(newPointer);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newPointer">Enter New Pointer</Label>
        <Input
          id="newPointer"
          type="text"
          value={newPointer}
          onChange={(e) => setNewPointer(e.target.value)}
          placeholder="Enter new pointer"
        />
      </div>

      <div className="flex flex-row-reverse justify-start gap-4">
        <button
          className="rounded-xl border border-black bg-primary-dashboard px-5 py-2 text-white hover:bg-primary-dashboard/90"
          onClick={handleAddClick}
        >
          Add
        </button>
        <button
          className="bg-gray-300 rounded-xl border border-black px-5 py-2"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
