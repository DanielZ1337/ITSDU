import {ipcMain} from "electron";
import {AuthService} from "../services/auth/auth-service.ts";
import {store_keys} from '../services/auth/types/store_keys.ts';

const authService = AuthService.getInstance()

function getTokenHandler() {
    ipcMain.handle('itslearning-store:get', (event, val: store_keys) => {
        return authService.getToken(val)
    });
}

function setTokenHandler() {
    ipcMain.handle('itslearning-store:set', (event, key: store_keys, val) => {
        authService.setToken(key, val)
    });
}

function deleteTokenHandler() {
    ipcMain.handle('itslearning-store:delete', (event, key: store_keys) => {
        authService.deleteToken(key)
    })
}

function clearTokensHandler() {
    ipcMain.handle('itslearning-store:clear', (event) => {
        authService.clearTokens()
    });
}

export default function initAuthIpcHandlers() {
    getTokenHandler()
    setTokenHandler()
    deleteTokenHandler()
    clearTokensHandler()
}