const BASE_URL = "http://localhost";

const BASE_PORT = 3000;


async function fetchAndDisplayStream() {
  const contentDiv = document.getElementById('content');
  const response = await fetch(`${BASE_URL}:${BASE_PORT}/api/generate`);
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let markdownContent = '';
  while (true) {
    const result = await reader?.read();
    if (result?.done) break;
    markdownContent += decoder.decode(result?.value, { stream: true });
  }
}