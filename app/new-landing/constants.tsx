import Image from "next/image";
import { heroBrand } from "./types";
import { Box, chakra } from "@chakra-ui/react";

const valueHeaderConfig = {
  color: "#000",
  width: "full",
  fontFamily: "plusJakartaSans",
  fontWeight: "200",
  fontSize: { base: "24px", md: "20px", lg: "30px", xl: "40px" },
  lineHeight: { base: "30px", md: "35px", lg: "45.48px", xl: "50px" },
  "text-transform": "capitalize",
};

export const heroBrands: heroBrand[] = [
  {
    id: 0,
    name: "Arbitrum",
    href: "https://arbitrum.io/",
    src: "/home/brands/ARBITRUM.svg",
  },
  {
    id: 1,
    name: "Optimism ",
    href: "https://www.optimism.io/",
    src: "/home/brands/OPTIMISM.svg",
  },
  {
    id: 2,
    name: "Polygon",
    href: "https://polygon.technology/",
    src: "/home/brands/POLYGON.svg",
  },
  {
    id: 3,
    name: "Metis",
    href: "https://www.metis.io/",
    src: "/home/brands/METIS.svg",
  },
  { id: 4, name: "XDC", href: "https://xdc.org/", src: "/home/brands/XCD.svg" },
  {
    id: 5,
    name: "Celo",
    href: "https://celo.org/",
    src: "/home/brands/CELO.svg",
  },
  {
    id: 6,
    name: "Glo Dollar",
    href: "https://www.glodollar.org/",
    src: "/home/brands/GLO.svg",
  },
  {
    id: 7,
    name: "Gnosis",
    href: "https://www.gnosis.io/",
    src: "/home/brands/GNOSIS.svg",
  },
  {
    id: 8,
    name: "Linea",
    href: "https://linea.build/",
    src: "/home/brands/LINEA.svg",
  },
  {
    id: 9,
    name: "ENS",
    href: "https://ens.domains/",
    src: "/home/brands/ens.svg",
  },
  {
    id: 10,
    name: "Sonic",
    href: "https://blog.sonic.game/",
    src: "/home/brands/sonic.svg",
  },
  {
    id: 11,
    name: "Questbook",
    href: "https://www.questbook.xyz/",
    src: "/home/brands/questbook.svg",
  },
  {
    id: 12,
    name: "Giveth",
    href: "https://giveth.io/",
    src: "/home/brands/giveth.svg",
  },
  {
    id: 13,
    name: "Gitcoin",
    href: "https://www.gitcoin.co/",
    src: "/home/brands/gitcoin.svg",
  },
  {
    id: 14,
    name: "Octant",
    href: "https://octant.app/",
    src: "/home/brands/octant.svg",
  },
  {
    id: 15,
    name: "Pairwise",
    href: "https://x.com/pairwisevote",
    src: "/home/brands/pairwise.svg",
  },
  {
    id: 16,
    name: "BrightID",
    href: "https://www.brightid.org/",
    src: "/home/brands/bright id.svg",
  },
  {
    id: 17,
    name: "Thrive",
    href: "https://www.thriveprotocol.com/",
    src: "/home/brands/thrive.svg",
  },
];

export const values = [
  {
    id: 0,
    arrow: (
      <Box
        left={{ base: "", md: "-50px" }}
        position={{ base: "relative", md: "absolute" }}
        bottom={{ md: "-186px" }}
        boxSize={{ base: "87px", md: "186px" }}
      >
        <Image
          priority={false}
          fill
          src="/home/values/value-arrow-1.svg"
          alt="arrow"
        />
      </Box>
    ),
    title: (
      <chakra.span
        {...valueHeaderConfig}
        textAlign={{ base: "center", md: "initial" }}
        display="inline-block"
      >
        <chakra.span display={{ md: "block" }}>
          Track <chakra.span fontWeight="800"> on-chain,</chakra.span>
        </chakra.span>{" "}
        <chakra.span display={{ md: "block" }}>
          {" "}
          <chakra.span fontWeight="800"> off-chain, </chakra.span>or{" "}
        </chakra.span>
        <chakra.span fontWeight="800">social media</chakra.span> activities.
      </chakra.span>
    ),
    description:
      "From on-chain transactions and staking to referrals and social activities, track your user’s actions to identify and reward your most loyal customers.",
    img: {
      src: {
        base: "/home/values/value-1-mini.png",
        md: "/home/values/value-1.png",
      },
      // maxW: { base: "453px", lg: "653px" },
      // maxH: { base: "419px", lg: "619px" },
      ratio: { base: 333 / 324, md: 653 / 619 },
      mx: "auto",
    },
  },
  {
    id: 1,
    reverse: true,
    title: (
      <chakra.span
        {...valueHeaderConfig}
        textAlign={{ base: "center", md: "initial" }}
        display="inline-block"
      >
        <chakra.span display="block">
          {" "}
          Build <chakra.span fontWeight="800">Campaigns </chakra.span>with
        </chakra.span>

        <chakra.span>
          <chakra.span display="block" fontWeight="800">
            {" "}
            Points, badges,
          </chakra.span>{" "}
          and <chakra.span fontWeight="800">leaderboards</chakra.span>
        </chakra.span>
      </chakra.span>
    ),
    description:
      "Unitap’s business intelligence (BI) enables you to craft highly effective campaigns for your project, and our AI assistant then helps you refine and personalize them for the best results.",
    img: {
      src: {
        base: "/home/values/value-2-mini.png",
        md: "/home/values/value-2.png",
      },
      // maxW: { base: "428px", lg: "628px" },
      // maxH: { base: "300px", lg: "400px" },
      ratio: { base: 314 / 226, md: 628 / 400 },
    },
  },
  {
    arrow: (
      <Box
        position={{ base: "relative", md: "absolute" }}
        bottom={{ md: "-132px" }}
        left={{ md: "60px" }}
        right={{ base: "0px", md: "initial" }}
        mt="0px"
        width={{ md: "full" }}
        ml={{ base: "auto", md: "initial" }}
        mr={{ base: "calc(50% - 100px)", md: "initial" }}
        boxSize={{ base: "84px", md: "132px" }}
      >
        <Image fill src="/home/values/value-arrow-2.svg" alt="arrow" />
      </Box>
    ),
    id: 2,
    title: (
      <chakra.span
        {...valueHeaderConfig}
        textAlign={{ base: "center", md: "initial" }}
        display="inline-block"
      >
        <chakra.span display={{ base: "inline", md: "block" }}>
          <chakra.span fontWeight="800">Engage</chakra.span> users{" "}
        </chakra.span>
        <chakra.span display={{ base: "inline", md: "block" }}>
          through<chakra.span fontWeight="800"> incentive tools</chakra.span>
        </chakra.span>
        <chakra.span display={{ base: "inline", md: "block" }}>
          {" "}
          like raffles and jackpots{" "}
        </chakra.span>
      </chakra.span>
    ),
    description:
      "Take advantage of our extensive suite of tools to create a truly engaging campaign. then, when you need even more flexibility, build your own custom solutions on top of Unitap.",
    img: {
      src: {
        base: "/home/values/value-3-mini.png",
        md: "/home/values/value-3.png",
      },
      mb: { base: "20px", md: "initial" },
      // maxW: { base: "472px", lg: "672px" },
      // maxH: { base: "418px", lg: "618px" },
      ratio: { base: 336 / 323, md: 672 / 618 },
    },
  },
  {
    id: 3,
    reverse: true,
    title: (
      <chakra.span
        {...valueHeaderConfig}
        textAlign={{ base: "center", md: "initial" }}
      >
        <chakra.span display="block">
          <chakra.span fontWeight="800">Analyze </chakra.span>
          {" results to "}
          <chakra.span fontWeight="800">refine </chakra.span> future
        </chakra.span>
        <chakra.span display="block">
          campaigns and drive more{" "}
          <chakra.span fontWeight="800">retention</chakra.span>.
        </chakra.span>
      </chakra.span>
    ),
    description:
      "Monitor real-time performance metrics from your marketing campaign. Then, harness those insights to refine your tactics, engage your audience more effectively, and continuously optimize your overall marketing strategy for better results.",
    img: {
      src: {
        base: "/home/values/value-4-mini.png",
        md: "/home/values/value-4.png",
      },
      // maxW: { base: "478px", lg: "678px" },
      // maxH: { base: "366px", lg: "466px" },
      ratio: { base: 339 / 259, md: 678 / 466 },
    },
  },
];

export const featuresData = [
  {
    id: 0,
    img: "/home/features/cross-chain.png",
    title: "Cross Chain",
    description:
      "Built on top of EigenLayer, Unitap is chain-independent, allowing easy expansion across all EVM and Non-EVM ecosystems",
  },
  {
    id: 1,
    img: "/home/features/brain.png",
    title: "Flexible",
    description: "Create branded loyalty programs tailored to your community.",
  },
  {
    id: 2,
    img: "/home/features/plug-play.png",
    title: "Plug and Play",
    description:
      "Deploy your campaign in minutes and enjoy plenty of production-ready tools",
  },
  {
    id: 3,
    img: "/home/features/decentralized.png",
    title: "Decentralized",
    description:
      "EigenLayer enables Unitap to operate in a decentralized, transparent and trustless manner",
  },
];
