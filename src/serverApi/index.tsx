const BASE_URL = "http://localhost";

const BASE_PORT = 11434;

export async function fetchAndDisplayStream(question: string) {
  // const contentDiv = document.getElementById("content");
  const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/generate`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt: `使用中文回答这个问题：${question}`,
    }),
  });
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let markdownContent = "";
  while (true) {
    const result = await reader?.read();
    if (result?.done) break;
    markdownContent += decoder.decode(result?.value, { stream: true });
    console.log(markdownContent);
  }
}
