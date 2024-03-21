/* eslint-disable no-unused-vars */
import { contextBridge, ipcRenderer } from 'electron';

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

contextBridge.exposeInMainWorld('itslearning', {
    setOrganisation: async (customerId: number) => {
        await ipcRenderer.invoke('itslearning:setOrganisation', customerId)
    },
    login: async () => {
        await ipcRenderer.invoke('itslearning:login')
    }
})

// edit window object and type definition
declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window {
        ipcRenderer: typeof ipcRenderer,
        darkMode: {
            toggle: () => Promise<boolean>
            system: () => Promise<void>
            get: () => Promise<boolean>
        },
        itslearning: {
            setOrganisation: (customerId: number) => Promise<void>,
            login: () => Promise<void>
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
        async appendLoading() {
            const theme = await ipcRenderer.invoke('dark-mode:get')

            const html = document.getElementsByTagName('html')[0]
            html.classList.add(theme)
        },
        removeLoading() {
        },
    }
}

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
    ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 1)