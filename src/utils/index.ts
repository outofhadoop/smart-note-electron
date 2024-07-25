export const removeBase64Prefix = (base64Str: string): string => {
  // 找到第一个逗号的位置，逗号之后的部分就是图片数据
  const commaIndex = base64Str.indexOf(",");
  if (commaIndex === -1) {
    // 如果找不到逗号，就返回原字符串
    return base64Str;
  }
  // 截取逗号之后的部分
  return base64Str.slice(commaIndex + 1);
};
