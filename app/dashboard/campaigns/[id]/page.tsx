"use client";

import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { selectFocusedProjectCampaigns } from "@/store/projects/selectors";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { FaChevronLeft } from "react-icons/fa";
import ProjectImage from "../../_components/ui/project-image";

export default function CmapaignDetailsPage() {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/campaigns"
          className="grid h-12 w-12 place-items-center rounded-lg border border-black bg-white hover:bg-stone-100"
        >
          <FaChevronLeft size={20} />
        </Link>

        <h4>Campaigns Details</h4>
      </div>

      <div className="mt-5">
        <CampaignDetailsCard />
      </div>
    </div>
  );
}

const CampaignDetailsCard = () => {
  const params = useParams();

  const id = params["id"]! as string;

  const campaigns = useAppSelector(selectFocusedProjectCampaigns);

  const campaign = useMemo(
    () => campaigns?.find((item) => item.id === Number(id)),
    [campaigns, id],
  );

  if (!campaign) return null;

  return (
    <Card>
      <div className="flex flex-row items-center gap-2 p-4">
        <ProjectImage
          alt={campaign.name}
          src={campaign.image}
          className="h-20 w-20"
        />
        <div className="font-semibold">{campaign.name}</div>

        <div className="ml-auto flex items-center justify-between rounded-xl bg-[#F1F5F9] p-1 px-4 text-sm">
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
      </div>
      <p>#{campaign.rules.length} Rules</p>
    </Card>
  );
};
