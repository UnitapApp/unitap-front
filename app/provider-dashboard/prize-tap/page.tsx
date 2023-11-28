import { cookies } from "next/headers";

import PrizeTapContent from "@/components/containers/provider-dashboard/prize-tap/Content";

const Page = () => {
  const cookieStore = cookies();

  console.log(cookieStore.get("userToken"));
  return (
    <div>
      <PrizeTapContent />
    </div>
  );
};

export default Page;
