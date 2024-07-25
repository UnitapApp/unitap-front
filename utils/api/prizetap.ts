import axios from "axios";
import { axiosInstance } from "./base";
import { EnrollmentRaffleApi, EnrollmentSignature, Prize } from "@/types";

export async function getRafflesListAPI(token: string | undefined) {
  if (token) {
    const response = await axiosInstance.get<Prize[]>(
      "/api/prizetap/raffle-list/",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
    return response.data.filter(
      (raffle) => raffle.status !== "PENDING" && raffle.status !== "REJECTED",
    );
  }
  const response = await axiosInstance.get<Prize[]>(
    "/api/prizetap/raffle-list/",
  );
  return response.data.filter(
    (raffle) => raffle.status !== "PENDING" && raffle.status !== "REJECTED",
  );
}

export async function updateEnrolledFinished(
  token: string,
  raffleID: number | undefined,
  txHash: string,
) {
  const response = await axiosInstance.post<any>(
    `api/prizetap/set-enrollment-tx/${raffleID}/`,
    { txHash },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  return response.data;
}

export async function updateClaimPrizeFinished(
  token: string,
  raffleID: number | undefined,
  txHash: string,
) {
  const response = await axiosInstance.post<any>(
    `api/prizetap/set-claiming-prize-tx/${raffleID}/`,
    { txHash },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  return response.data;
}

export async function getEnrollmentApi(
  token: string,
  raffleID: number,
  address: string,
  userTicketChance: number,
) {
  console.log(userTicketChance);
  const response = await axiosInstance.post<EnrollmentRaffleApi>(
    `/api/prizetap/raffle-enrollment/${raffleID}/`,
    {
      userWalletAddress: address,
      prizetap_winning_chance_number: userTicketChance.toString(),
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  return response.data;
}

export async function getMuonApi(raffleEntryId: number) {
  const app = Number(process.env.NEXT_PUBLIC_IS_STAGE)
    ? "stage_unitap"
    : "unitap";

  const response = await axios.post<EnrollmentSignature>(
    `https://shield.unitap.app/v1/?app=${app}&method=raffle-entry&params[raffleEntryId]=${raffleEntryId}`,
    null,
  );
  return response.data;
}

export async function getRaffleConstraintsVerifications(
  rafflePk: number,
  token: string,
) {
  const response = await axiosInstance.get(
    "/api/prizetap/get-raffle-constraints/" + rafflePk + "/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );

  return response.data;
}

export async function getLineaRaffleEntries() {
  const response = await axiosInstance.get("/api/prizetap/get-linea-entries/");

  return response.data;
}

export async function getEnrolledWalletInRaffle(pk: number) {
  const response = await axiosInstance.get(
    `/api/prizetap/raffle-entries/${pk}`,
  );

  try {
    const count = response.data.count;
    const next = response.data.next;
    const prev = response.data.previous;
    const entries = response.data.results;
    return { success: true, count, next, prev, entries };
  } catch {
    return { success: false, count: null, next: null, prev: null, entries: [] };
  }
}
