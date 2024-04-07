export const deadline = (endTimeStamp: number) =>
  new Date(endTimeStamp * 1000).getFullYear() +
  "-" +
  (Number(new Date(endTimeStamp * 1000).getMonth()) + 1) +
  "-" +
  new Date(endTimeStamp * 1000).getUTCDate() +
  " " +
  new Date(endTimeStamp * 1000).getUTCHours() +
  ":" +
  new Date(endTimeStamp * 1000).getUTCMinutes();

export const startAt = (startTimeStamp: number) =>
  new Date(startTimeStamp * 1000).getFullYear() +
  "-" +
  (Number(new Date(startTimeStamp * 1000).getMonth()) + 1) +
  "-" +
  new Date(startTimeStamp * 1000).getUTCDate() +
  " " +
  new Date(startTimeStamp * 1000).getUTCHours() +
  ":" +
  new Date(startTimeStamp * 1000).getUTCMinutes();

export const checkStartTimeStamp = (startTimeStamp: number) => {
  const currentTimestamp = Math.floor(Date.now() / 60000) * 60;
  const instantaneousTimestamp = currentTimestamp + 5 * 60;
  const startTime =
    startTimeStamp < instantaneousTimestamp
      ? instantaneousTimestamp
      : startTimeStamp;
  return startTime;
};
