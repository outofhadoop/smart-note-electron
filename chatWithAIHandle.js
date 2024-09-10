const appendChatMessage = (mainWindow, ipcMain, app) => {
    ipcMain.on('appendChatMessage', (event, message) => {
        mainWindow.webContents.send('appendChatMessage', message);
    });
}

const chatWithAIHandle = (mainWindow, ipcMain, app) => {

}   