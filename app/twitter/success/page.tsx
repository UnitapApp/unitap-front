"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const TwitterSuccessPage = () => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const authToken = searchParams.get("oauth_token");
    const authVerifier = searchParams.get("oauth_verifier");

    if (!authToken || !authVerifier) return;

    window.opener.postMessage(
      {
        type: "unitap-token-verification",
        data: { authToken, authVerifier },
      },
      "*",
    );

    window.close();
  }, [searchParams]);

  return (
    <div className="text-center">
      <div className="absolute left-0 right-0 top-0 z-20 h-20 bg-gray10"></div>

      <div className="text-xl font-bold">Login with twitter success</div>
      <p className="mt-5 text-gray100">Please wait till the window closes</p>
    </div>
  );
};

export default TwitterSuccessPage;
