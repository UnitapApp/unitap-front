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
  { ssr: false },
);

export default async function Home() {
  const chains = await getFaucetListServer();

  return (
    <div className="flex flex-col gap-6">
      <section
        id="home-header"
        className={
          "uni-card flex h-40 flex-col justify-center gap-4 overflow-hidden text-center text-white after:rounded-2xl after:bg-home-header-texture sm:px-12 sm:text-left"
        }
      >
        <Image
          src={"/assets/images/landing/uni-logo.svg"}
          className={"mx-auto w-40 sm:mx-0"}
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
          "flex min-h-[360px] flex-grow flex-col justify-between gap-4 lg:flex-row"
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
    alt: "twitter",
  },
  {
    img: "github-icon.svg",
    localClass: "hover:bg-blue-200",
    link: "https://github.com/UnitapApp",
    alt: "github",
  },
  {
    img: "discord-icon.svg",
    localClass: "hover:bg-purple-200",
    link: "https://discord.gg/unitap",
    alt: "discord",
  },
];

const Footer = () => {
  return (
    <section id="home-footer" className={"flex flex-col gap-4 md:flex-row"}>
      <Link
        href={"/contribution-hub"}
        className={
          "uni-card h-36 cursor-pointer after:inset-auto after:bg-donate-texture hover:bg-gray00 hover:after:top-3 md:w-1/3 " +
          "flex items-center justify-center after:right-0 after:top-0 after:h-36 after:w-28"
        }
      >
        <h2 className={"card-text text-white"}>Contribution Hub</h2>
      </Link>
      <div
        className={
          "uni-card flex flex-col gap-4 after:inset-auto sm:flex-row sm:gap-0 md:h-36 md:w-2/3"
        }
      >
        {socialLinks.map((social) => (
          <Link
            href={social.link}
            target="_blank"
            aria-label={social.alt}
            key={social.link}
            className={`${social.localClass} home-footer-social-link flex cursor-pointer items-center justify-center border-b-3 border-gray40 px-8 py-6 transition duration-300 ease-in-out sm:py-0 md:border-b-0 md:border-r-3`}
          >
            <img
              alt={social.alt}
              className={social.localClass}
              src={`/assets/images/landing/${social.img}`}
            />
          </Link>
        ))}

        <Link
          href={RoutePath.ABOUT}
          className={
            "uni-card cursor-pointer after:!right-0 after:left-auto after:h-36 after:w-44 after:bg-what-is-unitap hover:bg-gray00 hover:after:top-4" +
            " flex flex-grow items-center justify-center rounded-bl-none rounded-tl-none py-6 text-white sm:py-0"
          }
        >
          <h2 className={"card-text"}>What is Unitap ?</h2>
        </Link>
      </div>
    </section>
  );
};
