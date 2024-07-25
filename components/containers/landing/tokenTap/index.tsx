import { numberWithCommas } from "@/utils";
import RoutePath from "@/utils/routes";
import Link from "next/link";
import Widget from "../widget";
import { serverFetch } from "@/utils/api";
import { Token } from "@/types";

const TokenTapLanding = async () => {
  const tokensList: Token[] = (
    await serverFetch("/api/tokentap/token-distribution-list/")
  ).filter((item: Token) => item.status === "VERIFIED");

  return (
    <section className={"flex--1"}>
      <Link className={"flex--1"} href={RoutePath.TOKEN}>
        <Widget
          id="tokentap"
          description={"Get the tasks done and claim your rewards"}
          icon={"tokentap-icon.svg"}
          iconSize={"w-8"}
          className={
            "relative z-20 h-full flex-1 cursor-pointer after:bg-tokentap-texture hover:bg-gray00 "
          }
          title={"Token Tap"}
          buttonTitle={"Go to Tap"}
          buttonClass={
            "gradient-outline-button before:inset-[2px] text-gray100"
          }
        >
          <div className="flex h-full flex-col justify-end">
            <div className="mt-8">
              {tokensList.length > 0 &&
                tokensList.slice(0, 3).map((token, key) => (
                  <div
                    key={key}
                    className={
                      "mb-2 flex items-center rounded-xl bg-gray30 px-3 py-3 text-xs text-white"
                    }
                  >
                    <span className="token-logo-container h-6 w-6">
                      <img
                        width={24}
                        height={24}
                        src={token.imageUrl}
                        alt={token.name}
                        className="token-logo h-[100%] w-auto"
                      />
                    </span>
                    <p className="ml-4 text-xs">{token.name}</p>
                    <p className="ml-auto">
                      {numberWithCommas(token.numberOfClaims)}{" "}
                      <span>claims</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </Widget>
      </Link>
    </section>
  );
};

export default TokenTapLanding;
