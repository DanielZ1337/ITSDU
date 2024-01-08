import { BrowserWindow, safeStorage } from "electron";
import { GrantType } from "./types/grant_type"
import { ITSLEARNING_SCOPES_ENUM } from "./types/scopes"
import axios from "axios";
import { store_keys } from "./types/store_keys";
import { ITSLEARNING_URL } from "../itslearning.ts";

const Store = require('electron-store');

// https://sdu.itslearning.com/oauth2/authorize.aspx?client_id=10ae9d30-1853-48ff-81cb-47b58a325685&state=A59QS4pAT9cF3tES/66w254LVt3XqdGH0p5T+I7U34Y=&response_type=code&scope=Calendar%20Children%20CkEditor%20Courses%20Hierarchies%20LearningObjectiveRepository%20LearningObjectivesReports%20LightBulletin%20Messages%20Notifications%20Person%20Planner%20Sso%20Statistics%20StudentPlan%20Supervisor%20TaskListDailyWorkflow%20Tasks%20Workload&redirect_uri=itsl-itslearning://login

export const ITSLEARNING_CLIENT_ID = '10ae9d30-1853-48ff-81cb-47b58a325685'
export const ITSLEARNING_REDIRECT_URI = 'itsl-itslearning://login'
const ITSLEARNING_SCOPES = Object.keys(ITSLEARNING_SCOPES_ENUM).map((key) => ITSLEARNING_SCOPES_ENUM[key as keyof typeof ITSLEARNING_SCOPES_ENUM])
const ITSLEARNING_OAUTH_URL = `${ITSLEARNING_URL}/oauth2/authorize.aspx`
export const ITSLEARNING_OAUTH_TOKEN_URL = `${ITSLEARNING_URL}/restapi/oauth2/token`
export const getItslearningOAuthUrl = () => {
    const url = new URL(ITSLEARNING_OAUTH_URL)
    url.searchParams.append('client_id', ITSLEARNING_CLIENT_ID)

    const STATE = import.meta.env.VITE_ITSLEARNING_OAUTH_STATE
    if (!STATE) throw new Error('Missing VITE_ITSLEARNING_OAUTH_STATE in .env file')

    url.searchParams.append('state', STATE)
    url.searchParams.append('response_type', 'code')
    url.searchParams.append('scope', ITSLEARNING_SCOPES.join(' '))
    url.searchParams.append('redirect_uri', ITSLEARNING_REDIRECT_URI)
    return url.toString()
}

export const REFRESH_ACCESS_TOKEN_INTERVAL = 1000 * 60 * 45 // 45 minutes

let instance: AuthService | null = null

export class AuthService {
    private store: typeof Store

    constructor() {
        if (instance) {
            throw new Error("New instance cannot be created!!");
        }

        const { VITE_ITSLEARNING_STORE_KEY } = import.meta.env

        if (!VITE_ITSLEARNING_STORE_KEY) throw new Error('Missing VITE_ITSLEARNING_STORE_KEY in .env file')

        if (!require("electron").app.isPackaged) {
            this.store = new Store({
                name: 'itsdu-auth-store-dev',
                watch: true,
                encryptionKey: VITE_ITSLEARNING_STORE_KEY,
            })

            instance = this

            return
        }

        try {
            this.store = new Store({
                name: 'itsdu-auth-store',
                watch: true,
                encryptionKey: VITE_ITSLEARNING_STORE_KEY,
            })

        } catch (error) {
            console.error(error)
            const appPath = require('electron').app.getPath("userData")
            const authStorePath = `${appPath}\\itsdu-auth-store.json`
            console.error(`Could not create auth store at ${authStorePath}`)
            console.error(`Make sure you have the correct ENV variables set in your .env file`)
            // delete the auth store file on the local machine
            const fs = require('fs')
            fs.unlinkSync(authStorePath)

            // create a new store again
            try {
                this.store = new Store({
                    name: 'itsdu-auth-store',
                    watch: true,
                    encryptionKey: VITE_ITSLEARNING_STORE_KEY,
                })
            } catch (error) {
                console.error(error)
                require('electron').app.exit(1)
            }

        }

        instance = this
    }

    public static getInstance(): AuthService {
        if (!instance) {
            instance = new AuthService();
        }
        return instance;
    }

    public getTokens() {
        console.error('getTokens is deprecated, use getStore instead')
        return this.store.store
    }

    public clearTokens() {
        this.store.clear()
    }

    public setToken(key: store_keys, token: string) {
        const buffer = safeStorage.encryptString(token);
        this.store.set(key, buffer.toString('latin1'));
    }

    public deleteToken(key: store_keys) {
        this.store.delete(key);
    }

    public getToken(key: store_keys): string | null {
        try {
            const token = safeStorage.decryptString(Buffer.from(this.store.get(key), 'latin1'));
            return token
        } catch (error) {
            console.error(error)
            return null
        }
    }

    /**
     * Will throw an error if no refresh token is found or if the refresh token is invalid
     */
    public async refreshAccessToken() {
        const current_refresh_token = this.getToken('refresh_token')

        if (!current_refresh_token) throw new Error('No refresh token')

        const { data } = await axios.post(ITSLEARNING_OAUTH_TOKEN_URL, {
            "grant_type": GrantType.REFRESH_TOKEN,
            "refresh_token": current_refresh_token,
            "client_id": ITSLEARNING_CLIENT_ID,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })

        const { access_token, refresh_token } = data
        if (!access_token || !refresh_token) throw new Error('Invalid refresh token')
        this.setToken('access_token', access_token)
        this.setToken('refresh_token', refresh_token)
    }

    public getAuthCodeFromURI(URI: string) {
        try {
            const url = new URL(URI);
            const params = new URLSearchParams(url.search);
            const code = params.get("code");
            const state = params.get("state");
            if (state === import.meta.env.VITE_ITSLEARNING_OAUTH_STATE && code) {
                return code;
            }
        } catch (error) {
            console.error(error);
        }
        return null;
    }

    public async loadSigninPage(win?: BrowserWindow | null) {
        await win?.loadURL(getItslearningOAuthUrl())
        await win?.webContents.executeJavaScript(`__doPostBack('ctl00$ContentPlaceHolder1$federatedLoginButtons$ctl00$ctl00','')`)
        setTimeout(async () => {
            await win?.webContents.executeJavaScript(`document.getElementsByClassName('table')[0].click()`)
        }, 1000)
    }
}

/*
https://sdu.itslearning.com/restapi/oauth2/token', {
                "grant_type": "authorization_code",
                "code": deeplinkingUrl,
                "client_id": ITSLEARNING_CLIENT_ID,
 */
