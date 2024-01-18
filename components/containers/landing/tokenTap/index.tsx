import { numberWithCommas } from "@/utils";
import { getTokensListAPI } from "@/utils/api/tokentap";
import RoutePath from "@/utils/routes";
import Link from "next/link";
import Widget from "../widget";
import { serverFetch } from "@/utils/api";
import { Token } from "@/types";

const TokenTapLanding = async () => {
  const tokensList: Token[] = await serverFetch(
    "/api/tokentap/token-distribution-list/"
  );

  return (
    <section className={"flex--1"}>
      <Link className={"flex--1"} href={RoutePath.TOKEN}>
        <Widget
          id="tokentap"
          description={
            "Where everyone can claim any kind of tokens such as community tokens, NFTs, UBI tokens"
          }
          icon={"tokentap-icon.svg"}
          iconSize={"w-8"}
          className={
            "h-full after:bg-tokentap-texture relative z-20 hover:bg-gray00 cursor-pointer flex-1 "
          }
          title={"Token Tap"}
          buttonTitle={"Beta"}
          buttonClass={"green-text-button text-gray100"}
        >
          <div className="mt-8">
            {tokensList.length > 0 &&
              tokensList.slice(0, 3).map((token, key) => (
                <div
                  key={key}
                  className={
                    "flex text-xs text-white bg-gray30 rounded-xl py-3 px-3 items-center mb-2"
                  }
                >
                  <span className="token-logo-container w-6 h-6">
                    <img
                      width={24}
                      height={24}
                      src={token.imageUrl}
                      alt={token.name}
                      className="token-logo w-auto h-[100%]"
                    />
                  </span>
                  <p className="text-xs ml-4">{token.name}</p>
                  <p className="ml-auto">
                    {numberWithCommas(token.numberOfClaims)} <span>claims</span>
                  </p>
                </div>
              ))}
          </div>
        </Widget>
      </Link>
    </section>
  );
};

export default TokenTapLanding;
