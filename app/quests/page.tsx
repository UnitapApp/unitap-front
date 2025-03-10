import RoutePath from "@/utils/routes";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CiSearch } from "react-icons/ci";
import { Token } from "@/types";
import { serverFetch } from "@/utils/api";
import { getRafflesServerSideListAPI } from "@/utils/serverApis/prizetap";
import { TaskProvider, useTasks } from "@/context/TaskProvider";
import TasksList from "@/components/containers/tasks/tasks-list";
import { Searchbar } from "../_components/searchbar";
import EnrollModal from "../prizetap/components/Modals/enroll-modal";
import LineaWinnersModal from "../prizetap/components/Linea/LineaWinnersModal";
import LineaCheckWalletsModal from "../prizetap/components/Linea/LineaCheckWalletsModal";
import EnrolledPreEnrollmentWallets from "../prizetap/components/Modals/enrolled-wallets-modal";

export default async function Home() {
  const tokens: Token[] = await serverFetch(
    "/api/tokentap/token-distribution-list/",
  );
  const raffles = await getRafflesServerSideListAPI();

  return (
    <TaskProvider raffles={raffles} tokens={tokens}>
      <HeroSection />
      <Searchbar />
      <LineaCheckWalletsModal />
      <LineaWinnersModal />
      <EnrollModal />
      <EnrolledPreEnrollmentWallets />

      <TasksList />
    </TaskProvider>
  );
}

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const HeroSection = () => {
  return (
    <section className="text-center">
      <Image
        className="mx-auto"
        src="/assets/images/landing/tasks.png"
        alt="unitap-tasks"
        width={147}
        height={62}
      />
      <div
        className={`${plusJakartaSans.className} mt-10 flex flex-col gap-y-5 text-xl font-[200] md:gap-y-16 md:text-[58px]`}
      >
        <p>
          Complete <strong className="font-extrabold">Tasks,</strong>
        </p>
        <p>
          Earn <strong className="font-extrabold">Rewards</strong> And
        </p>
        <p>
          Engage With <strong className="font-extrabold">Communities</strong>
        </p>
      </div>
    </section>
  );
};

const socialLinks = [
  {
    img: "twitter-icon.svg",
    localClass: "hover:bg-light-space-green",
    link: "http://twitter.com/unitap_app",
  },
  {
    img: "github-icon.svg",
    localClass: "hover:bg-blue-200",
    link: "https://github.com/UnitapApp",
  },
  // {
  //   img: "discord-icon.svg",
  //   localClass: "hover:bg-blue-200",
  //   link: "https://discord.gg/unitap",
  // },
];

const Footer = () => {
  return (
    <section id="home-footer" className={"flex flex-col gap-4 md:flex-row"}>
      <Link
        href={"/dashboard"}
        className={
          "uni-card h-36 cursor-pointer after:inset-auto after:bg-donate-texture hover:bg-gray00 hover:after:top-3 md:w-1/3 " +
          "flex items-center justify-center after:right-0 after:top-0 after:h-36 after:w-28"
        }
      >
        <div>
          <h2 className={"card-text text-white"}>Incentive Center</h2>
          <p className="mt-3 text-white">Build your own incentive program</p>
        </div>
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
            key={social.link}
            className={`${social.localClass} home-footer-social-link flex cursor-pointer items-center justify-center border-b-3 border-gray40 px-8 py-6 transition duration-300 ease-in-out sm:py-0 md:border-b-0 md:border-r-3`}
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
            "uni-card cursor-pointer after:!right-0 after:left-auto after:h-36 after:w-44 after:bg-what-is-unitap hover:bg-gray00 hover:after:top-4" +
            " flex flex-grow items-center justify-center rounded-bl-none rounded-tl-none py-6 text-white sm:py-0"
          }
        >
          <h2 className={"card-text"}>What is Unitap?</h2>
        </Link>
      </div>
    </section>
  );
};
