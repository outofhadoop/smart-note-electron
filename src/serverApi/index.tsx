const BASE_URL = "http://localhost";

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
    // const contentDiv = document.getElementById("content");
    const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: images?.length > 0 ? "llava-llama3" : "llama3",
        prompt: `你是一个剪切板小助手，由探迹的前端同学开发。下面问题使用中文回答：\n${
          question ?? ""
        }`,
        images: images?.map((item) => item.noBase64Prefix),
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
      markdownContent += parseRes?.response;
      callback?.({
        content: markdownContent,
        singleContent: parseRes?.response,
        done: result?.done,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 测试ollama连接
 */
export const testOllamaConnection = async () => {
  const response = await fetch(`${BASE_URL}:${BASE_PORT}`);
  console.log(response);
  return response.ok;
};

/**
 * 获取模型列表
 */
export const getModelList = async () => {
  const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/tags`);
  const {models: moduleList}: {models: { name: string; digest: string }[]} = await response.json();
  return moduleList;
};