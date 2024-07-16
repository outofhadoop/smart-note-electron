const BASE_URL = "http://localhost";

const BASE_PORT = 11434;

export async function fetchAndDisplayStream(
  question: string,
  callback: (content: { content: string; done: boolean | undefined }) => void
) {
  // const contentDiv = document.getElementById("content");
  const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt: `使用中文回答：\n${question}`,
    }),
  });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let markdownContent = "";
  while (true) {
    const result = await reader?.read();
    if (result?.done) {
      markdownContent += decoder.decode(result?.value, { stream: true });
    }

    callback({
      content: decoder.decode(result?.value, { stream: true }),
      done: result?.done,
    });
    if (result?.done) break;
  }
}
