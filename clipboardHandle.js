const { clipboard } = require("electron");

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

const handleClipboardChanged = (mainWindow) => {
  // 轮询剪贴板内容的变化
  setInterval(() => {
    const formats = clipboard.availableFormats();
    const clipboardData = readClipboardData(formats);
    if (lastClipboardData.content !== clipboardData.content) {
      console.log("Clipboard text changed:", clipboardData);
      mainWindow.webContents.send("clipboard-changed", clipboardData);
      lastClipboardData = clipboardData;
    }
  }, 1000); // 每秒检查一次
};

module.exports = {
  handleClipboardChanged,
};
