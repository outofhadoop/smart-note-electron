import BrowserLoader from "./BrowserLoader";


// 定义一个类来管理 Ollama 的历史记录
class OllamaHistoryManager {
  constructor() {
    // 使用 localstorage 来保存历史记录
    this.storageKey = "ollama_history";
    this.history = [];
    this.loader = new BrowserLoader();
    this.loadHistory();
  }

  /**
   * 加载历史记录
   */
  loadHistory() {
    const historyStr = this.loader.load(this.storageKey);
    try {
      if (historyStr) {
        this.history = JSON.parse(historyStr);
      } else {
        this.history = [];
      }
    } catch (error) {
      console.error("Error loading history:", error);
      this.history = [];
    }
  }

  /**
   * 保存历史记录
   */
  saveHistory() {
    this.loader.save(this.storageKey, JSON.stringify(this.history));
  }

  /**
   * 添加一条新的问答历史记录
   * @param {string} question - 用户的问题
   * @param {string} answer - Ollama 的回答
   */
  addHistory(history) {
    this.history.push(history);
    this.saveHistory();
  }

  /**
   * 获取所有的问答历史记录
   * @returns {Array<{question: string, answer: string}>}
   */
  getHistory() {
    return this.history;
  }

  /**
   * 删除一条历史记录
   * @param {string} id - 历史记录的 id
   */
  deleteHistory(id) {
    this.history = this.history.filter((item) => item.id !== id);
    this.saveHistory();
  }

  /**
   * 更新一条历史记录
   * @param {string} id - 历史记录的 id
   * @param {string} answer - Ollama 的回答
   */
  updateHistory(id, messages) {
    const index = this.history.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.history[index].messages = messages;
      this.saveHistory();
    }
  }

  /**
   * 更新所有历史记录
   * @param {Array<{question: string, answer: string}>} history - 新的历史记录
   */
  updateAllHistory(history) {
    this.history = history;
    this.saveHistory();
  }
}

export default OllamaHistoryManager;


