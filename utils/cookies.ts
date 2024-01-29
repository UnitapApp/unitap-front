export const parseCookies = () => {
  return typeof document === "undefined"
    ? {}
    : document.cookie.split(";").reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split("=");
        cookies[name] = value;
        return cookies;
      }, {} as { [key: string]: string });
};
