import { Metadata } from "next";
import "./styles.scss";

import { FC } from "react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Unitap | About us",
  description:
    "Unitap is an onboarding tool for networks and communities and a gateway to web3",
};

const About = () => {
  return (
    <div className={"m-auto flex w-full flex-col items-center justify-center"}>
      <section
        className={
          "uni-card flex h-44 w-full flex-col items-center justify-center gap-4 overflow-hidden text-center text-white after:rounded-2xl after:bg-what-is-unitap-header sm:px-12 sm:text-left"
        }
      >
        <img
          src={"/assets/images/about/header-unitap-logo.svg"}
          className={"mx-auto w-48"}
          alt={"logo"}
        />
        <h4 className={"text-gradient-primary text-xl"}>
          Incentive layer for web3
        </h4>
      </section>
      {/* to do: after merge should fix the .card class styles */}

      <div className="about-content uni-card mt-8 pb-8 pl-4 pr-8 pt-12 md:px-8 lg:px-12">
        <p className="text-gradient-primary mb-6 text-center text-2xl font-semibold">
          Why is everyone reinventing the wheel over and over again?
        </p>
        <p className="about-section__text">
          <span className="text-gradient-primary">Incentivizing tools</span> are
          essential for onboarding and building community in web3.
        </p>
        <p className="about-section__text text-lg">
          <span className="text-gradient-primary">
            There are no shortcuts [yet!]
          </span>{" "}
          , so everyone is thinking, designing, and building these tools from
          scratch, consuming valuable time and resources and leading to
          trial-and-error mistakes.
        </p>
        <p className="text-gradient-primary mb-6 mt-16 text-center text-2xl font-semibold">
          Production-Ready Campaigns Using Unitap
        </p>

        <p className="about-section__text text-lg">
          Unitap is an incentive layer that enables projects to launch their
          campaign in a few minutes.
        </p>

        <p className="text-gradient-primary my-6 mt-16 text-center text-2xl font-semibold">
          Partners and supporters:
        </p>

        <div className="mb-6 flex flex-wrap items-center justify-center gap-6">
          <SponsorItem
            image="/assets/images/provider-dashboard/op.svg"
            title="Optimism"
          />
          <SponsorItem image="/assets/images/linea.svg" title="Linea" />
          <SponsorItem image="/assets/images/polygon.svg" title="Polygon" />
          <SponsorItem image="/assets/images/arb.svg" title="Arbitrum" />
          <SponsorItem image="/assets/images/ens.svg" title="ENS" />
          <SponsorItem title="Gitcoin" image="/assets/images/gitcoin.svg" />
          <SponsorItem title="WhalerDAO" image="/assets/images/whalerDAO.svg" />
        </div>

        <p className="text-gradient-primary mb-6 mt-20 text-center text-2xl font-semibold">
          Team members:
        </p>

        <div className="mt-20 flex items-center justify-center gap-10">
          <TeamMembers
            image="/assets/images/member1.jpg"
            title="Adam Stallard"
            position="CTO"
            twitterId="adamstallard"
          />
          <TeamMembers
            image="/assets/images/member3.png"
            title="Ali Lari"
            position="CEO"
            twitterId="alariarch"
          />
          <TeamMembers
            image="/assets/images/member2.jpg"
            title="Philip Silva"
            position="CPO"
            twitterId="UBIpromoter"
          />
          <TeamMembers
            image="/assets/images/member4.png"
            title="Cotabe"
            position="CMO"
          />
        </div>

        {/* <div className="about-section">
          <div className="about-section__heading">
            <Icon
              className="about-section__heading__icon"
              iconSrc="assets/images/about/gas-tap-icon.svg"
              width="24px"
              height="auto"
            />
            <p className="about-section__heading__title">Gas Tap</p>
          </div>
          <p className="about-section__text">
            Gas Tap is a place where users can receive small amounts of gas
            tokens from numerous networks in order to get a new address started.
            Gas Tap already supports loads of EVM networks and will soon be
            adding support for Bitcoin Lightning, Solana, and others.
          </p>
        </div> */}
        {/*
        <div className="about-section">
          <div className="about-section__heading">
            <Icon
              className="about-section__heading__icon"
              iconSrc="assets/images/about/token-tap-icon.svg"
              width="24px"
              height="auto"
            />
            <p className="about-section__heading__title">Token Tap</p>
          </div>
          <p className="about-section__text">
            Token Tap can facilitate the distribution of any kind of token,
            including; UBI tokens, NFTs, Community Tokens, Airdrops, etc. It
            uses BrightID to keep the bots out. Uses:
            <br />
            1. Help users interact with DAOs, apps, and services by distributing
            small amounts of the tokens used in those ecosystems.
            <br />
            2. Help projects in the test phase distribute their token to users.
            They can also set some bug bounties to incentivize users.
            <br />
            3. Distribute several UBI tokens in one place.
            <br />
            4. Prioritize real users over airdrop hunters by limiting the number
            of tokens one person can claim.
          </p>
        </div>

        <div className="about-section">
          <div className="about-section__heading">
            <Icon
              className="about-section__heading__icon"
              iconSrc="assets/images/about/learn-tap-icon.svg"
              width="24px"
              height="auto"
            />
            <p className="about-section__heading__title">Learn Tap</p>
          </div>
          <p className="about-section__text">
            Beginning users cannot effectively onboard to web3 via the current
            learn-to-earn platforms because they don’t teach users how to take
            the very first steps. We believe that almost all of the current
            learn-to-earn platforms’ users are already onboarded to web3 and
            largely complete tasks to be eligible for airdrops.
          </p>

          <p className="about-section__text">
            Learn Tap can utilize Gas tap and Token Tap to help onboard new
            users to Web3 all in one place with absolutely no cost to the user.
          </p>

          <p className="about-section__text">
            Users learn how to set up a wallet first, then how to add a network,
            and then they can claim their first gas tokens from the Gas Tap.
            After that, users can claim tokens from Token Tap to learn how to
            work with Web3 projects like swapping, providing liquidity, staking,
            voting, etc. In many cases, a brand new human user can go from zero
            to being an on-chain crypto user all in one place with no cost to
            the user.
          </p>
        </div>

        <div className="about-section" id="prize-tap">
          <div className="about-section__heading">
            <Icon
              className="about-section__heading__icon"
              iconSrc="assets/images/about/launch-tap-icon.svg"
              width="24px"
              height="auto"
            />
            <p className="about-section__heading__title">Launch Tap</p>
          </div>
          <p className="about-section__text">
            Token and NFT launchpads can be sybil attacked. KYC platforms keep
            out legitimate users and fail to keep out attackers. Unitap will
            offer a public goods launchpad called Launch Tap. In Launch Tap,
            creators have the option to gate the sale with BrightID. Also,
            instead of paying a large fee to launch pad platforms, in Launch
            Tap, every unique human will benefit from each launch through Prize
            Tap.
          </p>
        </div>

        <div className="about-section">
          <div className="about-section__heading">
            <Icon
              className="about-section__heading__icon"
              iconSrc="assets/images/about/prize-tap-icon.svg"
              width="24px"
              height="auto"
            />
            <p className="about-section__heading__title">Prize Tap</p>
          </div>
          <p className="about-section__text">
            Unitap offers the ability for users to access raffles for valuable
            items. Instead of each user receiving a tiny amount of a token, they
            can instead join a raffle where, if selected, they could win a much
            larger prize. A main source of prizes will be Launch Tap: 1% of each
            launch will be distributed to verified unique humans via Prize Tap.
            This will provide buzz around the launch and give Unitap users a
            reason to keep coming back.
          </p>
        </div>

        <div className="about-section">
          <div className="about-section__heading">
            <Icon
              className="about-section__heading__icon"
              iconSrc="assets/images/about/stake-tap-icon.svg"
              width="24px"
              height="auto"
            />
            <p className="about-section__heading__title">Stake Tap</p>
          </div>
          <p className="about-section__text">
            Proof-of-Stake blockchains use staking as the security mechanism to
            keep nodes honest. Users can earn rewards by staking their native
            tokens.
            <br />
            Stake Tap is a public good staking platform where users can earn
            rewards by staking their assets. If the token staked is a gas token,
            we will send the fees to the Gas Tap contracts to help ensure that
            the gas taps stay full.{" "}
          </p>
        </div> */}
      </div>
    </div>
  );
};

const TeamMembers: FC<{
  image: string;
  title: string;
  position?: string;
  twitterId?: string;
}> = ({ image, title, position, twitterId }) => {
  return (
    <div className="mx-2">
      <div className="h-28 w-28 overflow-hidden rounded-full bg-g-primary p-1">
        <div
          className="grid h-full w-full place-items-center overflow-hidden rounded-full bg-gray40 bg-cover"
          style={{ backgroundImage: `url('${image}')` }}
        >
          {/* <Image
            className="mx-auto h-24 w-24"
            width={100}
            height={100}
            src={image}
            alt={title}
          /> */}
        </div>
      </div>
      <p className="mx-auto mt-3 text-center text-gray100">{title}</p>

      <p className="mx-auto mt-1 text-center text-xs text-gray90">{position}</p>

      <p className="mx-auto mt-1 text-center text-xs text-gray90">
        @{twitterId}
      </p>
    </div>
  );
};

const SponsorItem: FC<{
  image: string;
  title: string;
}> = ({ image, title }) => {
  return (
    <div className="p-3">
      <Image
        className="mx-auto h-20 w-20"
        width={80}
        height={80}
        src={image}
        alt={title}
      />
      <p className="sponsor-item__title mx-auto mt-3 text-center">{title}</p>
    </div>
  );
};

export default About;
