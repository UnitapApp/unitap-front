export * from "./auth";
export * from "./gastap";
export * from "./landing";
export * from "./tokentap";
export * from "./prizetap";
export * from "./provider-dashboard";
export * from "./quiztap";
export * from "./social-accounts";

export const serverFetch = async (url: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + url, {
    cache: "no-store",
  });

  // console.log(await res.clone().text());

  return await res.json();
};
