import { Campaign } from "./campaign";

export interface Project {
  id: number;
  logo?: string;
  name: string;
  description?: string;
  website: string;
  socialMedias: Record<string, string | undefined>;
  createdAt: Date;
  campaigns: Campaign[];
}
