import { app, BrowserWindow } from 'electron'
import path from 'node:path'

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

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
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

if (!app.isDefaultProtocolClient('itsl-itslearning')) {
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient('itsl-itslearning')
}

/* import express from 'express'
import axios from 'axios'
const proxy = express();
proxy.get('/api', async (_, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const access_token = 'StuvHLRsXdYagawjTXURO6C4Y24mVKRqrv4gEb5BoPz9Y8g_NcUN6A6CKDtK1eAXtsgZ5BZ72qGUT4KjDWYS4U0yV2jJrXOZpLPMcbHKPT3M1CRJGr54x6nRh7xzpdd6'
  const { data } = await axios.get('https://sdu.itslearning.com/restapi/personal/person/v1', {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    params: {
      'access_token': access_token
    }
  }).then(res => {
    console.log(res.data)
    return res
  }).catch(err => {
    console.log(err)
    return err
  })

  res.json(data)
}) */
app.whenReady().then(() => {
  createWindow()
  /*   proxy.listen(8080, () => {
      console.log('API Proxy Server with CORS enabled is listening on port 8080')
    }) */
})

// Log both at dev console and at running node console instance
function logEverywhere(s: string) {
  console.log(s)
  if (win && win.webContents) {
    win.webContents.executeJavaScript(`console.log("${s}")`)
  }
}