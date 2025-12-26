import axios from "axios";
import { axiosInstance } from "./base";
import { EnrollmentRaffleApi, EnrollmentSignature, Prize } from "@/types";
import { apiData } from ".";

export async function getRafflesListAPI(token: string | undefined) {
  const response = apiData["/api/prizetap/raffle-list/"] as unknown as Prize[];
  if (token) {
    return response.filter(
      (raffle) => raffle.status !== "PENDING" && raffle.status !== "REJECTED",
    );
  }

  return response.filter(
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
  const cloudFlareaptchaToken = localStorage.getItem("captcha-token");
  const hCaptchaToken = localStorage.getItem("h-captcha-token");

  const response = await axiosInstance.post<EnrollmentRaffleApi>(
    `/api/prizetap/raffle-enrollment/${raffleID}/`,
    {
      userWalletAddress: address,
      prizetap_winning_chance_number: userTicketChance.toString(),
    },
    {
      headers: {
        "cf-turnstile-response": cloudFlareaptchaToken,
        "hc-turnstile-response": hCaptchaToken,
        Authorization: `Token ${token}`,
      },
      // params: {
      //   "cf-turnstile-response": cloudFlareaptchaToken,
      // },
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
  const cloudflareCaptchaToken = localStorage.getItem("captcha-token");
  const hCaptchaToken = localStorage.getItem("h-captcha-token");

  const response = await axiosInstance.get(
    "/api/prizetap/get-raffle-constraints/" + rafflePk + "/",
    {
      headers: {
        Authorization: `Token ${token}`,
        "cf-turnstile-response": cloudflareCaptchaToken,
        "hc-turnstile-response": hCaptchaToken,
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
