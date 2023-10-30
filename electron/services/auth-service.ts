import {safeStorage} from "electron";
import {GrantType} from "./grant_type"
import {ITSLEARNING_SCOPES_ENUM} from "./scopes"
import axios from "axios";

const Store = require('electron-store');
// import Store from 'electron-store';

// https://sdu.itslearning.com/oauth2/authorize.aspx?client_id=10ae9d30-1853-48ff-81cb-47b58a325685&state=A59QS4pAT9cF3tES/66w254LVt3XqdGH0p5T+I7U34Y=&response_type=code&scope=Calendar%20Children%20CkEditor%20Courses%20Hierarchies%20LearningObjectiveRepository%20LearningObjectivesReports%20LightBulletin%20Messages%20Notifications%20Person%20Planner%20Sso%20Statistics%20StudentPlan%20Supervisor%20TaskListDailyWorkflow%20Tasks%20Workload&redirect_uri=itsl-itslearning://login

const ITSLEARNING_SUBDOMAIN = 'sdu'
const ITSLEARNING_DOMAIN = 'itslearning.com'
export const ITSLEARNING_URL = `https://${ITSLEARNING_SUBDOMAIN}.${ITSLEARNING_DOMAIN}`
export const ITSLEARNING_CLIENT_ID = '10ae9d30-1853-48ff-81cb-47b58a325685'
export const ITSLEARNING_REDIRECT_URI = 'itsl-itslearning://login'
// export const ITSLEARNING_OAUTH_STATE = 'A59QS4pAT9cF3tES/66w254LVt3XqdGH0p5T+I7U34Y='
export const ITSLEARNING_OAUTH_STATE = 'damn'
const ITSLEARNING_SCOPES = Object.keys(ITSLEARNING_SCOPES_ENUM).map((key) => ITSLEARNING_SCOPES_ENUM[key as keyof typeof ITSLEARNING_SCOPES_ENUM])
const ITSLEARNING_OAUTH_URL = `${ITSLEARNING_URL}/oauth2/authorize.aspx`
export const ITSLEARNING_OAUTH_TOKEN_URL = `${ITSLEARNING_URL}/restapi/oauth2/token`
export const ITSLEARNING_STORE_KEY = 'IebZ85FuqXQHv2Tpyz5QLWaLJ0w3/OLUwufMP6JaIfY='
export const getItslearningOAuthUrl = () => {
    const url = new URL(ITSLEARNING_OAUTH_URL)
    url.searchParams.append('client_id', ITSLEARNING_CLIENT_ID)
    url.searchParams.append('state', ITSLEARNING_OAUTH_STATE)
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('scope', ITSLEARNING_SCOPES.join(' '))
    url.searchParams.append('redirect_uri', ITSLEARNING_REDIRECT_URI)
    return url.toString()
}

export type tokenKeys = 'access_token' | 'refresh_token'

// @ts-ignore - gives a wrong type error. Will disappear when using import instead of require, but will cause errors and 5 recompilings of the main process
export const authStore = new Store<Record<string, string>>({
    name: 'itslearning-auth-store',
    watch: true,
    encryptionKey: ITSLEARNING_STORE_KEY,
})

export function setToken(key: tokenKeys, token: string) {
    const buffer = safeStorage.encryptString(token);
    authStore.set(key, buffer.toString('latin1'));
}

export function deleteToken(key: tokenKeys) {
    authStore.delete(key);
}

export function getToken(key: tokenKeys): string {
    return safeStorage.decryptString(Buffer.from(authStore.get(key), 'latin1'));
}

export async function refreshAccessToken() {
    const current_refresh_token = getToken('refresh_token')

    if (!current_refresh_token) throw new Error('No refresh token')

    const {data} = await axios.post(ITSLEARNING_OAUTH_TOKEN_URL, {
        "grant_type": GrantType.REFRESH_TOKEN,
        "refresh_token": current_refresh_token,
        "client_id": ITSLEARNING_CLIENT_ID,
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    })

    const {access_token, refresh_token} = data
    setToken('access_token', access_token)
    setToken('refresh_token', refresh_token)
}

/*
https://sdu.itslearning.com/restapi/oauth2/token', {
                "grant_type": "authorization_code",
                "code": deeplinkingUrl,
                "client_id": ITSLEARNING_CLIENT_ID,
 */
