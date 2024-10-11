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

interface OllamaHistoryManager {
  constructor();
  addHistory(question: string, answer: string): void;
  saveHistory(): void;
  loadHistory(): void;
}

interface BrowserLoader {
  load(source: string): any;
  save(source: string, value: any): void;
}

interface NodeLoader {
  load(source: string): any;
  save(source: string, value: any): void;
}

interface HistoryItem {
  answer?: string;
  timestamp: number;
  title: string;
  messages: Array<{ role: string; content: string, id: string }>;
  id: string;
  question?: string;
  //   暂时没用
  //   图片
  images?: string[];
  //   提示词
  prompt?: string;
  //   模型
  model?: string;
  //   温度
  temperature?: number;
  //   topP
  topP?: number;
  //   topK
  topK?: number;
  //   流
  stream?: boolean;
  //   种子
  seed?: number;
  //   停止
  stop?: string[];
  //   响应格式
  responseFormat?: string;
}