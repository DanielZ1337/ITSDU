import {app, BrowserWindow, ipcMain, Menu, nativeTheme, protocol, session, Tray} from 'electron'
import path from 'node:path'
import axios from "axios";
import darkModeHandlerInitializer from './handlers/dark-mode-handlers'
import * as fs from "fs";
import appHandlerInitializer from "./handlers/app-handler.ts";
import {download} from "electron-dl";

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
const ITSLEARNING_CLIENT_ID = '10ae9d30-1853-48ff-81cb-47b58a325685'


let win: BrowserWindow | null
let deeplinkingUrl: string | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
darkModeHandlerInitializer()
appHandlerInitializer()

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
        await win.loadFile(path.join(process.env.DIST, 'index.html'))
    }

    return win
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
            if (win.isMinimized()){
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
        deeplinkingUrl = url
        logEverywhere('open-url# ' + deeplinkingUrl)
    })
})

app.whenReady().then(async () => {
        const ses = session.defaultSession
        ipcMain.handle('app:getDownloadPath', async () => {
            console.log(app.getPath('downloads'))
            return app.getPath('downloads')
        })
        ipcMain.handle('app:openShell', async (_, path) => {
            console.log(path)
            const shell = await import('electron').then(m => m.shell)
            await shell.openPath(path)
        })
        ipcMain.handle('app:openItem', async (_, path) => {
            console.log(path)
            const shell = await import('electron').then(m => m.shell)
            // shell.showItemInFolder(path)
            //open the file with the default app
            await shell.openPath(path)
        })
        ipcMain.handle("itslearning-element:download", async (event, {url, resourceLink, filename}) => {
            try { /*const win = BrowserWindow.fromWebContents(event.sender)
            if (!win) return*/

                console.log(url, resourceLink, filename)

                const newWin = new BrowserWindow({
                    show: false,
                    webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false,
                    }
                })
                await newWin.loadURL(resourceLink)
                console.log('download# ' + url)

                // download the file
                const downloadItem = await download(newWin, url, {
                    filename: filename,
                    directory: app.getPath('downloads'),
                    showProgressBar: true,
                    showBadge: true,
                })
                logEverywhere('download# ' + downloadItem.getSavePath())
                event.sender.send("download:complete", downloadItem.getSavePath())
            } catch (e) {
                console.error(e)
                event.sender.send("download:error", null)
            }
        })

        ipcMain.handle("itslearning-file-scraping:start", async (_, url) => {
            try {
                const scrapeWindow = new BrowserWindow({
                    show: false,
                    webPreferences: {
                        nodeIntegration: true,
                    }
                })
                await scrapeWindow.loadURL(url)

                const iframeSrc = await scrapeWindow.webContents.executeJavaScript(`document.querySelectorAll('iframe')[1].src`)
                await scrapeWindow.loadURL(iframeSrc)
                const downloadHref = await scrapeWindow.webContents.executeJavaScript(`document.querySelector('#ctl00_ctl00_MainFormContent_DownloadLinkForViewType').getAttribute('href')`)
                const fileLink = 'https://resource.itslearning.com' + downloadHref
                scrapeWindow.close()
                return fileLink
            } catch (e) {
                console.error(e)
                return null
            }
        })

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
                const params = req.params
                // const headers = req.headers
                const method = req.method
                const body = req.body
                const {data} = await axios.request({
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    url: `https://sdu.itslearning.com${url}`,
                    data: body,
                    method,
                    params
                }).then(res => {
                    // console.log(res.data)
                    return res
                }).catch(err => {
                    // console.log(err)
                    return err
                })

                // manual await for the response to simulate slow network
                // await new Promise(resolve => setTimeout(resolve, 10000))
                res.json(data)
            }).listen(8080, () => {
                console.log('API Proxy Server with CORS enabled is listening on port 8080')
            })
        }
        const win = await createWindow()

        win.on('close', (e) => {
            e.preventDefault()
            // TODO: have some preferences and follow those
            require('electron').dialog.showMessageBox(win, {
                type: 'question',
                buttons: ['Yes', 'Minimize', 'No'],
                title: 'Confirm',
                message: 'Are you sure you want to quit?',
                icon: path.join(process.env.VITE_PUBLIC, 'icon.ico'),
                noLink: true,
            }).then(result => {
                if (result.response === 0) {
                    win.close()
                    win.destroy()
                    app.quit()
                } else if (result.response === 1) {
                    win.hide()
                } else if (result.response === 2) {
                    e.preventDefault()
                }
            }).catch(err => {
                console.log(err)
                app.exit(0)
            })
        })

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Show App', click: function () {
                    win.show();
                }
            },
            {
                label: 'Quit', click: function () {
                    win.close()
                    win.destroy()
                    app.exit(0)
                }
            }
        ]);

        const tray = new Tray(path.join(process.env.VITE_PUBLIC, 'icon.ico'))

        tray.on('double-click', () => {
            win.show()
        })

        tray.setToolTip('itslearning')
        tray.on('right-click', () => {
            tray.focus()
            contextMenu.items[0].enabled = !win.isVisible()
            tray.setContextMenu(contextMenu)
            setTimeout(() => {
                tray.popUpContextMenu(contextMenu)
            }, 250)
        })

        const localStorageTheme = await win.webContents.executeJavaScript(`window.localStorage.getItem('theme')`)
        console.log('localStorageTheme', localStorageTheme)
        if (localStorageTheme) {
            const isDarkMode = localStorageTheme === 'dark'
            nativeTheme.themeSource = isDarkMode ? 'dark' : 'light'
        }
        const itslearningWin = new BrowserWindow({
            parent: win,
            modal: true,
            show: false,
            autoHideMenuBar: true,
            resizable: false,
            height: 600,
            width: 800,
            // alwaysOnTop: true,
            darkTheme: false,
            focusable: true,
        })

        /*itslearningWin.on('close', (e) => {
            e.preventDefault()
            app.exit(0)
        })*/

        // @ts-ignore
        protocol.handle('itsl-itslearning', async (req) => {
            const regex = /itsl-itslearning:\/\/login\/\?state=damn&code=(.*)/gm;
            const matches = regex.exec(req.url)
            if (matches) {
                deeplinkingUrl = matches[1]
                logEverywhere('protocol.handle# setting code to localStorage...')
                logEverywhere('protocol.handle# ' + 'code ' + deeplinkingUrl)
                await win.webContents.executeJavaScript(`window.localStorage.setItem('code', '${deeplinkingUrl}')`)

                logEverywhere('protocol.handle# requesting access_token...')
                console.log(deeplinkingUrl)

                axios.post('https://sdu.itslearning.com/restapi/oauth2/token', {
                    "grant_type": "authorization_code",
                    "code": deeplinkingUrl,
                    "client_id": ITSLEARNING_CLIENT_ID,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                }).then(res => {
                    logEverywhere('protocol.handle# setting access_token to localStorage...')
                    logEverywhere('protocol.handle# access_token ' + res.data.access_token)
                    access_token = res.data.access_token
                    win.webContents.executeJavaScript(`window.localStorage.setItem('access_token', '${res.data.access_token}')`)
                    logEverywhere('protocol.handle# setting refresh_token to localStorage...')
                    logEverywhere('protocol.handle# refresh_token ' + res.data.refresh_token)
                    refresh_token = res.data.refresh_token
                    win.webContents.executeJavaScript(`window.localStorage.setItem('refresh_token', '${res.data.refresh_token}')`)
                    win.webContents.executeJavaScript(`window.location.reload()`)
                    itslearningWin.close()
                }).catch(err => {
                    logEverywhereError('protocol.handle# ' + err)
                })
            } else {
                await itslearningWin.loadURL(req.url)
                itslearningWin.show()
            }
            win.show()
            itslearningWin.close()
            itslearningWin.destroy()
            // return net.fetch('about:blank')
        })

        let code = await win.webContents.executeJavaScript(`window.localStorage.getItem('code')`) as string || null
        let access_token = await win.webContents.executeJavaScript(`window.localStorage.getItem('access_token')`) as string || null
        let refresh_token = await win.webContents.executeJavaScript(`window.localStorage.getItem('refresh_token')`) as string || null

        console.log('code', code)
        console.log('access_token', access_token)
        console.log('refresh_token', refresh_token)

        if (access_token && access_token !== 'undefined') {
            try {
                await axios.get('https://sdu.itslearning.com/restapi/personal/person/v1', {
                    params: {
                        'access_token': access_token
                    }
                })
            } catch (e) {
                access_token = null
                await win.webContents.executeJavaScript(`window.localStorage.removeItem('access_token')`)
                logEverywhereError('requestValidityOfAccessToken# ' + e)
            }
        }

        if (refresh_token && !access_token && refresh_token !== 'undefined') {
            try {
                const {data} = await axios.post('https://sdu.itslearning.com/restapi/oauth2/token', {
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                    "client_id": ITSLEARNING_CLIENT_ID,
                }, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    }
                })

                access_token = data.access_token
                await win.webContents.executeJavaScript(`window.localStorage.setItem('access_token', '${access_token}')`)
            } catch (e) {
                logEverywhereError('requestRefreshToken# ' + e)
            }
        }

        if (!access_token || access_token === 'undefined') {
            if (code != null && code != 'undefined') {
                try {
                    const {data} = await axios.post('https://sdu.itslearning.com/restapi/oauth2/token', {
                        "grant_type": "authorization_code",
                        "code": code,
                        "client_id": ITSLEARNING_CLIENT_ID,
                    }, {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        }
                    })

                    access_token = data.access_token
                    refresh_token = data.refresh_token
                    await win.webContents.executeJavaScript(`window.localStorage.setItem('access_token', '${access_token}')`)
                    await win.webContents.executeJavaScript(`window.localStorage.setItem('refresh_token', '${refresh_token}')`)
                } catch (e) {
                    logEverywhereError('requestAccessAndRefreshToken# ' + e)
                    code = null
                    await win.webContents.executeJavaScript(`window.localStorage.removeItem('code')`)
                }
            }
        }

        if (!code || code === 'undefined' || !refresh_token || refresh_token === 'undefined' || !access_token || access_token === 'undefined') {
            itslearningWin.show()
            itslearningWin.focus()
            await itslearningWin.loadURL(`https://sdu.itslearning.com/oauth2/authorize.aspx?client_id=${ITSLEARNING_CLIENT_ID}&state=damn&response_type=code&scope=Calendar%20Children%20CkEditor%20Courses%20Hierarchies%20LearningObjectiveRepository%20LearningObjectivesReports%20LightBulletin%20Messages%20Notifications%20Person%20Planner%20Sso%20Statistics%20StudentPlan%20Supervisor%20TaskListDailyWorkflow%20Tasks%20Workload&redirect_uri=itsl-itslearning://login`)
            itslearningWin.webContents.on('did-finish-load', () => {
                itslearningWin.webContents.send('main-process-message', (new Date).toLocaleString())
            })
        } else {
            await win.webContents.executeJavaScript(`window.localStorage.setItem('code', '${code}')`)
            await win.webContents.executeJavaScript(`window.localStorage.setItem('access_token', '${access_token}')`)
            itslearningWin.close()
            itslearningWin.destroy()
            win.show()
        }
        if (itslearningWin) {
            // redirect to actual login microsoft sso page
            itslearningWin.webContents.executeJavaScript(`__doPostBack('ctl00$ContentPlaceHolder1$federatedLoginButtons$ctl00$ctl00','')`)
        }
    }
)

async function logEverywhere(s: string) {
    console.log(s)
    if (win && win.webContents) {
        await win.webContents.executeJavaScript(`console.log("${s}")`)
    }
}

async function logEverywhereError(s: string) {
    console.error(s)
    if (win && win.webContents) {
        await win.webContents.executeJavaScript(`console.error("${s}")`)
    }
}