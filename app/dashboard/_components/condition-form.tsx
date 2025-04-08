import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import {
  AppCondition,
  ConditionMethod,
  ConditionType,
  ConditionTypeApps,
} from "@/types/dashboard/condition";

type ParamType = "text" | "number" | "file";

type ConditionTypeKey = keyof typeof ConditionTypeApps;

interface ConditionFormValues {
  type: ConditionTypeKey;
  app: string;
  action: string;
  params: Record<string, string | number | FileList>;
}

export default function ConditionForm() {
  const { register, handleSubmit, watch, setValue } =
    useForm<ConditionFormValues>();
  const [selectedType, setSelectedType] = useState<ConditionTypeKey | "">("");
  const [selectedApp, setSelectedApp] = useState<AppCondition | null>(null);
  const [selectedChild, setSelectedChild] = useState<ConditionMethod | null>(
    null,
  );

  const onSubmit: SubmitHandler<ConditionFormValues> = (data) => {
    console.log("Form Output:", data);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as ConditionTypeKey;
    setSelectedType(type);
    setSelectedApp(null);
    setSelectedChild(null);
    setValue("app", "");
    setValue("action", "");
  };

  const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appLabel = e.target.value;
    const app =
      ConditionTypeApps[selectedType as ConditionType]?.find(
        (a) => a.label === appLabel,
      ) || null;
    setSelectedApp(app);
    setSelectedChild(null);
    setValue("action", "");
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    const child = selectedApp?.children.find((c) => c.name === action) || null;
    setSelectedChild(child);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4 p-4">
      <div>
        <label className="block">Condition Type</label>
        <select
          {...register("type")}
          onChange={handleTypeChange}
          className="w-full border p-2"
        >
          <option value="">Select Condition Type</option>
          {Object.keys(ConditionTypeApps).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {selectedType && (
        <div>
          <label className="block">App</label>
          <select
            {...register("app")}
            onChange={handleAppChange}
            className="w-full border p-2"
          >
            <option value="">Select App</option>
            {ConditionTypeApps[selectedType]?.map((app) => (
              <option key={app.label} value={app.label}>
                {app.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedApp && (
        <div>
          <label className="block">Action</label>
          <select
            {...register("action")}
            onChange={handleActionChange}
            className="w-full border p-2"
          >
            <option value="">Select Action</option>
            {selectedApp.children.map((child) => (
              <option key={child.name} value={child.name}>
                {child.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedChild &&
        Object.entries(selectedChild.params).map(([paramKey, paramDef]) => (
          <div key={paramKey}>
            <label className="block">{paramDef.label || paramKey}</label>
            <input
              {...register(`params.${paramKey}` as const)}
              type={
                paramDef.type === "number"
                  ? "number"
                  : paramDef.type === "file"
                    ? "file"
                    : "text"
              }
              className="w-full border p-2"
              required={paramDef.required}
            />
          </div>
        ))}

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Create Condition
      </button>
    </form>
  );
}
