import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TextField from "../ui/text-field";
import { Control, UseFormWatch } from "react-hook-form";
import { SocialMedias } from "@/constants/social-medias";
import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AppCondition,
  ConditionMethod,
  ConditionType,
  ConditionTypeApps,
} from "@/types/dashboard/condition";
import { Card } from "@chakra-ui/react";
import { cn } from "@/lib/utils";
import ToggleButtonField from "../ui/toggle-button";
import Icon from "@/components/ui/Icon";

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
  const [selectedType, setSelectedType] = useState("Verification");
  const [selectedApp, setSelectedApp] = useState(null as string | null);

  const focusedTab = watch("focusedConditionTab") as ConditionType;

  return (
    <DialogContent className="min-w-[800px] rounded-xl border-none p-0">
      <DialogHeader className="rounded-t-lg bg-[#867FEE] p-4">
        <DialogTitle className="text-xl text-white">Add Condition</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <main className="w-full">
        <div className="p-4">
          <ToggleButtonField
            choices={Object.keys(ConditionTypeApps).map((item) => ({
              label: item,
              value: item,
            }))}
            control={control}
            name="focusedConditionTab"
            className="-mt-2"
          />

          <div className="mt-5">
            <AddConditionAppBody
              selectedCondition={null}
              selectedApp={ConditionTypeApps[focusedTab]}
            />
          </div>
        </div>
      </main>
    </DialogContent>
  );
}

const AddConditionAppBody: FC<{
  selectedApp: AppCondition[];
  selectedCondition: ConditionMethod | null;
}> = ({ selectedApp, selectedCondition }) => {
  if (selectedCondition) {
    return <ConditionFormBuilder />;
  }

  if (selectedApp.length === 1) {
    return (
      <Card
        as={"button"}
        className="flex w-full items-center justify-center rounded-lg border border-dashed p-10 text-center hover:bg-stone-50"
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
        </Card>
      ))}
    </div>
  );
};

const ConditionFormBuilder = () => {
  return <div></div>;
};
