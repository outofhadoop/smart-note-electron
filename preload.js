const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showWindow: () => ipcRenderer.send('show-window'),
  hideWindow: () => ipcRenderer.send('hide-window'),
  logMessage: (message) => ipcRenderer.send('log-message', message),
  cacheClipboard: (message) => ipcRenderer.send('cache-clipboard', message),
  onClipboardChanged: (callback) => ipcRenderer.on('clipboard-changed', callback),
  readClipboardHistory: () => ipcRenderer.sendSync('read-clipboard-history'),
  copyToClipboard: (data) => ipcRenderer.send('copy-to-clipboard', data),
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
});