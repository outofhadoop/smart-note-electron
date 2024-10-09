import { useEffect, useState } from "react";
import {
  fetchAndDisplayStream,
  getModelList,
  testOllamaConnection,
} from "../../serverApi";

const useOllama = (
  messages?: { role: string; content: string }[],
  finishAnswer?: (res: {
    content: string;
    done?: boolean;
    singleContent: string;
  }) => void
) => {
  const [connected, setConnected] = useState(false);
  const [requireIng, setRequireIng] = useState(false);
  const [stopAskHandle, setStopAskHandle] = useState<() => void>(() => {});
  const [aiResponse, setAiResponse] = useState<string>("");
  const [appendContent, setAppendContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modelList, setModelList] = useState<
    Awaited<ReturnType<typeof getModelList>>
  >([]);

  const [askSomething, setAskSomething] = useState<{
    prompt: string;
    images: string[];
  }>({
    prompt: "",
    images: [],
  });

  const [model, setModel] = useState<string | undefined>("");

  useEffect(() => {
    // 测试ollama连接
    testOllamaConnection().then((connectedSuccess) => {
      setConnected(connectedSuccess);
    });
  }, []);

  useEffect(() => {
    if (connected) {
      // 获取模型信息
      getModelList().then((modelList) => {
        console.log(modelList);
        setModelList(modelList);
        setModel(modelList?.[0]?.name ?? "");
      });
    }
  }, [connected]);

  const submitAsk = () => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    setStopAskHandle(() => {
      return () => {
        controller.abort();
      };
    });
    fetchAndDisplayStream({
      question: `${askSomething?.prompt ?? ""}\n${appendContent}`,
      messages: [
        ...(messages || []),
        {
          role: "user",
          content: `${askSomething?.prompt ?? ""}\n${appendContent}`,
        },
      ],
      callback: (res) => {
        setLoading(false);
        setRequireIng(true);
        setAiResponse(res.content);
        if (res.done) {
          setRequireIng(false);
          finishAnswer?.(res);
        }
      },
      signal,
    });
  };

  const stopAsk = () => {
    stopAskHandle?.();
    setRequireIng(false);
  };

  return {
    connected,
    modelList,
    model,
    setModel,
    requireIng,
    setRequireIng,
    loading,
    setLoading,
    aiResponse,
    setAiResponse,
    askSomething,
    setAskSomething,
    submitAsk,
    setAppendContent,
    stopAsk,
    appendContent,
  };
};

export default useOllama;
