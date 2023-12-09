import { cookies } from "next/headers";

import PrizeTapContent from "@/components/containers/provider-dashboard/prize-tap/Content";

const Page = () => {
  const cookieStore = cookies();
  return (
    <div>
      <PrizeTapContent />
    </div>
  );
};

export default Page;
