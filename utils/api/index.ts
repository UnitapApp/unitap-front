export * from "./auth";
export * from "./gas-tap";
export * from "./landing";
export * from "./token-tap";
export * from "./prize-tap";

export const serverFetch = async (url: string) => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL! + url, {
    cache: "no-store",
  });

  return await res.json();
};
