"use client";

import { PropsWithChildren } from "react";
import DashboardSidebar from "./sidebar";
import DashboardHeader from "./header";
import AddNewCampagin from "../modals/add-campaign-modal";
import { useAppDispatch, useAppSelector } from "@/store";
import { changeAddCampaginModal } from "@/store/projects/slice";
import {
  selectIsAddCampaginOpen,
  selectProjects,
} from "@/store/projects/selectors";
import CreateProjectForm from "../create-project-form";
import { useUserProfileContext } from "@/context/userProfile";

export default function DashboardLayout({ children }: PropsWithChildren) {
  const isOpen = useAppSelector(selectIsAddCampaginOpen);
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const { userToken } = useUserProfileContext();

  if (!projects.length && userToken)
    return (
      <div className="flex h-screen items-center justify-center bg-blue-50">
        <CreateProjectForm />
      </div>
    );

  return (
    <div className="flex h-screen gap-2 bg-[#F1F5F9] p-5">
      <DashboardSidebar />
      <main className="container mx-auto flex-1">
        <DashboardHeader />
        {children}

        <AddNewCampagin
          onOpenChange={(isOpen) => dispatch(changeAddCampaginModal(isOpen))}
          open={isOpen}
        />
      </main>
    </div>
  );
}
