import {app, BrowserWindow, net, protocol} from 'electron'
import path from 'node:path'
import {Deeplink} from "electron-deeplink";
import {handleDeepLink} from "./utils/deeplink.ts";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
let deeplinkingUrl: string | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']


if (!app.isDefaultProtocolClient('itsl-itslearning')) {
    // Define custom protocol handler. Deep linking works on packaged versions of the application!
    app.setAsDefaultProtocolClient('itsl-itslearning')
}

async function createWindow() {
    win = new BrowserWindow({
        icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        },
        width: 1280,
        height: 720,
    })

    const deeplink = new Deeplink({
        app,
        mainWindow: win,
        protocol: 'itsl-itslearning',
        isDev: VITE_DEV_SERVER_URL !== undefined,
        debugLogging: true,
    });

    deeplink.on('received', (link) => {
        handleDeepLink(win, link, [], logEverywhere)
    })

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
        await win.loadURL(VITE_DEV_SERVER_URL)
    } else {
        // win.loadFile('dist/index.html')
        await win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
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
        // Someone tried to run a second instance, we should focus our window.

        // Protocol handler for win32
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
        }

        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
} else {
    app.quit()
    win = null
}

app.on('will-finish-launching', function () {
    // Protocol handler for osx
    app.on('open-url', function (event, url) {
        event.preventDefault()
        deeplinkingUrl = url
        logEverywhere('open-url# ' + deeplinkingUrl)
    })
})

app.whenReady().then(async () => {
    if (VITE_DEV_SERVER_URL) {
        const express = await import('express').then(m => m.default)
        const cors = await import('cors').then(m => m.default)
        const axios = await import('axios').then(m => m.default)
        const bodyParser = await import('body-parser').then(m => m.default)
        const proxy = express()
        proxy.use(bodyParser.urlencoded({ extended: true }));
        proxy.use(cors())
        proxy.use(express.json())
        proxy.all('*', async (req, res) => {
            const url = req.url.replace('/api', '')
            // const headers = req.headers
            const method = req.method
            const body = req.body
            const {data} = await axios.request({
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                url: `https://sdu.itslearning.com${url}`,
                data: body,
                method: method
            }).then(res => {
                // console.log(res.data)
                return res
            }).catch(err => {
                // console.log(err)
                return err
            })

            res.json(data)
        }).listen(8080, () => {
            console.log('API Proxy Server with CORS enabled is listening on port 8080')
        })
    }
    protocol.handle('itsl-itslearning', (req) => {
        return net.fetch(req.url.replace('itsl-itslearning://', 'https://')
            .replace('login/?state=damn&code=', 'login?state=damn&code='))
    })
    await createWindow()
})

function logEverywhere(s: string) {
    console.log(s)
    if (win && win.webContents) {
        win.webContents.executeJavaScript(`console.log("${s}")`)
    }
}