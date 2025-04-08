"use client";

import AddConditionModal from "@/app/dashboard/_components/modals/add-condition-modal";
import { DateField } from "@/app/dashboard/_components/ui/date-field";
import TextField from "@/app/dashboard/_components/ui/text-field";
import ToggleButtonField from "@/app/dashboard/_components/ui/toggle-button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ConditionType } from "@/types/dashboard/condition";
import { EffectType } from "@/types/dashboard/effect";
import { RuleType } from "@/types/dashboard/rule";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { Control, useForm, UseFormWatch } from "react-hook-form";
import { FaChevronLeft, FaPlusCircle } from "react-icons/fa";
import { z } from "zod";

const addEventRuleValidation = z.object({
  name: z.string(),
  type: z.enum([RuleType.OneTime, RuleType.Periodic]),
  startTime: z.date(),
  expireTime: z.date(),
  focusedConditionTab: z.string().nullable().optional(),
  limitOfUsage: z.coerce.number(),
  conditions: z.array(
    z.object({
      type: z.enum([
        ConditionType.OffChain,
        ConditionType.OnChain,
        ConditionType.SocialMedia,
        ConditionType.Verification,
        ConditionType.WhiteList,
      ]),
      thirdPartyApp: z.string(),
      params: z.object({}),
    }),
  ),
  effects: z.array(
    z.object({
      type: z.enum([
        EffectType.Badge,
        EffectType.DiscordRole,
        EffectType.FCFS,
        EffectType.FortuneWheel,
        EffectType.Point,
        EffectType.PointMultiplier,
        EffectType.Raffle,
      ]),
      params: z.object({}),
      effectName: z.string(),
    }),
  ),
});

type AddEventRuleType = z.infer<typeof addEventRuleValidation>;

export default function NewEventRule() {
  const params = useParams();
  const form = useForm<AddEventRuleType>({
    defaultValues: {
      name: "Rule #0",
      conditions: [],
      effects: [],
      type: RuleType.OneTime,
      focusedConditionTab: ConditionType.Verification,
    },
    resolver: zodResolver(addEventRuleValidation),
  });

  return (
    <div className="mt-5">
      <header className="flex items-center gap-3">
        <Link
          href={"/dashboard/campaigns/" + params.id}
          className="grid h-12 w-12 place-items-center rounded-lg border border-black bg-white hover:bg-stone-100"
        >
          <FaChevronLeft size={20} />
        </Link>

        <h4>New Rule</h4>

        <div className="ml-auto">
          <button
            type="submit"
            className="flex-1 rounded-lg border border-black bg-brand-primary px-5 py-3 hover:bg-green-300"
          >
            Save Rule
          </button>
        </div>
      </header>

      <div className="mt-5 grid grid-cols-8 gap-4">
        <RuleInfo control={form.control} />
        <ConditionsSection watch={form.watch} control={form.control} />
      </div>
    </div>
  );
}

const RuleInfo: FC<{ control: Control<AddEventRuleType> }> = ({ control }) => {
  return (
    <Card className="col-span-2 rounded-2xl border border-black p-5">
      <TextField control={control} name="name" placeholder="Rule #1" />

      <div className="mt-5">
        <ToggleButtonField
          control={control}
          name="type"
          choices={[
            {
              label: "One-Time",
              value: RuleType.OneTime,
            },
            {
              label: "Periodic",
              value: RuleType.Periodic,
            },
          ]}
          label="Event Type"
        />
      </div>

      <div className="mt-3">
        <DateField
          control={control}
          name="startTime"
          className="w-full"
          label="Start Time"
          placeholder="Choose Date"
        />
      </div>
      <div className="mt-3">
        <DateField
          control={control}
          name="expireTime"
          className="w-full"
          label="Expire Time"
          placeholder="Choose Date"
        />
      </div>
      <div className="mt-5">
        <TextField
          control={control}
          name="limitOfUsage"
          label="Limit Of Usage"
          placeholder="Enter Limit Of Usage"
          type="number"
        />
      </div>
    </Card>
  );
};

const ConditionsSection: FC<{
  control: Control<AddEventRuleType>;
  watch: UseFormWatch<AddEventRuleType>;
}> = ({ control, watch }) => {
  const [open, onOpenChange] = useState(false);
  return (
    <div className="col-span-3">
      <div className="rounded-3xl bg-primary-dashboard px-4 py-4 text-center text-white">
        Condition
      </div>

      <Card className="mt-4 rounded-2xl p-5">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex w-full items-center justify-center gap-4 rounded-xl border-2 border-dashed p-5 transition-colors hover:bg-stone-100">
              <FaPlusCircle /> Add Condition
            </button>
          </DialogTrigger>
          <AddConditionModal
            control={control}
            onOpenChange={onOpenChange}
            open={open}
            watch={watch}
          />
        </Dialog>
      </Card>
    </div>
  );
};
