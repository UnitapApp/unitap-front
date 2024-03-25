const validateEmail = (email: string) => {
  return !!email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const checkTwitterVAlidation = (username: string) => {
  return !!username.match(/^[A-Za-z0-9_]{1,15}$/);
};

const checkDiscordValidation = (username: string) => {
  const usernameRegex = /https:\/\/discord\.com/;
  return !!username.match(usernameRegex);
};

const checkTelegramValidation = (username: string) => {
  const usernameRegex = /^[a-zA-Z0-9_]{5,32}$/;
  return !!username.match(usernameRegex);
};

const checkUrlValidation = (urlString: string) => {
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
      "(\\?[;&a-z\\d%_.~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!urlPattern.test(urlString);
};

export const checkSocialMediaValidation = (
  creatorUrl: string | null,
  twitter: string | null,
  discord: string | null,
  email: string | null,
  telegram: string | null
) => {
  const isEmailVerified = email ? validateEmail(email) : false;
  const isTwitterVerified = twitter
    ? checkTwitterVAlidation(twitter.replace("@", ""))
    : true;
  const isUrlVerified = creatorUrl ? checkUrlValidation(creatorUrl) : true;
  // const isDiscordVerified = discord
  //   ? checkDiscordValidation(discord.replace("@", ""))
  //   : true;
  const isDiscordVerified = true;
  const isTelegramVerified = telegram
    ? checkTelegramValidation(telegram.replace("@", ""))
    : true;

  return {
    isUrlVerified,
    isTwitterVerified,
    isDiscordVerified,
    isEmailVerified,
    isTelegramVerified,
  };
};
