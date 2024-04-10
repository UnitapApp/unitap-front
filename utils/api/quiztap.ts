import { Competition, CompetitionStatus, QuestionResponse } from "@/types";
import { WithPagination } from "../pagination";
import { serverFetch } from ".";
import { axiosInstance } from "./base";

export const fetchQuizzesApi = async (
  pageIndex?: number,
): Promise<WithPagination<Competition>> => {
  const response: WithPagination<Competition> = await serverFetch(
    "/api/quiztap/competitions/" + (pageIndex ? `?page=${pageIndex}` : ""),
  );

  return response;
};

export const fetchQuizQuestionApi = async (questionId: number) => {
  const response = await axiosInstance.get<QuestionResponse>(
    "/api/quiztap/questions/" + questionId,
  );

  return response.data;
};

export const submitAnswerApi = async (
  questionId: number,
  userEnrollmentPk: number,
  choicePk: number,
) => {
  const response = await axiosInstance.post(
    "/api/quiztap/competitions/submit-answer/",
    {
      userCompetition: userEnrollmentPk,
      selectedChoice: choicePk,
      question: questionId,
    },
  );

  return response.data;
};

export const enrollQuizApi = async (id: number) => {
  const response: { id: number; competition: Competition } = (
    await axiosInstance.post("/api/quiztap/competitions/enroll/", {
      competition: id,
    })
  ).data;

  return response;
};

export const fetchQuizApi = async (id: number): Promise<Competition> => {
  return (await fetchQuizzesApi()).results.find((item) => item.id == id)!;

  // return {
  //   title: "Optimism Quiz Tap",
  //   chain: {
  //     pk: 17,
  //     chainName: "Rootstock Mainnet",
  //     chainId: "30",
  //     nativeCurrencyName: "RBTC",
  //     symbol: "RBTC",
  //     decimals: 18,
  //     explorerUrl: "https://explorer.rsk.co",
  //     rpcUrl: "https://public-node.rsk.co",
  //     logoUrl:
  //       "https://chainlist.wtf/static/cb755722e5ced5bf0e423f70021b91d9/179cd/rootstock.webp",
  //     modalUrl:
  //       "https://chainlist.wtf/static/cb755722e5ced5bf0e423f70021b91d9/179cd/rootstock.webp",
  //     isTestnet: false,
  //     chainType: "EVM",
  //   },
  //   createdAt: "2024-04-05T09:05:52.331Z",
  //   startAt: "2024-04-07T09:17:52.331Z",
  //   isActive: true,
  //   prizeAmount: 200000,
  //   restTimeSeconds: 10,
  //   status: CompetitionStatus.HOLDING,
  //   token: "MATIC",
  //   tokenAddress: "0xb3A97684Eb67182BAa7994b226e6315196D8b364",
  //   userProfile: {
  //     initial_context_id: "-13123",
  //     isAuraVerified: true,
  //     isMeetVerified: true,
  //     pk: 1,
  //     token: "",
  //     username: "alimak",
  //     wallets: [],
  //   },
  //   details: "Get ready for a fun ride into the future",
  // };
};

export const fetchUserQuizEnrollment = async (
  userToken: string,
  competitionPk: number,
) => {
  const res = await axiosInstance.get<WithPagination<{ id: number }>>(
    "/api/quiztap/competitions/enroll/?competition_pk=" + competitionPk,
    {
      headers: {
        Authorization: `TOKEN ${userToken}`,
      },
    },
  );

  return res.data.results[0].id;
};

export const fetchUsersQuizEnrollments = async () => {
  const res = await axiosInstance.get<
    WithPagination<{ id: number; competition: Competition }>
  >("/api/quiztap/competitions/enroll/");

  return res.data.results;
};
