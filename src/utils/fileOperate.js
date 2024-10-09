const fs = require("fs");
const path = require("path");

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

module.exports = {
  writeToFile,
  readFileSync,
};
