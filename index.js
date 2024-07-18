const { app, BrowserWindow, screen, ipcMain  } = require('electron');
const path = require('path');
const { handleClipboardChanged } = require('./clipboardHandle');



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
    // x: width - 1, // 初始位置设置为屏幕右侧边缘
    y: 0,
    frame: false,
    // alwaysOnTop: true,
    transparent: true,
    // skipTaskbar: true,
    resizable: true,
    // movable: false,
    // show: true, // 初始时隐藏窗口
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('./dist/index.html');

  // mainWindow.webContents.openDevTools()

  // 窗口完全打开时才显示
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  handleClipboardChanged(mainWindow, ipcMain, app)
  

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