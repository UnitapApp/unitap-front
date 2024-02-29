import GasTapLanding from "@/components/containers/landing/gasTap";
import LearnTapLanding from "@/components/containers/landing/learnTap";
import PrizeTapLanding from "@/components/containers/landing/prizeTap";
import LandingStats from "@/components/containers/landing/stats";
import TokenTapLanding from "@/components/containers/landing/tokenTap";
import OnBoardProcess from "@/components/containers/onBoardProcess";

import RoutePath from "@/utils/routes";
import { getFaucetListServer } from "@/utils/serverApis";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const UnitapPass = dynamic(
  () => import("@/components/containers/landing/unitapPass"),
  { ssr: false }
);

export default async function Home() {
  const chains = await getFaucetListServer();

  return (
    <div className="flex flex-col gap-6">
      <section
        id="home-header"
        className={
          "uni-card flex flex-col gap-4 after:rounded-2xl after:bg-home-header-texture h-40 text-white justify-center text-center sm:text-left sm:px-12 overflow-hidden"
        }
      >
        <Image
          src={"/assets/images/landing/uni-logo.svg"}
          className={"w-40 mx-auto sm:mx-0"}
          width={157}
          height={32}
          alt={"logo"}
        />
        <h4 className={"text-gradient-primary"}>
          Unitap is an onboarding tool for networks and communities and a
          gateway to web3
        </h4>
      </section>

      <UnitapPass />

      <section
        id="home-taps"
        className={
          "flex lg:flex-row min-h-[360px] flex-grow flex-col gap-4 justify-between"
        }
      >
        <GasTapLanding chains={chains} />
        <TokenTapLanding />
        <PrizeTapLanding />
      </section>
      <LearnTapLanding />

      <LandingStats chains={chains} />

      <Footer />

      <OnBoardProcess />
    </div>
  );
}

const socialLinks = [
  {
    img: "twitter-icon.svg",
    localClass: "hover:bg-light-space-green sm:rounded-l-2xl",
    link: "http://twitter.com/unitap_app",
  },
  {
    img: "github-icon.svg",
    localClass: "hover:bg-blue-200",
    link: "https://github.com/UnitapApp",
  },
  {
    img: "discord-icon.svg",
    localClass: "hover:bg-purple-200",
    link: "https://discord.gg/unitap",
  },
];

const Footer = () => {
  return (
    <section id="home-footer" className={"flex gap-4 md:flex-row flex-col"}>
      <Link
        href={RoutePath.DONATE}
        className={
          "uni-card hover:bg-gray00 hover:after:top-3 cursor-pointer md:w-1/3 h-36 after:bg-donate-texture after:inset-auto " +
          "after:right-0 after:top-0 after:w-28 after:h-36 flex justify-center items-center"
        }
      >
        <h2 className={"text-white card-text"}>Use Contribution Hub</h2>
      </Link>
      <div
        className={
          "md:w-2/3 md:h-36 uni-card after:inset-auto flex sm:flex-row flex-col gap-4 sm:gap-0"
        }
      >
        {socialLinks.map((social) => (
          <Link
            href={social.link}
            target="_blank"
            key={social.link}
            className={`${social.localClass} flex home-footer-social-link justify-center items-center cursor-pointer px-8 border-b-3 md:border-b-0 md:border-r-3 py-6 sm:py-0 border-gray40 transition duration-300 ease-in-out`}
          >
            <img
              className={social.localClass}
              src={`/assets/images/landing/${social.img}`}
            />
          </Link>
        ))}

        <Link
          href={RoutePath.ABOUT}
          className={
            "uni-card hover:bg-gray00 hover:after:top-4 cursor-pointer after:bg-what-is-unitap after:left-auto after:!right-0 after:w-44 after:h-36" +
            " flex flex-grow justify-center items-center text-white py-6 sm:py-0 rounded-tl-none rounded-bl-none"
          }
        >
          <h2 className={"card-text"}>What is Unitap ?</h2>
        </Link>
      </div>
    </section>
  );
};
