const BASE_URL = "http://10.81.50.101";

const BASE_PORT = 11434;

/**
 * @param question 问题文本
 * @param callback 返回回调
 * @param signal AbortSignal
 */
export async function fetchAndDisplayStream({
  question,
  callback,
  images = [],
  signal,
}: {
  question?: string;
  callback?: (res: {
    content: string;
    done?: boolean;
    singleContent: string;
  }) => void;
  signal?: AbortSignal;
  images?: {noBase64Prefix: string; allContent: string }[];
}) {
  try {
    const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{
          role: "user",
          content: '你是一个使用瞰觅科技公司广州办公室本地服务器中的ollama跑起来的聊天机器人，默认模型使用llama3.1。下面问题使用简体中文回答。',
        },{
          role: "user",
          content: question,
        }],
        model: "llama3.1",
      }),
      signal,
    });
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let markdownContent = "";
    while (true) {
      const result = await reader?.read();
      if (result?.done) {
        callback?.({
          content: markdownContent,
          done: result?.done,
          singleContent: "",
        });
        break;
      }

      const resString = decoder.decode(result?.value, { stream: true });
      const parseRes = JSON.parse(resString);
      markdownContent += parseRes?.message?.content ?? '';
      callback?.({
        content: markdownContent,
        singleContent: parseRes?.message?.content ?? '',
        done: result?.done,
      });
    }
  } catch (error) {
    console.error(error);
  }
}


/**
 * 测试ollama连接
 */
export const testOllamaConnection = async () => {
  try {
  const response = await fetch(`${BASE_URL}:${BASE_PORT}`);
  return response.ok;
  } catch (error) {
    console.error("testOllamaConnection error:", error);
    return false
  }
};

/**
 * 获取模型列表
 */
export const getModelList = async () => {
  try {
    const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/tags`);
    const {models: moduleList}: {models: { name: string; digest: string }[]} = await response.json();
    return moduleList;
  } catch (error) {
    console.error("getModelList error:", error);
  }
  
};