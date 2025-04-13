"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FaChevronRight, FaDownload, FaImage } from "react-icons/fa";
import TextField from "./ui/text-field";
import TextareaField from "./ui/textarea-field";
import Image from "next/image";
import SocialMediaModal from "./modals/social-media-modal";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { addProject } from "@/store/projects/slice";
import { Campaign } from "@/types/dashboard/campaign";
import { selectProjects } from "@/store/projects/selectors";
import ImageUploader from "./ui/image-uploader";
import { useRouter } from "next/navigation";

const createProjectValidation = z.object({
  logo: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  website: z.string(),
  socialMedias: z.record(z.string().optional()),
});

type CreateProjectType = z.infer<typeof createProjectValidation>;

export default function CreateProjectForm() {
  const { control, register, setValue, resetField, handleSubmit } =
    useForm<CreateProjectType>({
      defaultValues: {},
      resolver: zodResolver(createProjectValidation),
    });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const projects = useAppSelector(selectProjects);
  const router = useRouter();

  const onSubmit = (data: CreateProjectType) => {
    dispatch(
      addProject({
        id: projects.length,
        campaigns: [] as Campaign[],
        createdAt: new Date(),
        ...data,
      }),
    );

    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[500px] overflow-hidden rounded-2xl border border-black bg-white"
    >
      <SocialMediaModal
        setValue={resetField}
        control={control}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
      <header className="border-b border-black bg-slate-200 p-4">
        New Project
      </header>
      <main className="flex flex-col gap-4 p-6">
        <ImageUploader control={control} name="logo" />

        <TextField
          placeholder="Enter Name"
          control={control}
          name="name"
          label="Label"
        />
        <TextareaField
          placeholder="Say Something..."
          control={control}
          name="description"
          label="Description"
        />
        <TextField
          placeholder="https://Example.com"
          control={control}
          name="website"
          label="Website"
        />
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-100"
        >
          Social Media
          <span className="flex items-center gap-3">
            <Image
              src="/assets/images/provider-dashboard/social-medias.png"
              alt="social medias"
              width={59}
              height={20}
            />
            <FaChevronRight className="text-gray100" />
          </span>
        </button>
        <button
          type="submit"
          className="w-full rounded-lg border bg-[#72FFC6] py-3 text-center"
        >
          Create Project
        </button>
      </main>
    </form>
  );
}
