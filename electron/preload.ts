import { contextBridge, ipcRenderer } from 'electron'
import { sendNotifcation } from "./handlers/notifcation-handler.ts";
import axios from "axios";
import slugify from "slugify";
import { apiUrl } from '../src/lib/utils';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system'),
    get: () => ipcRenderer.invoke('dark-mode:get'),
    /*subscribe: (listener: (event: Electron.IpcRendererEvent, shouldUseDarkColors: boolean) => void) => {
        ipcRenderer.on('dark-mode:updated', listener)
    }*/
})
contextBridge.exposeInMainWorld('notification', {
    send: (title: string, body: string) => {
        sendNotifcation(title, body)
    },
})
contextBridge.exposeInMainWorld('app', {
    exit: () => ipcRenderer.invoke('app:exit'),
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
    getPath: (path: string) => ipcRenderer.invoke('app:getPath', path),
    getDownloadPath: () => ipcRenderer.invoke('app:getDownloadPath'),
    openShell: (path: string) => ipcRenderer.invoke('app:openShell', path),
    openItem: (path: string) => ipcRenderer.invoke('app:openItem', path),
    openExternal: (url: string, sso: boolean = true) => ipcRenderer.invoke('app:openExternal', url, sso),
})

contextBridge.exposeInMainWorld('itslearning_file_scraping', {

})

contextBridge.exposeInMainWorld('download', {
    external: async (url: string, filename: string) => {
        ipcRenderer.invoke('download:external', {
            url,
            filename: slugify(filename),
        })
    },
    start: async (elementId: number, filename: string) => {

        const { data } = await axios.get(apiUrl(`restapi/personal/sso/url/v1`), {
            params: {
                'access_token': window.localStorage.getItem('access_token'),
                'url': `https://sdu.itslearning.com/LearningToolElement/ViewLearningToolElement.aspx?LearningToolElementId=${elementId}`
            }
        })

        const downloadLink = data.Url

        const scrapedResourceDownloadLink = await ipcRenderer.invoke('download:start', downloadLink)

        ipcRenderer.invoke('itslearning-element:download', {
            url: scrapedResourceDownloadLink,
            resourceLink: downloadLink,
            filename: slugify(filename),
        })
    }
})

// edit window object and type definition
declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        ipcRenderer: typeof ipcRenderer
        darkMode: {
            toggle: () => Promise<boolean>
            system: () => Promise<void>
            get: () => Promise<boolean>
        },
        notification: {
            // eslint-disable-next-line no-unused-vars
            send: (title: string, body: string) => void
        },
        app: {
            exit: () => Promise<void>
            getVersion: () => Promise<string>
            relaunch: () => Promise<void>
            // eslint-disable-next-line no-unused-vars
            getPath: (path: string) => Promise<string>
            getDownloadPath: () => Promise<string>
            // eslint-disable-next-line no-unused-vars
            openShell: (path: string) => Promise<void>
            // eslint-disable-next-line no-unused-vars
            openItem: (path: string) => Promise<void>
            // eslint-disable-next-line no-unused-vars
            openExternal: (url: string, sso?: boolean) => Promise<void>
        },
        download: {
            // eslint-disable-next-line no-unused-vars
            start: (elementId: number, filename: string) => Promise<void>
            // eslint-disable-next-line no-unused-vars
            external: (url: string, filename: string) => Promise<void>
        },
        itslearning_file_scraping: {
            // eslint-disable-next-line no-unused-vars
            start: (elementId: number, filename: string) => Promise<void>
        }
    }
}


// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
    const protos = Object.getPrototypeOf(obj)

    for (const [key, value] of Object.entries(protos)) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) continue

        if (typeof value === 'function') {
            // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
            obj[key] = function (...args: any) {
                return value.call(obj, ...args)
            }
        } else {
            obj[key] = value
        }
    }
    return obj
}

// --------- Preload scripts loading ---------
/* function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
    return new Promise(resolve => {
        if (condition.includes(document.readyState)) {
            resolve(true)
        } else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true)
                }
            })
        }
    })
}

const safeDOM = {
    append(parent: HTMLElement, child: HTMLElement) {
        if (!Array.from(parent.children).find(e => e === child)) {
            parent.appendChild(child)
        }
    },
    remove(parent: HTMLElement, child: HTMLElement) {
        if (Array.from(parent.children).find(e => e === child)) {
            parent.removeChild(child)
        }
    },
} */

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
/* function useLoading() {
    const className = `loaders-css__square-spin`
    const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `
    const oStyle = document.createElement('style')
    const oDiv = document.createElement('div')

    oStyle.id = 'app-loading-style'
    oStyle.innerHTML = styleContent
    oDiv.className = 'app-loading-wrap'
    oDiv.innerHTML = `<div class="${className}"><div></div></div>`

    return {
        appendLoading() {
            safeDOM.append(document.head, oStyle)
            safeDOM.append(document.body, oDiv)
        },
        removeLoading() {
            safeDOM.remove(document.head, oStyle)
            safeDOM.remove(document.body, oDiv)
        },
    }
} */

// ----------------------------------------------------------------------

/* const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
 */