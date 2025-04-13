import { Rule } from "./rule";

export interface Campaign {
  id: number;
  name: string;
  rules: Rule[];
  startAt?: Date;
  endAt?: Date;
  image?: string;
  description?: string;
}
