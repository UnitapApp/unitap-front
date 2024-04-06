import { UserProfile } from "./auth";
import { ChainApi } from "./gastap";

export enum CompetitionStatus {
  NOT_STARTED = "not_started",
  HOLDING = "holding",
  FINISHED = "finished",
}

export type Competition = {
  sponsor?: string;
  title: string;
  userProfile: UserProfile;
  details?: string;
  createdAt: string;
  startAt: string;
  status: CompetitionStatus;
  prizeAmount: number;
  chain: ChainApi;
  token: string;
  tokenAddress: string;
  discordUrl?: string;
  twitterUrl?: string;
  emailUrl?: string;
  telegramUrl?: string;
  imageUrl?: string;
  restTimeSeconds: number;
  tokenImageUrl?: string;
  isActive: boolean;
};

export type UserCompetition = {
  userProfile: UserProfile;
  competition: number;
  isWinner: boolean;
  amountWon?: number;
};

export type Question = {
  competition: number;
  number: number;
  answerTimeLimitSeconds: number;
  text: string;
};

export type Choice = {
  question: number;
  text: string;
  isCorrect?: boolean;
};

export type UserAnswer = {
  userProfile: number;
  question: number;
  selectedChoice: number;
};
