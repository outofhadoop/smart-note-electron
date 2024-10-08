const { clipboard, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const { writeToFile, readFileSync } = require("./src/utils/fileOperate");
const ClipboardType = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
  HTML: "html",
  RTF: "rtf",
};

/**
 * 读取剪贴板数据
 * @param {Array} formats
 * @returns
 */
const readClipboardData = (formats) => {
  // 处理文本数据
  if (formats.includes("text/plain")) {
    const text = clipboard.readText();
    return { type: "text", content: text };
  }

  // 处理图像数据
  if (formats.includes("image/png") || formats.includes("image/jpeg")) {
    const image = clipboard.readImage();
    const imgDataURL = image.toDataURL();
    return { type: ClipboardType.IMAGE, content: imgDataURL };
  }

  // 处理 HTML 数据
  if (formats.includes("text/html")) {
    const html = clipboard.readHTML();
    return { type: ClipboardType.HTML, content: html };
  }

  // 处理 RTF 数据
  if (formats.includes("text/rtf")) {
    const rtf = clipboard.readRTF();
    mainWindow.webContents.send("clipboard-changed");
    return { type: ClipboardType.RTF, content: rtf };
  }

  // 处理文件路径数据
  if (formats.includes('text/uri-list')) {
    const uriList = clipboard.read('FileNameW');
    console.log(formats, typeof uriList, uriList, 'uriList');
    if (uriList) {
      // const uris = uriList.split('\n').filter(uri => uri.trim() !== '');
      return { type: ClipboardType.FILE, content: uriList };
    } else {
      return { type: ClipboardType.FILE, content: '未知文件' };
    }
  } else if (formats.includes("public.file-url")) {
    filePath = clipboard.read('public.file-url').replace('file://', '');
    return { type: ClipboardType.FILE, content: filePath };
  }
  return null;
};

let lastFormats = clipboard.availableFormats();
let lastClipboardData = readClipboardData(lastFormats);

const handleClipboardChanged = (mainWindow, ipcMain, app) => {
  const filePath = path.join(app.getPath("documents"), "clipboard.txt");

  /**
   * 处理剪贴板数据
   * @param {*} clipboardData
   * @returns
   */
  const handleClipboardData = (clipboardData) => {
    const commonInfo = {
      id: uuid(),
      time: new Date().toLocaleString(),
      type: clipboardData.type,
      content: clipboardData.content,
    };

    switch (clipboardData.type) {
      case ClipboardType.TEXT:
        return {
          title: clipboardData.content,
          ...commonInfo,
        };
      case ClipboardType.IMAGE:
        return {
          title: clipboardData.content,
          ...commonInfo,
        };
      case ClipboardType.FILE:
        return {
          title: clipboardData.content,
          ...commonInfo,
        };
    }
  };



  // 复制内容到剪贴板
  ipcMain.on("copy-to-clipboard", (event, data) => {
    switch (data.type) {
      case ClipboardType.IMAGE:
        const image = nativeImage.createFromDataURL(data.content);
        clipboard.writeImage(image);
        break;
      default:
        clipboard.write(data);
        break;
    }
    
    event.returnValue = "Copied";
  });

  ipcMain.on("write-to-file", (event, data) => {
    writeToFile(data);
  });

  ipcMain.on("read-clipboard-history", (event) => {
    const data = JSON.parse(readFileSync() || `[]`);
    event.returnValue = data;
  });

  // {
  //   /**
  //    * 首次运行时，发送剪贴板历史数据
  //    */
  //   const data = JSON.parse(readFileSync() || `[]`);
  //   console.log(data, '历史数据');
  //   mainWindow.webContents.send("clipboard-changed", data);
  // }

  // 轮询剪贴板内容的变化
  setInterval(() => {
    const formats = clipboard.availableFormats();
    const clipboardData = readClipboardData(formats);

    if (lastClipboardData?.content !== clipboardData?.content) {
      console.log("Clipboard text changed:", clipboardData);

      const handleData = handleClipboardData(clipboardData);
      const data = JSON.parse(readFileSync() || `[]`);
      let newData = []
      
      const sameDataIndex = data.findIndex(item => item.content === handleData.content);
      if (sameDataIndex !== -1) {
        const sameData = data.splice(sameDataIndex, 1);
        newData.push(...sameData, ...data);
      } else {
        newData = [handleData, ...data];
      }

      writeToFile(JSON.stringify(newData));

      mainWindow.webContents.send("clipboard-changed", newData);

      lastClipboardData = clipboardData;

    }
  }, 1000); // 每秒检查一次
};

module.exports = {
  handleClipboardChanged,
};
