import { Prize } from "@/types";
import { serverFetch } from "../api";

export async function getRafflesServerSideListAPI() {
  const response: Prize[] = await serverFetch(
    "/api/prizetap/raffle-list/",
  ).then((res) => res.json());

  return response.filter(
    (raffle) => raffle.status !== "PENDING" && raffle.status !== "REJECTED",
  );
}
