export const copyToClipboard = (data: any) => {
  try {
    window?.electronAPI?.copyToClipboard(data);
  } catch (error) {
    console.log('copyToClipboard error:', error);
  }
};

/**
 * 展示窗口
 */
export const showElectronWindow = () => {
  try {
    window?.electronAPI?.showWindow?.();
  } catch (error) {

  }
}

/**
 * 监听剪切板改变
 */
export const onClipboardChanged = (callback: (event: any, newContent: ClipboardItem[]) => void) => {
  try {
    window?.electronAPI?.onClipboardChanged?.(callback);
  } catch (error) {

  }
}

/**
 * 读取历史内容
 */
export const readClipboardHistory = () => {
  return window?.electronAPI?.readClipboardHistory?.() ?? []
}