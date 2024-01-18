import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - createdAt.getTime());
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (diff < minute) {
    return "just now";
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diff < month) {
    const days = Math.floor(diff / day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diff < year) {
    const months = Math.floor(diff / month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diff / year);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

export const formatAndDivideNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

export const getMonthAndYear = (date: Date): string => {
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

interface UrlQueryParams {
  params: any;
  key: string;
  value: string | null;
  pathName: string;
}

// complete formUrlQuery using URLSearchParams
export const formUrlQuery = ({
  params,
  key,
  value,
  pathName,
}: UrlQueryParams) => {
  const urlParams = new URLSearchParams(params);
  if (value === null || value === undefined || value === "") {
    urlParams.delete(key);
  } else {
    urlParams.set(key, value);
  }
  return `${pathName}?${urlParams.toString()}`;
};

export const formUrlQuery2 = ({
  params,
  key,
  value,
  path,
}: {
  params: string;
  key: string;
  value: string | null;
  path: string;
}) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: path,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const removeKeysFromQuery = ({
  params,
  keys,
  path,
}: {
  params: string;
  keys: string[];
  path: string;
}) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: path,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
};

export const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
