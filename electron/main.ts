import { app, BrowserWindow, protocol, session } from "electron"
// @ts-ignore
import RegexEscape from "regex-escape"
import path from 'path'
import {
    getItslearningOAuthUrl, ITSLEARNING_CLIENT_ID, ITSLEARNING_OAUTH_STATE,
    ITSLEARNING_OAUTH_TOKEN_URL, ITSLEARNING_REDIRECT_URI,
    ITSLEARNING_URL,
    refreshAccessToken, setToken
} from "./services/auth-service"
import darkModeHandlerInitializer, { themeStore } from "./handlers/dark-mode-handlers.ts";
import appHandlerInitializer from "./handlers/app-handler.ts";
import initAuthIpcHandlers from "./handlers/auth-handler.ts";
import axios from "axios";
import { GrantType } from "./services/grant_type.ts";
import * as fs from "fs";

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
let authWindow: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

darkModeHandlerInitializer()
appHandlerInitializer()
initAuthIpcHandlers()

const startUpTheme = themeStore.get('theme')

protocol.registerSchemesAsPrivileged([{
    scheme: 'itsl-itslearning-file',
    privileges: {
        standard: true,
        secure: true
    }
}]);

// to load the application, setup and stuff
async function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            // devTools: process.env.NODE_ENV === 'development',
        },
        show: false,
        autoHideMenuBar: true,
        width: 1280,
        height: 720,
        alwaysOnTop: false,
        minHeight: 600,
        minWidth: 800,
        darkTheme: startUpTheme === 'dark',
    })


    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        await win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        await win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

async function createAuthWindow() {
    authWindow = new BrowserWindow({
        // icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
        show: false,
        autoHideMenuBar: true,
        resizable: false,
        height: 600,
        width: 800,
        // alwaysOnTop: true,
        darkTheme: startUpTheme === 'dark',
        focusable: true,
    })

    await authWindow.loadURL(getItslearningOAuthUrl())
    await authWindow?.webContents.executeJavaScript(`__doPostBack('ctl00$ContentPlaceHolder1$federatedLoginButtons$ctl00$ctl00','')`)
    setTimeout(async () => {
        await authWindow?.webContents.executeJavaScript(`document.getElementsByClassName('table')[0].click()`)
    }, 1000)
}

if (process.platform === 'win32') {
    app.setAppUserModelId('itslearning')
}

if (!app.isDefaultProtocolClient('itsl-itslearning')) {
    // Define custom protocol handler. Deep linking works on packaged versions of the application!
    app.setAsDefaultProtocolClient('itsl-itslearning')
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
    app.on('second-instance', (_, argv) => {
        console.log('second-instance', argv)
        // Someone tried to run a second instance, we should focus our window.
        if (win) {
            if (win.isMinimized()) {
                win.restore()
                win.focus()
            }
        }

        /*// Protocol handler for win32
        // argv: An array of the second instance’s (command line / deep linked) arguments
        if (process.platform == 'win32') {
            // Keep only command line / deep linked arguments
            const commandArgument = argv.slice(1)
            const regex = /itsl-itslearning:\/\/login\/\?state=damn&code=(.*)/gm;
            const matches = regex.exec(commandArgument.join(' '))
            if (matches) {
                deeplinkingUrl = matches[1]
            }
        }
        if (win) {
            logEverywhere('app.makeSingleInstance# ' + 'setting code to localStorage...')
            logEverywhere('app.makeSingleInstance# ' + 'code ' + deeplinkingUrl)
            win.webContents.executeJavaScript(`window.localStorage.setItem('code', '${deeplinkingUrl}')`)
        }*/
    })
} else {
    app.quit()
    win = null
}

app.on('will-finish-launching', function () {
    // Protocol handler for osx
    app.on('open-url', function (event, url) {
        event.preventDefault()
        /*deeplinkingUrl = url
        logEverywhere('open-url# ' + deeplinkingUrl)*/
    })
})

function logEverywhere(s: string) {
    console.log(s)
    win?.webContents.send('main-process-message', s)
}

function logEverywhereError(s: string) {
    console.error(s)
    win?.webContents.send('main-process-error', s)
}

app.whenReady().then(async () => {
    const ses = session.defaultSession
    if (VITE_DEV_SERVER_URL) {
        const express = await import('express').then(m => m.default)
        const cors = await import('cors').then(m => m.default)
        const bodyParser = await import('body-parser').then(m => m.default)
        const { createProxyMiddleware } = await import('http-proxy-middleware')
        const proxy = express()
        proxy.use(bodyParser.urlencoded({ extended: true }));
        proxy.use(cors())
        // proxy.use(express.json())
        proxy.use('*', createProxyMiddleware({
            target: ITSLEARNING_URL,
            changeOrigin: true,
            secure: false,
            onProxyReq: (proxyReq, req, res) => {
                console.log('Sending Request to the Target:', req.method, req.url);
            }
        }))

        proxy.listen(8080, () => {
            console.log('API Proxy Server with CORS enabled is listening on port 8080')
        })
    }

    ses.protocol.registerBufferProtocol('itsl-itslearning-file', (request, callback) => {
        // get image file path
        const url = request.url.replace('itsl-itslearning-file://', '')
        const filePath = path.join(process.env.VITE_PUBLIC, url)
        // read image file
        fs.readFile(filePath, (error, data) => {
            if (error) {
                console.error(`Failed to read ${filePath} on ${request.url}`)
                console.error(error)
            }
            const extension = path.extname(filePath).toLowerCase()
            let mimeType = ''
            if (extension === '.svg') {
                mimeType = 'image/svg+xml'
            } else if (extension === '.png') {
                mimeType = 'image/png'
            } else if (extension === '.jpg' || extension === '.jpeg') {
                mimeType = 'image/jpeg'
            } else if (extension === '.gif') {
                mimeType = 'image/gif'
            } else if (extension === '.webp') {
                mimeType = 'image/webp'
            }
            callback({ mimeType, data })
        })
    })

    // @ts-ignore
    protocol.handle('itsl-itslearning', async (req) => {
        // const regex = /itsl-itslearning:\/\/login\/\?state=damn&code=(.*)/gm;
        const redirectURI = RegexEscape(`${ITSLEARNING_REDIRECT_URI}/?`)
        const stateCode = RegexEscape(ITSLEARNING_OAUTH_STATE)
        const states = RegexEscape(`state=${stateCode}&code=`)
        const escaped = redirectURI + states + '(.*)'
        const escapedRegex = new RegExp(escaped, 'gm')
        const matches = escapedRegex.exec(req.url)
        if (matches) {
            const deeplinkingUrl = matches[1]
            axios.post(ITSLEARNING_OAUTH_TOKEN_URL, {
                "grant_type": GrantType.AUTHORIZATION_CODE,
                "code": deeplinkingUrl,
                "client_id": ITSLEARNING_CLIENT_ID,
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }).then(res => {
                const { access_token, refresh_token } = res.data
                setToken('access_token', access_token)
                setToken('refresh_token', refresh_token)
                authWindow?.close()
                createWindow().then(() => win?.show())
            }).catch(err => {
                logEverywhereError('protocol.handle# ' + err)
            })
        } else {
            await createAuthWindow()
            authWindow?.show()
        }
    })

    try {
        await refreshAccessToken()
        await createWindow()
        win?.show()
        // setup interval for refreshing access token
        setInterval(async () => {
            await refreshAccessToken()
        }, 1000 * 60 * 45) // 45 minutes
    } catch (e) {
        await createAuthWindow()
        authWindow?.show()
    }
})