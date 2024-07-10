const information = document.getElementById("info");
information.innerText = `本应用正在使用 Chrome (v${electronAPI.chrome()}), Node.js (v${electronAPI.node()}), 和 Electron (v${electronAPI.electron()})`;
