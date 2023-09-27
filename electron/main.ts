import {app, BrowserWindow, nativeTheme, net, protocol, session} from 'electron'
import path from 'node:path'
import axios from "axios";
import darkModeHandler from './handlers/dark-mode-handlers'
import * as fs from "fs";

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
darkModeHandler()

// custom handlers
// protocol.registerFileProtocol('itsl-itslearning', (request, callback) => {
//     const url = request.url.replace('itsl-itslearning://', '')
//     try {
//         return callback(decodeURIComponent(url))
//     } catch (error) {
//         console.error(error)
//     }
// })

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
            webviewTag: true,
            nodeIntegration: true,
        },
        show: false,
        autoHideMenuBar: true,
        backgroundColor: '#2e2c29',
        width: 1280,
        height: 720,
    })

    /*const deeplink = new Deeplink({
        app,
        mainWindow: win,
        protocol: 'itsl-itslearning',
        isDev: VITE_DEV_SERVER_URL !== undefined,
        debugLogging: true,
    });

    deeplink.on('received', (link) => {
        console.log('received', link)
        // handleDeepLink(win, link, [], logEverywhere)
    })*/

    // deeplink.on()

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
            if (win.isMinimized()) win.restore()
            win.focus()
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
        deeplinkingUrl = url
        logEverywhere('open-url# ' + deeplinkingUrl)
    })
})

app.whenReady().then(async () => {
    const ses = session.defaultSession
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
            callback({mimeType, data})
        })
    })

    if (VITE_DEV_SERVER_URL) {
        const express = await import('express').then(m => m.default)
        const cors = await import('cors').then(m => m.default)
        const axios = await import('axios').then(m => m.default)
        const bodyParser = await import('body-parser').then(m => m.default)
        const proxy = express()
        proxy.use(bodyParser.urlencoded({extended: true}));
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
    await createWindow()

    if (win) {
        const localStorageTheme = await win.webContents.executeJavaScript(`window.localStorage.getItem('theme')`)
        console.log('localStorageTheme', localStorageTheme)
        if (localStorageTheme) {
            const isDarkMode = localStorageTheme === 'dark'
            nativeTheme.themeSource = isDarkMode ? 'dark' : 'light'
        }
        const itslearningWin = new BrowserWindow({backgroundColor: '#2e2c29', parent: win, modal: true, show: false, autoHideMenuBar:true, resizable:false, height: 600, width: 800, alwaysOnTop:true})
        let code = await win?.webContents.executeJavaScript(`window.localStorage.getItem('code')`)
        let access_token = await win?.webContents.executeJavaScript(`window.localStorage.getItem('access_token')`)

        console.log('code', code)
        console.log('access_token', access_token)
        if (!code || !access_token || code === 'null' || access_token === 'null' || code === 'undefined' || access_token === 'undefined') {
            itslearningWin.show()
            itslearningWin?.loadURL('https://sdu.itslearning.com/oauth2/authorize.aspx?client_id=10ae9d30-1853-48ff-81cb-47b58a325685&state=damn&response_type=code&scope=Calendar%20Children%20CkEditor%20Courses%20Hierarchies%20LearningObjectiveRepository%20LearningObjectivesReports%20LightBulletin%20Messages%20Notifications%20Person%20Planner%20Sso%20Statistics%20StudentPlan%20Supervisor%20TaskListDailyWorkflow%20Tasks%20Workload&redirect_uri=itsl-itslearning://login')
            itslearningWin.webContents.on('did-finish-load', () => {
                itslearningWin?.webContents.send('main-process-message', (new Date).toLocaleString())
            })
        } else {
            win?.webContents.executeJavaScript(`window.localStorage.setItem('code', '${code}')`)
            win?.webContents.executeJavaScript(`window.localStorage.setItem('access_token', '${access_token}')`)
            itslearningWin.close()
            win.show()
        }

        protocol.handle('itsl-itslearning', async (req) => {
            const regex = /itsl-itslearning:\/\/login\/\?state=damn&code=(.*)/gm;
            const matches = regex.exec(req.url)
            if (matches) {
                deeplinkingUrl = matches[1]
                logEverywhere('protocol.handle# setting code to localStorage...')
                logEverywhere('protocol.handle# ' + 'code ' + deeplinkingUrl)
                win?.webContents.executeJavaScript(`window.localStorage.setItem('code', '${deeplinkingUrl}')`)

                logEverywhere('protocol.handle# requesting access_token...')
                console.log(deeplinkingUrl)

                axios.post('https://sdu.itslearning.com/restapi/oauth2/token', {
                    "grant_type": "authorization_code",
                    "code": deeplinkingUrl,
                    "client_id": '10ae9d30-1853-48ff-81cb-47b58a325685',
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }).then(res => {
                    logEverywhere('protocol.handle# setting access_token to localStorage...')
                    logEverywhere('protocol.handle# access_token ' + res.data.access_token)
                    win?.webContents.executeJavaScript(`window.localStorage.setItem('access_token', '${res.data.access_token}')`)
                    logEverywhere('protocol.handle# setting refresh_token to localStorage...')
                    logEverywhere('protocol.handle# refresh_token ' + res.data.refresh_token)
                    win?.webContents.executeJavaScript(`window.localStorage.setItem('refresh_token', '${res.data.refresh_token}')`)
                    win?.webContents.executeJavaScript(`window.location.reload()`)
                    itslearningWin.close()
                }).catch(err => {
                    logEverywhere('protocol.handle# error ' + err)
                })
            }
            if (win) {
                win.show()
            }
            return net.fetch('about:blank')
        })
    }
})

function logEverywhere(s: string) {
    console.log(s)
    if (win && win.webContents) {
        win.webContents.executeJavaScript(`console.log("${s}")`)
    }
}