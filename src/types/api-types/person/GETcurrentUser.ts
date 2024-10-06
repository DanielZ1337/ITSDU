//restapi/personal/person/v1

import { apiUrl } from "@/lib/utils.ts";

const GETcurrentUserApiEndpoint = "restapi/personal/person/v1";

export const GETcurrentUserApiUrl = () => apiUrl(GETcurrentUserApiEndpoint);

export type GETcurrentUser = {
  PersonId: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  Language: string;
  ProfileImageUrl: string;
  iCalUrl: string;
  CanAccessMessageSystem: boolean;
  CanAccessCalendar: boolean;
  CanAccessPersonalSettings: boolean;
  CanAccessInstantMessageSystem: boolean;
  TimeZoneId: string;
  Use12TimeFormat: boolean;
  SyncKey: string;
  CanAccessCourse: boolean;
  iCalFavoriteOnlyUrl: string;
  HasHigherEducationLanguage: boolean;
};
