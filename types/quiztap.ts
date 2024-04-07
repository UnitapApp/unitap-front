import { UserProfile } from "./auth";

export enum CompetitionStatus {
  NOT_STARTED = "not_started",
  HOLDING = "holding",
  FINISHED = "finished",
}

export type QuestionPrevious = {
  number: number;
  pk: number;
};

export type Competition = {
  id: number;
  pk: number;
  sponsor?: string;
  title: string;
  userProfile: UserProfile;
  details?: string;
  createdAt: string;
  startAt: string;
  status: CompetitionStatus;
  prizeAmount: number;
  chain: number;
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
