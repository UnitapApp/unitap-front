import { Chain } from "@/types";

export const EmptyCallback = () => {};
export const NullCallback = () => {
  console.warn("[!] Null callback has been called! ignoring");

  return null;
};

export const shortenAddress = (address: string | null | undefined) => {
  if (!address) return "";

  const addressStart = address.substring(0, 6);
  const addressEnd = address.substring(address.length - 4);
  return `${addressStart}...${addressEnd}`;
};

export const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function range(start: number, end: number): number[] {
  var ans = [];
  for (let i = start; i < end; i++) {
    ans.push(i);
  }
  return ans;
}

export function getTxUrl(chain: Chain, txHash: string) {
  let explorerUrl = chain.explorerUrl;
  explorerUrl = explorerUrl.endsWith("/") ? explorerUrl : `${explorerUrl}/`;
  return `${explorerUrl}tx/${txHash}`;
}

export function getAssetUrl(chain: Chain, address: string) {
  let explorerUrl = chain.explorerUrl;
  explorerUrl = explorerUrl.endsWith("/") ? explorerUrl : `${explorerUrl}/`;
  return `${explorerUrl}address/${address}`;
}

export function formatChainId(chainId: string) {
  return BigInt(chainId).toString(16);
}

export * from "./time";
export * from "./errorHandler";
export * from "./numbers";

export const uppercaseFirstLetter = (str: string): string => {
  if (str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return str;
  }
};

export const replacePlaceholders = (
  input: string,
  values: { [key: string]: any },
): string => {
  return input.replace(/\${(.*?)}/g, (match, key) => {
    return values[key.trim()] || match;
  });
};
