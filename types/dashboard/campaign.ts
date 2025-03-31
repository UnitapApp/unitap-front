export interface Campaign {
  id: number;
  name: string;
  rules: [];
  startAt?: Date;
  endAt?: Date;
  image?: string;
  description?: string;
}
