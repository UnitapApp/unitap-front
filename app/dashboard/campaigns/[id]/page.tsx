"use client";

import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { selectFocusedProjectCampaigns } from "@/store/projects/selectors";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useMemo } from "react";
import { FaChevronLeft, FaPencilAlt } from "react-icons/fa";
import ProjectImage from "../../_components/ui/project-image";
import AddRuleButton from "../../_components/add-rule-button";
import { Campaign } from "@/types/dashboard/campaign";
import { IoMdMore } from "react-icons/io";

export default function CmapaignDetailsPage() {
  const params = useParams();

  const id = params["id"]! as string;

  const campaigns = useAppSelector(selectFocusedProjectCampaigns);

  const campaign = useMemo(
    () => campaigns?.find((item) => item.id === Number(id)),
    [campaigns, id],
  );

  if (!campaign) return null;

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

      <div className="my-8">
        <CampaignDetailsCard campaign={campaign} />
      </div>
      <AddRuleButton />

      <div className="mt-10">
        <CampaignRulesSection campagin={campaign} />
      </div>
    </div>
  );
}

const CampaignDetailsCard: FC<{ campaign: Campaign }> = ({ campaign }) => {
  return (
    <Card className="p-4">
      <div className="flex flex-row items-center gap-2 p-4">
        <ProjectImage
          alt={campaign.name}
          src={campaign.image}
          className="h-20 w-20"
        />
        <div>
          <div className="font-semibold">{campaign.name}</div>
          <p className="mt-4">#{campaign.rules.length} Rules</p>
        </div>

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
      <div className="leading-loose">{campaign.description}</div>
    </Card>
  );
};

const CampaignRulesSection: FC<{ campagin: Campaign }> = ({ campagin }) => {
  if (!campagin.rules.length) return null;

  return (
    <div className="flex flex-col gap-4">
      {campagin.rules.map((rule, key) => (
        <div key={key} className="overflow-hidden rounded-xl shadow-sm">
          <div className="flex items-center bg-primary-dashboard p-3 text-white">
            <span>{rule.name}</span>
            <span className="ml-auto rounded-sm bg-white px-3 py-1 text-xs text-black">
              {rule.isEventRule ? "Event Rule" : "Time Based Rule"}
            </span>

            <FaPencilAlt />
            <IoMdMore />
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 bg-white p-5 text-black"></div>
    </div>
  );
};

const ConditionsSection = () => {};

const EffectsSection = () => {};
