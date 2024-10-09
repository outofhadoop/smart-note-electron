const { app, BrowserWindow, screen, ipcMain  } = require('electron');
const path = require('path');
const { handleClipboardChanged } = require('./clipboardHandle');
const { chatWithAIHandle } = require('./chatWithAIHandle');


let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const windowConfig = {
    width: 500,
    height: height,
  };

  mainWindow = new BrowserWindow({
    width: windowConfig.width,
    height: height,
    x: width - windowConfig.width, // 初始位置设置为屏幕右侧边缘
    y: 0,
    frame: true,
    // alwaysOnTop: true,
    transparent: true,
    autoHideMenuBar: true,
    fullScreenable: false,
    title: '剪切板历史',
    // skipTaskbar: true,
    resizable: true,
    movable: true,
    // show: true, // 初始时隐藏窗口
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('./dist/index.html');

  mainWindow.webContents.openDevTools()

  // 窗口完全打开时才显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  handleClipboardChanged(mainWindow, ipcMain, app)
  chatWithAIHandle(mainWindow, ipcMain, app)
  

  // ipcMain.on('show-window', () => {
  //   mainWindow.setBounds({ x: width - windowConfig.width + 1, y: 0, width: windowConfig.width, height: height });
  // });
  

  // // 隐藏窗口
  // ipcMain.on('hide-window', () => {
  //   mainWindow.setBounds({ x: width - 1, y: 0, width: windowConfig.width, height: height });
  // });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});