const { clipboard, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

const ClipboardType = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
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
    return { type: "image", content: imgDataURL };
  }

  // 处理 HTML 数据
  if (formats.includes("text/html")) {
    const html = clipboard.readHTML();
    return { type: "html", content: html };
  }

  // 处理 RTF 数据
  if (formats.includes("text/rtf")) {
    const rtf = clipboard.readRTF();
    mainWindow.webContents.send("clipboard-changed");
    return { type: "rtf", content: rtf };
  }

  // 处理文件路径数据
  if (formats.includes("Files")) {
    const files = clipboard.read("Files");
    return { type: "files", content: files };
  }
  console.log("no data !!!!!");
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
    }
  };

  /**
   * 写入文件
   * @param {*} data
   */
  const writeToFile = (data) => {
    // 检测文件是否存在，如果不存在则创建文件
    try {
      // if (!fs.existsSync(filePath)) {
      //   fs.writeFileSync(filePath, data, {
      //     encoding: "utf-8",
      //   });
      // }

      fs.writeFileSync(filePath, data, {
        encoding: "utf-8",
      });
      console.log("Successfully wrote to file");
    } catch (err) {
      console.log("Failed to write to file");
    }
  };

  /**
   * 读取文件
   * @returns
   */
  const readFileSync = () => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "", {
        encoding: "utf-8",
      });
    }
    return fs.readFileSync(filePath, "utf-8");
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

    if (lastClipboardData.content !== clipboardData.content) {
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
