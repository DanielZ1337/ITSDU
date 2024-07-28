import {BrowserWindow} from 'electron';

const Store = require('electron-store');

interface WindowOptions {
    width: number;
    height: number;
    x: number;
    y: number;
    maximized?: boolean;
}

const DEFAULT_WINDOW_SIZE = {
    width: 1280,
    height: 720,
};


export class WindowOptionsService {
    // @ts-ignore
    private readonly store: typeof Store<WindowOptions>;

    constructor() {
        this.store = new Store({
            name: 'itslearning-window-options-store',
        });
    }

    public getWindowOptions(): WindowOptions {
        const screen = require('electron').screen;
        const display = screen.getPrimaryDisplay();

        const defaultOptions: WindowOptions = {
            ...DEFAULT_WINDOW_SIZE,
            x: (display.bounds.width - DEFAULT_WINDOW_SIZE.width) / 2,
            y: (display.bounds.height - DEFAULT_WINDOW_SIZE.height) / 2,
        };

        console.log('WindowOptionsService#getWindowOptions# ' + 'defaultOptions ' + JSON.stringify(defaultOptions))
        console.log(this.store.get('windowOptions', defaultOptions))

        return this.store.get('windowOptions', defaultOptions);
    }

    public saveWindowOptions(window: BrowserWindow): void {
        const windowBounds = window.getBounds();
        const windowOptions: WindowOptions = {
            width: windowBounds.width,
            height: windowBounds.height,
            x: windowBounds.x,
            y: windowBounds.y,
            maximized: window.isMaximized(),
        };

        this.store.set('windowOptions', windowOptions);
    }

    public resetWindowOptions(): void {
        this.store.clear();
    }
}
