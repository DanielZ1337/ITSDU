import {BrowserWindow} from "electron";

export function handleDeepLink(win: BrowserWindow | null, deeplinkingUrl: string | null, argv: string[], logger: ((s: string) => void) | undefined) {
    console.log('handleDeepLink# ' + 'deeplinkingUrl ' + deeplinkingUrl)
    console.log('handleDeepLink# ' + 'argv ' + argv)
    if (process.platform == 'win32') {
        // Keep only command line / deep linked arguments
        const commandArgument = argv.slice(1)
        const regex = /itsl-itslearning:\/\/login\/\?state=damn&code=(.*)/gm;
        const matches = regex.exec(deeplinkingUrl || commandArgument.join(' '))
        if (matches) {
            deeplinkingUrl = matches[1]
        }
    }
    if (win) {
        if (logger) {
            logger('app.makeSingleInstance# ' + 'setting code to localStorage...')
            logger('app.makeSingleInstance# ' + 'code ' + deeplinkingUrl)
        }
        win.webContents.executeJavaScript(`window.localStorage.setItem('code', '${deeplinkingUrl}')`)
    }
}