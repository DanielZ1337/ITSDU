import {apiUrl} from "@/lib/utils";

const GETnotificationsTopMenuApiEndpoint = 'restapi/topmenu/notifications/v1?FromId={FromId}&PageSize={PageSize}&UseNewerThan={UseNewerThan}&UseOlderThan={UseOlderThan}&UseUnreadOnly={UseUnreadOnly}';

export const GETnotificationsTopMenuApiUrl = (params: GETnotificationsTopMenuApiParams) => apiUrl(GETnotificationsTopMenuApiEndpoint, params);

export type GETnotificationsTopMenuApiParams = {
    FromId?: number;
    PageSize?: number;
    UseNewerThan?: boolean;
    /* UseOlderThan?: string;
    UseUnreadOnly?: boolean; */
};

export type GETnotificationsTopMenu = {
    notificationId: number
    text: string
    notificationUrl: string
    publishedDateTooltip: string
    publishedDate: string
    publishedBy: string
    iconUrl: string
    isRead: boolean
}[]