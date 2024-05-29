import { getUserRaffleListServerSide } from "@/utils/serverApis";
import { cookies } from "next/headers";
import PrizeTapList from "./components/prizeList";

const PrizeTapPage = async () => {
  const cookieStorage = cookies();

  const raffles = await getUserRaffleListServerSide(
    cookieStorage.get("userToken")?.value,
  );

  return <PrizeTapList initialRaffles={raffles} />;
};

export default PrizeTapPage;
