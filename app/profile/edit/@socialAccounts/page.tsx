import { cookies } from "next/headers";
import SocialAccount from "../../components/socialAccount";
import { getAllConnections } from "@/utils/serverApis";
import { UserConnection } from "@/types";
import { redirect } from "next/navigation";

const SocialAccounts = async () => {
  const cookiesStore = cookies();

  let connections: UserConnection;

  try {
    connections = await getAllConnections(cookiesStore.get("userToken")?.value);
    console.log(cookiesStore.get("userToken"));
  } catch (e) {
    redirect("/");
  }

  return (
    <div className="mt-5 bg-gray20 rounded-xl p-5">
      <p>Social Accounts </p>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <SocialAccount
          title={"Bright ID"}
          icon={"/assets/images/provider-dashboard/modalIcon/brightId.svg"}
          isConnected={!!connections["BrightID"]}
        />
      </div>
    </div>
  );
};

export default SocialAccounts;
