import BrowserLoader from "./BrowserLoader";



declare class OllamaHistoryManager {
  private storageKey: string;
  private history: Array<HistoryItem>;
  private loader: BrowserLoader;

  constructor();

  /**
   * 加载历史记录
   */
  private loadHistory(): void;

  /**
   * 保存历史记录
   */
  private saveHistory(): void;

  /**
   * 添加一条新的问答历史记录
   * @param question - 用户的问题
   * @param answer - Ollama 的回答
   */
  addHistory(history: HistoryItem): void;

  /**
   * 获取所有的问答历史记录
   * @returns 问答历史记录数组
   */
  getHistory(): Array<HistoryItem>;

  /**
   * 更新一条历史记录
   * @param {string} id - 历史记录的 id
   * @param {string} answer - Ollama 的回答
   */
  updateHistory(id, answer): void;

  /**   
   * 更新所有历史记录
   * @param {Array<{question: string, answer: string}>} history - 新的历史记录
   */
  updateAllHistory(history): void;

  /**
   * 删除一条历史记录
   * @param {string} id - 历史记录的 id
   */
  deleteHistory(id): void;
}

export default OllamaHistoryManager;
