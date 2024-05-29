import Image from "next/image";
import Link from "next/link";
import Styles from "../../tokentap/components/header.module.scss";

const ContributionPrizetap = () => {
  return (
    <Link
      href="/contribution-hub/prize-tap"
      className={`${Styles["footer-container"]} group relative flex min-h-[11rem] w-full flex-wrap items-center justify-between rounded-3xl bg-gray20 px-10 transition-all duration-300 hover:opacity-90`}
    >
      <div className="flex md:flex-col">
        <div className="flex items-center gap-4 text-2xl text-white transition-all duration-300 group-hover:-mt-5">
          Want to provide a Prize
          <Image
            src="/assets/images/provider-dashboard/ic_link_white.svg"
            width="10"
            height="11"
            alt="link"
          />
        </div>
        <div className="mt-10 text-sm text-[#5A8B9A]">
          If you want to provide something as a prize and set a raffle you can
          use contribution hub.
        </div>
      </div>
      <Image
        className="absolute transition-all duration-300 group-hover:-mb-5 md:static"
        width="278"
        height="152"
        alt="contribute token"
        src="/assets/images/token-tap/token-gas.svg"
      />
    </Link>
  );
};

export default ContributionPrizetap;
