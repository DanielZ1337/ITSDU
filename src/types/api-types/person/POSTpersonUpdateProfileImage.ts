import {apiUrl} from '@/lib/utils.ts';

const POSTpersonUpdateProfileImageApiEndpoint = 'restapi/personal/person/image/v1';

export const POSTpersonUpdateProfileImageApiUrl = () => apiUrl(POSTpersonUpdateProfileImageApiEndpoint);

export type POSTpersonUpdateProfileImageApiBody = FormData;

export type POSTpersonUpdateProfileImageApiResponse = {
    success: boolean;
    message: string;
};