export const parseServerError = (data: any) => {
  return typeof data === "object" ? Object.values(data)[0] : data.toString();
};
