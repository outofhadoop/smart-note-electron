declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}

interface Window {
  electronAPI: {
    onClipboardChanged: (callback: (event: any, newContent: {
      type: ClipboardType;
      content: any;
    }) => void) => void;
  }
}