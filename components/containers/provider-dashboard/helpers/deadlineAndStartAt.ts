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
