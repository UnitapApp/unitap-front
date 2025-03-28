import { HeaderSelection } from "@/components/HeaderSelection";
import Footer from "@/components/layout/footer";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="m-auto min-h-[calc(100vh_-_130px)] w-full max-w-screen-2xl">
      <HeaderSelection />
      <main className="flex flex-col px-4 py-14 sm:px-6 lg:px-8 xl:px-40 xl1440:px-60">
        {children}
      </main>
      <Footer />
    </div>
  );
}
