"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { Campaign } from "@/types/dashboard/campaign";
import { FC } from "react";
import { IoMdMore } from "react-icons/io";

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
        <CampaignCard key={item.id} campaign={item} />
      ))}
    </div>
  );
}

const CampaignCard: FC<{ campaign: Campaign }> = ({ campaign }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between rounded-t-xl bg-slate-300 p-4">
        Campagin #{campaign.id}
        <IoMdMore size={22} />
      </CardHeader>
      <CardContent className="bg-white">
        <p>#{campaign.rules.length} Rules</p>

        <div className="mt-3 flex items-center justify-between rounded bg-stone-300 p-2">
          <span>{campaign.startAt?.toString()}</span>
          <span>-</span>
          <span>{campaign.endAt?.toString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
