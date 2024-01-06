export * from "./auth";
export * from "./gas-tap";
export * from "./landing";
export * from "./token-tap";
export * from "./prize-tap";
export * from "./provider-dashboard";

export const serverFetch = async (url: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + url, {
    cache: "no-store",
  });

  // console.log(await res.clone().text());

  return await res.json();
};
