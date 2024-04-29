"use client";

import { useEffect } from "react";

const TwitterSuccessPage = () => {
  useEffect(() => {
    window.postMessage("salam", "*");
    window.opener.postMessage("Message verified", "*");

    // setTimeout(() => {
    //   window.close();
    // }, 5000);
  }, []);

  return (
    <div className="text-center">
      <div className="absolute left-0 right-0 top-0 z-20 h-20 bg-gray10"></div>

      <div className="text-xl font-bold">Login with twitter success</div>
      <p className="mt-5 text-gray100">Please wait till the window closes</p>
    </div>
  );
};

export default TwitterSuccessPage;
