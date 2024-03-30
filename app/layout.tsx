import type { Metadata } from "next";
import { config } from "@/utils/wallet/wagmi";
import { Noto_Sans, Montserrat } from "next/font/google";
import UnitapProvider from "@/context";
import Header from "@/components/layout/header";
import Progressbar from "@/components/progress";
import Footer from "@/components/layout/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  ConnectBrightIdModal,
  BrightConnectionModal,
  CreateBrightIdAccountModal,
} from "@/components/containers/modals";
import StyledJsxRegistry from "@/components/styled-components";
import { ConnectWalletModal } from "@/components/containers/modals/ConnectWalletModal";
import GoogleAnalytics from "@/components/google-analytics";
import { QueryClient } from "@tanstack/react-query";

import "./globals.scss";

import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Providers } from "./providers";

const notoSansFont = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

const montserratFont = Montserrat({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Unitap",
  description: "Bright ID faucet",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en" dir="ltr" className="dark">
      <body
        className={`font-normal dark:bg-[#13131C] dark:text-white ${montserratFont.className}`}
      >
        <Providers initialState={initialState}>
          <UnitapProvider>
            <StyledJsxRegistry>
              <div id="app">
                <Header />
                <main className="m-auto flex min-h-[calc(100vh_-_130px)] w-full max-w-screen-2xl flex-col px-4 py-14 sm:px-6 lg:px-8 xl:px-40 xl1440:px-60">
                  {children}
                </main>

                <Footer />
              </div>

              <ConnectBrightIdModal />
              <BrightConnectionModal />
              <CreateBrightIdAccountModal />
              <ConnectWalletModal />
            </StyledJsxRegistry>
          </UnitapProvider>
        </Providers>

        <Progressbar />

        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}

        <SpeedInsights />
      </body>
    </html>
  );
}
