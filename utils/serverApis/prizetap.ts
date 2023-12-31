import { Prize } from "@/types";

export async function getRafflesServerSideListAPI() {
  const response: Prize[] = await fetch(
    process.env.NEXT_PUBLIC_API_URL +"/api/prizetap/raffle-list/", {
    cache: "no-store",
  }).then((res) => res.json());

  return response.filter(
    (raffle) => raffle.status !== "PENDING" && raffle.status !== "REJECTED"
  );
}
