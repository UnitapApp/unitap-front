"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store";
import { Campaign } from "@/types/dashboard/campaign";
import { FC } from "react";
import { IoMdMore } from "react-icons/io";
import ProjectImage from "../_components/ui/project-image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
} from "@/components/ui/menubar";
import { selectSelectedProject } from "@/store/projects/selectors";
import { editProject, removeCampaign } from "@/store/projects/slice";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Campaigns() {
  const campagins = useAppSelector(
    (state) => state.projects.selectedProject?.campaigns,
  );

  if (!campagins?.length) {
    return (
      <div className="mt-20 text-center text-xl">
        There are no campaigns for this project
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-3 gap-5">
      {campagins.map((item) => (
        <div key={item.id}>
          <CampaignCard campaign={item} />
        </div>
      ))}
    </div>
  );
}

const CampaignCard: FC<{ campaign: Campaign }> = ({ campaign }) => {
  const dispatch = useAppDispatch();

  const onDeleteCampaign = () => {
    dispatch(
      removeCampaign({
        campaign,
      }),
    );
  };

  return (
    <Card className="rounded-xl bg-white">
      <CardHeader className="flex flex-row items-center gap-2 p-4 font-semibold">
        <ProjectImage
          alt={campaign.name}
          src={campaign.image}
          className="h-12 w-12"
        />
        {campaign.name}
        <Popover>
          <PopoverTrigger asChild>
            <Button className="ml-auto" variant="ghost" size="icon">
              <IoMdMore size={30} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-1">
            <Link
              href={`/dashboard/campaigns/${campaign.id}`}
              className="block w-full p-2 text-left hover:bg-stone-100"
            >
              Edit Campaign
            </Link>
            <button
              onClick={onDeleteCampaign}
              className="w-full p-2 text-left text-error hover:bg-stone-100"
            >
              Delete Campaign
            </button>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent className="">
        <p>#{campaign.rules.length} Rules</p>

        <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F1F5F9] p-1 px-4 text-sm">
          <span>
            {campaign.startAt
              ? new Date(campaign.startAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : ""}
          </span>
          <span>-</span>
          <span>
            {campaign.endAt
              ? new Date(campaign.endAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
