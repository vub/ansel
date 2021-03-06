import { BrowserWindow, ipcMain } from 'electron'

import { assertMainProcess } from '../common/util/ElectronUtil'
import { ExifOrientation } from '../common/models/DataTypes'
import { PhotoWork } from '../common/models/Photo'


assertMainProcess()


interface CallInfo {
    resolve(result: any)
    reject(error: any)
}


let mainWindow: BrowserWindow | null = null

let nextCallId = 1
const pendingCalls: { [key:number]: CallInfo } = {}


export function init(mainWin: BrowserWindow) {
    mainWindow = mainWin

    ipcMain.on('onForegroundActionDone', (event, callId, error, result) => {
        const callInfo = pendingCalls[callId]
        delete pendingCalls[callId]
        if (callInfo) {
            if (error) {
                callInfo.reject(error)
            } else {
                callInfo.resolve(result)
            }
        }
    })
}


async function callOnForeground(action: string, params: any): Promise<any> {
    const callId = nextCallId++

    return new Promise<any>((resolve, reject) => {
        pendingCalls[callId] = { resolve, reject }
        mainWindow.webContents.send('executeForegroundAction', callId, action, params)
    })
}
