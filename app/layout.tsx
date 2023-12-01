import { WagmiConfig } from "wagmi";
import "./globals.scss";
import type { Metadata } from "next";
import { config } from "@/utils/wallet/wagmi";
import { Noto_Sans } from "next/font/google";
import UnitapProvider from "@/context";
import Header from "@/components/layout/header";
import Progressbar from "@/components/progress";
import Footer from "@/components/layout/footer";

import {
  ConnectBrightIdModal,
  BrightConnectionModal,
  CreateBrightIdAccountModal,
} from "@/components/containers/modals";
import StyledJsxRegistry from "@/components/styled-components";
import { ConnectWalletModal } from "@/components/containers/modals/ConnectWalletModal";
import GoogleAnalytics from "@/components/google-analytics";

const notoSansFont = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  adjustFontFallback: false,
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Unitap",
  description: "Bright ID faucet",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className={`dark:bg-gray10 dark:text-white ${notoSansFont}`}>
        <WagmiConfig config={config}>
          <UnitapProvider>
            <StyledJsxRegistry>
              <Header />
              <main className="px-4 sm:px-6 lg:px-8 xl1440:px-60 xl:px-40 py-14 max-w-screen-2xl m-auto flex flex-col w-full min-h-[calc(100vh_-_130px)]">
                {children}
              </main>

              <Footer />

              <ConnectBrightIdModal />
              <BrightConnectionModal />
              <CreateBrightIdAccountModal />
              <ConnectWalletModal />
            </StyledJsxRegistry>
          </UnitapProvider>
        </WagmiConfig>

        <Progressbar />

        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
          <GoogleAnalytics ga_id={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
        ) : null}
      </body>
    </html>
  );
}
