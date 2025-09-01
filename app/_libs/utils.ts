// /home/ryotaro/dev/mnp-dw-20250821/app/_libs/utils.ts 

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export function normalizeError(e: unknown): Error {
  return e instanceof Error ? e : new Error(String(e));
}

export const formatDate = (date: string) => {
  return dayjs.utc(date).tz("America/New_York").format("MM/DD/YYYY");
};
