/* eslint-disable no-unused-vars */
import { contextBridge, ipcRenderer } from 'electron'
import { sendNotifcation } from "./handlers/notifcation-handler.ts";
import slugify from "slugify";
import { store_keys } from './services/itslearning/auth/types/store_keys.ts';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld('auth', {
    store: {
        get: (key: store_keys) => ipcRenderer.invoke('itslearning-store:get', key),
        set: (key: store_keys, data: any) => ipcRenderer.invoke('electron-store:set', key, data),
        clear: () => ipcRenderer.invoke('itslearning-store:clear'),
    },
    logout: () => ipcRenderer.invoke('itslearning-store:logout'),
})

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
    quit: () => ipcRenderer.invoke('app:quit'),
    minimize: () => ipcRenderer.invoke('app:minimize'),
    maximize: () => ipcRenderer.invoke('app:maximize'),
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
    relaunch: () => ipcRenderer.invoke('app:relaunch'),
    getPath: (path: string) => ipcRenderer.invoke('app:getPath', path),
    getDownloadPath: () => ipcRenderer.invoke('app:getDownloadPath'),
    openShell: (path: string) => ipcRenderer.invoke('app:openShell', path),
    openItem: (path: string) => ipcRenderer.invoke('app:openItem', path),
    openExternal: (url: string, sso: boolean = true) => ipcRenderer.invoke('app:openExternal', url, sso),
})

contextBridge.exposeInMainWorld('itslearning_file_scraping', {})

contextBridge.exposeInMainWorld('ai', {
    upload: async (elementId: number) => {
        const downloadLink = await ipcRenderer.invoke('get-resource-download-link', elementId)
        const scrapedResourceDownloadLink = await ipcRenderer.invoke('download:start', downloadLink)

        return await ipcRenderer.invoke('uploadfile-for-ai', {
            url: scrapedResourceDownloadLink,
            elementId,
        })
    },
})

contextBridge.exposeInMainWorld('download', {
    external: async (url: string, filename: string) => {
        await ipcRenderer.invoke('download:external', {
            url,
            filename: slugify(filename),
        })
    },
    start: async (elementId: number, filename: string) => {

        const downloadLink = await ipcRenderer.invoke('get-resource-download-link', elementId)
        const scrapedResourceDownloadLink = await ipcRenderer.invoke('download:start', downloadLink)

        await ipcRenderer.invoke('itslearning-element:download', {
            url: scrapedResourceDownloadLink,
            resourceLink: downloadLink,
            filename: slugify(filename),
        })
    }
})

contextBridge.exposeInMainWorld('cookies', {
    get: async (elementId: number) => {
        const cookies = await ipcRenderer.invoke('itslearning-store:get-cookies-for-resource', elementId)
        return cookies
    }
})

contextBridge.exposeInMainWorld('blob', {
    get: async (elementId: number) => {
        const blob = await ipcRenderer.invoke('get-blob-from-element-id', elementId)
        return blob
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
            send: (title: string, body: string) => void
        },
        app: {
            exit: () => Promise<void>
            quit: () => Promise<void>
            minimize: () => Promise<void>
            maximize: () => Promise<void>
            checkForUpdates: () => Promise<void>
            getVersion: () => Promise<string>
            relaunch: () => Promise<void>
            getPath: (path: string) => Promise<string>
            getDownloadPath: () => Promise<string>
            openShell: (path: string) => Promise<void>
            openItem: (path: string) => Promise<void>
            openExternal: (url: string, sso?: boolean) => Promise<void>
        },
        download: {
            start: (elementId: number, filename: string) => Promise<void>
            external: (url: string, filename: string) => Promise<void>
        },
        itslearning_file_scraping: {
            start: (elementId: number, filename: string) => Promise<void>
        },
        auth: {
            store: {
                get: (key: store_keys) => Promise<string>
                set: (key: store_keys, data: any) => Promise<void>
                clear: () => Promise<void>
            }
            logout: () => Promise<void>
        },
        ai: {
            upload: (elementId: number) => Promise<boolean>
        },
        cookies: {
            get: (elementId: number | string) => Promise<string>
        },
        blob: {
            get: (elementId: number | string) => Promise<string>
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
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
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
}

function useLoading() {
    const oImg = document.createElement('img')
    // use the same image as the app icon
    oImg.src = 'itsl-itslearning-file://icon.ico'

    oImg.style.cssText = `
        width: 12vw;
        height: 12vh;
        object-fit: contain;
        z-index: 9999;
        max-height: 100px;
        max-width: 100px;
        animation: spin 2s linear infinite;
    `;

    const styleContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  background: ${localStorage.getItem('theme') === 'dark' ? 'black' : 'white'};
  z-index: 9;
}
    `

    const oStyle = document.createElement('style')
    const oDiv = document.createElement('div')

    oStyle.id = 'app-loading-style'
    oStyle.innerHTML = styleContent
    oDiv.className = 'app-loading-wrap'
    oDiv.innerHTML = oImg.outerHTML

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
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)