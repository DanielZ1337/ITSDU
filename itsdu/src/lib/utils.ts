import he from "he";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { Method } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPersonInitials(name?: string) {
  if (!name) return "???";
  const split = name.split(" ");
  let initials = "";

  if (split.length >= 2) {
    initials += split[0].charAt(0); // First name initial

    if (split.length === 2) {
      initials += split[1].charAt(0); // Last name initial
    } else if (split.length >= 3) {
      initials += split[1].charAt(0); // Middle name initial
      initials += split[split.length - 1].charAt(0); // Last name initial
    }
  }

  return initials.slice(0, 3);
}

export const getQueryKeysFromParamsObject = (params: {
  [key: string]: string | number | Date | undefined | boolean | number[];
}) => {
  // eslint-disable-next-line no-unused-vars
  params = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined || value !== null || value !== ""
    )
  );

  if (Object.keys(params).length === 0) return [];

  // turn all date objects into queryKeys with the date in ISO format with only Days, Months and Years

  return Object.keys(params).map((key) => {
    if (params[key] instanceof Date) {
      return (params[key] as Date).toISOString().split("T")[0];
    } else if (typeof params[key] === "boolean") {
      return params[key] ? "true" : "false";
    } else if (Array.isArray(params[key])) {
      return (params[key]! as []).join(",");
    } else {
      return encodeURIComponent(String(params[key]?.toString()));
    }
  });
};

export function findMetaData(property: string, stringToSearch: string) {
  const regex = new RegExp(
    `<meta(?=.*?content="(.*?)")(?=[^>]*property="${property}").*?>`
  );

  const match = regex.exec(stringToSearch);

  return match ? he.decode(match[1]) : "";
}

export function getFormattedSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

// export const baseUrl = import.meta.env.DEV
// 	? "http://localhost:8080/"
// 	: "https://sdu.itslearning.com/";
export const baseUrl = "http://localhost:9090/";
// export const baseUrl = "https://sdu.itslearning.com/";

export const apiUrl = (
  route: string,
  options?: {
    [key: string]: string | number | Date | undefined | boolean | number[];
  }
) => {
  // replace all path parameters with the values from the options object
  route.match(/{(.*?)}/g)?.forEach((match) => {
    const key = match.replace("{", "").replace("}", "");
    if (options?.[key] !== undefined) {
      route = route.replace(match, options[key]!.toString());
      // delete options[key]
    }
  });

  // remove everything after the first ? in the route
  route = route.split("?")[0];

  const url = new URL(route, baseUrl);

  // add all remaining options as query parameters
  for (const [key, value] of Object.entries(options ?? {})) {
    if (value !== undefined) {
      if (value instanceof Date) {
        url.searchParams.append(key, value.toISOString());
      } else if (typeof value === "boolean") {
        url.searchParams.append(key, value ? "true" : "false");
      } else if (Array.isArray(value)) {
        url.searchParams.append(key, value.join(","));
      } else {
        url.searchParams.append(key, value.toString());
      }
    }
  }

  return url.toString();
};

export function getRelativeTimeString(
  date: Date | number,
  lang = navigator.language
): string {
  // Allow dates or times to be passed
  const timeMs = typeof date === "number" ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  const dayInSeconds = 86400;
  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [
    60,
    dayInSeconds / 24,
    dayInSeconds,
    dayInSeconds * 7,
    dayInSeconds * 30,
    dayInSeconds * 365,
    Infinity,
  ];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "month",
    "year",
  ];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(
    (cutoff) => cutoff > Math.abs(deltaSeconds)
  );

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
}

export async function getAccessToken() {
  return "H06cKRmnvKj_Qe5UU_pXRtiVtvV7VMaLrG43CBMQ5AMjP5Gi59QwUuvQ-g7dBJB0M_2l0BZHBnKQdNj3KtZDg2DjAQGo3egT6-Sai99jlxD1ilfBwse_AByG8U4GxQOP";
}

export function isMacOS() {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

// Create a reusable function for making queries
export function createQueryFunction<Params, Data>(
  // eslint-disable-next-line no-unused-vars
  getApiUrl: (params: Params) => string,
  queryKey: string
) {
  return function useQueryFunction(
    params: Params,
    queryConfig?: UseQueryOptions<Data, Error, Data, string[]>
  ) {
    const queryKeys = [
      queryKey,
      ...(params ? getQueryKeysFromParamsObject(params) : []),
    ];

    return useQuery(
      queryKeys,
      async () => {
        const res = await axios.get(getApiUrl(params), {
          params: {
            access_token: (await getAccessToken()) || "",
            ...params,
          },
        });

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data as Data;
      },
      {
        ...queryConfig,
      }
    );
  };
}

// Create a reusable function for making mutations
export function createMutationFunction<Params, Body, Data>(
  method: Method, // Accept the HTTP method as an argument
  getApiUrl: (params: Params) => string,
  queryKey: string
) {
  return function useMutationFunction(
    params?: Params,
    body?: Body,
    queryConfig?: UseMutationOptions<Data, Error, Body, string[]>
  ) {
    const queryKeys = [
      queryKey,
      ...(params ? getQueryKeysFromParamsObject(params) : []),
    ];

    return useMutation(
      queryKeys,
      async (paramsOrBody) => {
        const axiosConfig = {
          method, // Use the specified HTTP method
          url: getApiUrl(params ?? ({} as Params)),
          params: {
            access_token: (await getAccessToken()) || "",
            ...params,
          },
          data: body ?? paramsOrBody,
        };

        const res = await axios.request(axiosConfig); // Use axios.request

        if (res.status !== 200) throw new Error(res.statusText);

        return res.data;
      },
      {
        ...queryConfig,
      }
    );
  };
}

export type NumericRange<
  START extends number,
  END extends number,
  ARR extends unknown[] = [],
  ACC extends number = never
> = ARR["length"] extends END
  ? ACC | START | END
  : NumericRange<
      START,
      END,
      [...ARR, 1],
      ARR[START] extends undefined ? ACC : ACC | ARR["length"]
    >;

export type ITSLEARNING_API_MAX_PAGESIZE = NumericRange<0, 100>;
