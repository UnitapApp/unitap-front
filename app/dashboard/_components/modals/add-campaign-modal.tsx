"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import TextField from "../ui/text-field";
import TextareaField from "../ui/textarea-field";
import { DateField } from "../ui/date-field";
import { useAppDispatch } from "@/store";
import { createCampagin } from "@/store/projects/slice";
import ImageUploader from "../ui/image-uploader";
import { useRouter } from "next/navigation";

const createCampaginValidation = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    startAt: z.date().optional(),
    endAt: z.date().optional(),
    image: z.string().optional(),
  })
  .refine((data) => !data.startAt || !data.endAt || data.startAt < data.endAt, {
    message: "startAt must be before endAt",
    path: ["startAt"],
  });

type CreateCampaignType = z.infer<typeof createCampaginValidation>;

export default function AddNewCampagin({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (arg: boolean) => void;
}) {
  const { control, reset, handleSubmit } = useForm<CreateCampaignType>({
    defaultValues: {},
    resolver: zodResolver(createCampaginValidation),
  });

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onSubmit = (data: CreateCampaignType) => {
    reset({});
    const newId = Math.floor(Math.random() * 99999);

    dispatch(
      createCampagin({
        ...data,
        id: newId,
        rules: [],
      }),
    );

    router.push(`/dashboard/campaigns/${newId}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-none p-0">
        <DialogHeader className="rounded-t-lg bg-[#867FEE] p-5">
          <DialogTitle className="text-xl text-white">
            Add New Campagin
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <main className="p-5">
            <div className="grid grid-cols-1 gap-3">
              <ImageUploader control={control} name="image" />
              <TextField
                label="Name"
                control={control}
                name={`name`}
                placeholder={"Enter Name"}
              />
              <TextareaField
                label="Description"
                control={control}
                name={`description`}
                placeholder={"Say Something..."}
              />

              <div className="flex items-center gap-2">
                <DateField
                  control={control}
                  name="startAt"
                  label="Start Date"
                  placeholder="Choose date"
                />
                <DateField
                  control={control}
                  name="endAt"
                  label="End Date"
                  placeholder="Choose date"
                />
              </div>
            </div>
          </main>

          <DialogFooter className="flex items-center gap-2 p-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-lg border border-black px-5 py-3 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-brand-primary flex-1 rounded-lg border border-black px-5 py-3 hover:bg-green-300"
            >
              Create Campagin
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
