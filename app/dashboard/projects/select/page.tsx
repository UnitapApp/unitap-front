"use client";

import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectProjects } from "@/store/projects/selectors";
import { removeProject, setSelectedProject } from "@/store/projects/slice";
import { Project } from "@/types/dashboard/project";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaChevronRight, FaTrashAlt } from "react-icons/fa";

export default function SelectProject() {
  const projects = useAppSelector(selectProjects);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const onProjectSelect = (project: Project) => {
    dispatch(setSelectedProject(project));
    router.push("/dashboard");
  };

  const onProjectDelete = (project: Project) => {
    dispatch(removeProject(project));
  };

  return (
    <div className="container mx-auto mt-12 rounded-xl bg-white p-5">
      <h3>Select Project: </h3>

      {projects.map((item, key) => (
        <button
          onClick={onProjectSelect.bind(null, item)}
          className="mt-10 flex w-full items-center justify-center gap-3 rounded border border-stone-300 p-4 hover:bg-stone-100"
          key={key}
        >
          {item.logo ? (
            <Image
              width={20}
              className="rounded-full"
              src={item.logo}
              alt={item.name}
              height={20}
            />
          ) : (
            <span className="h-5 w-5 rounded-full bg-stone-300"></span>
          )}

          <p className="text-xl">{item.name}</p>

          <div className="ml-auto flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProjectDelete(item);
              }}
              className="disabled:opacity-45"
              disabled={projects.length === 1}
            >
              <FaTrashAlt className="text-error" />
            </button>
            <FaChevronRight className="text-stone-500" />
          </div>
        </button>
      ))}
    </div>
  );
}
