declare module "*.less" {
  const content: { [className: string]: string };
  export default content;
}

/**
 * 剪切板的数据类型
 */
interface ClipboardItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  type: ClipboardType;
  content: any;
}


interface Window {
  electronAPI: {
    onClipboardChanged: (
      callback: (event: any, newContent: ClipboardItem[]) => void
    ) => void;
    copyToClipboard: (data: any) => void;
    readClipboardHistory: () => ClipboardItem[];
    showWindow: () => {};
  };
}
