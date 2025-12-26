import { Prize } from "@/types";
import { apiData } from "../api";

export async function getRafflesServerSideListAPI() {
  const response: Prize[] = apiData[
    "/api/prizetap/raffle-list/"
  ] as unknown as Prize[];

  return response.filter(
    (raffle) => raffle.status !== "PENDING" && raffle.status !== "REJECTED",
  );
}
