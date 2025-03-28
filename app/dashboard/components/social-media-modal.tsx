import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TextField from "./text-field";
import { Control } from "react-hook-form";
import { SocialMedias } from "@/constants/social-medias";
import { Button } from "@/components/ui/button";

export default function SocialMediaModal({
  onOpenChange,
  open,
  control,
  setValue,
}: {
  open?: boolean;
  onOpenChange: (open: boolean) => void | undefined;
  control: Control<any>;
  setValue: (name: any, value: any) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-none p-0">
        <DialogHeader className="rounded-t-lg bg-[#867FEE] p-5">
          <DialogTitle className="text-xl text-white">
            Add Social Media
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <main className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(SocialMedias).map(([key, item], index) => (
              <TextField
                label={item.name}
                control={control}
                key={index}
                name={`socialMedias.${key}`}
                placeholder={item.website}
              />
            ))}
          </div>
          <DialogFooter className="mt-10 flex w-full items-center !justify-between">
            <Button
              onClick={() => setValue("socialMedias", {})}
              variant="ghost"
            >
              Clear Form
            </Button>
            <Button
              className="bg-[#867FEE] hover:bg-blue-500"
              onClick={onOpenChange.bind(null, false)}
            >
              Add
            </Button>
          </DialogFooter>
        </main>
      </DialogContent>
    </Dialog>
  );
}
