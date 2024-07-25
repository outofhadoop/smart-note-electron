import type { RadioChangeEvent } from "antd";
import {
  Button,
  List,
  Radio,
  Timeline,
  Image,
  Segmented,
  Space,
  Input,
  Popover,
} from "antd";
import hljs from "highlight.js";
import React, { useEffect, useState } from "react";
import View from "../View";
import {
  CommentOutlined,
  CopyOutlined,
  StopOutlined,
  UpOutlined,
} from "@ant-design/icons";
import {
  copyToClipboard,
  onClipboardChanged,
  readClipboardHistory,
} from "../../utils/electronApi";
import { fetchAndDisplayStream } from "../../serverApi";
import ChatInput from "../ChatInput";
import { marked } from "marked";
import { removeBase64Prefix } from "../../utils";
const styles = require("./index.module.less");

enum ClipboardType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

const ClipboardList = () => {
  const [data, setData] = useState<ClipboardItem[]>([]);
  const [type, setType] = useState<"clipboard" | "ai">("clipboard");
  const [askSomething, setAskSomething] = useState<{
    prompt: string;
    images: {noBase64Prefix: string; allContent: string }[];
  }>({
    prompt: "",
    images: [],
  });
  const [stopAskHandle, setStopAskHandle] = useState<() => void>(() => {});
  const [requireIng, setRequireIng] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [appendContent, setAppendContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleClipboardChangeData = (newContent: ClipboardItem[]) => {
    setData(newContent);
  };

  useEffect(() => {
    /**
     * 监听复制内容改变
     */
    onClipboardChanged((event, newContent: ClipboardItem[]) => {
      handleClipboardChangeData(newContent);
    });

    // 首次运行时，读取历史记录
    const historyList = readClipboardHistory();

    if (historyList?.length) {
      setData(historyList);
    }

    // const renderer = new marked.Renderer();
    // // @ts-ignore
    // renderer.code = (code, language) => {
    //   if (language === undefined) {
    //     language = "plaintext";
    //   }
    //   const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    //   return `<pre><code class="hljs ${validLanguage}">${hljs.highlight(validLanguage, code).value}</code></pre>`;
    // };
  
    // marked.setOptions({
    //   renderer: renderer,
    //   gfm: true,
    //   breaks: true
    // });
  }, []);

  /**
   * 复制内容
   */
  const copyContent = (item: ClipboardItem) => {
    switch (item.type) {
      case ClipboardType.TEXT:
        copyToClipboard({
          text: item.content,
        });
        break;
      case ClipboardType.IMAGE:
        copyToClipboard({
          ...item,
          image: item.content,
        });
        break;
    }
  };

  const renderListItem = (item: ClipboardItem) => {
    switch (item.type) {
      case ClipboardType.TEXT:
        return (
          <List.Item.Meta
            title={<View className={styles.title}>{item.title}</View>}
            description={`${item.time}`}
          />
        );
      case ClipboardType.IMAGE:
        return (
          <List.Item.Meta
            title={
              <View className={styles.title}>
                <Image width={200} src={item.title} />
              </View>
            }
            description={`${item.time}`}
          />
        );

      case ClipboardType.FILE:
        return (
          <List.Item.Meta
            title={<View className={styles.title}>{item.title}</View>}
            description={`${item.time}`}
          />
        );
      default:
        return (
          <List.Item.Meta
            title={<View className={styles.title}>{item.title}</View>}
            description={`${item.time}`}
          />
        );
    }
  };

  const askAI = (item: ClipboardItem) => {
    setType("ai");
    if (item.type === ClipboardType.IMAGE) {
      setAskSomething({
        prompt: "",
        images: [{
          allContent: item.content,
          noBase64Prefix: removeBase64Prefix(item.content),
        }],
      });
    } else {
      setAskSomething({
        prompt: item.content,
        images: [],
      });
    }
  };
  /**
   * 提交询问
   */
  const submitAsk = () => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;
    setStopAskHandle(() => {
      return () => {
        controller.abort();
      };
    });

    /**
     * 请求获取ollama AI回复
     */
    fetchAndDisplayStream({
      question: `${askSomething?.prompt ?? ""}\n${appendContent}`,
      callback: (res) => {
        setLoading(false);
        setRequireIng(true);
        setAiResponse(res.content);
        if (res.done) {
          setRequireIng(false);
        }
      },
      signal,
      images: askSomething?.images ?? [],
    });
  };
  /**
   * 停止询问
   */
  const stopAsk = () => {
    stopAskHandle?.();
    setRequireIng(false);
  };

  /**
   * 清空剪切板复制的内容
   */
  const removeAskSomething = () => {
    setAskSomething({
      prompt: "",
      images: [],
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.Segmented}>
        <Segmented
          value={type}
          options={[
            { label: "剪切板", value: "clipboard" },
            { label: "AI", value: "ai" },
          ]}
          onChange={(value) => {
            console.log(value);
            setType(value as "clipboard" | "ai");
          }}
        />
        {type === "ai" && (
          <Space.Compact style={{ width: "100%", marginTop: "10px" }}>
            <Input
              addonBefore={
                askSomething?.prompt?.length > 0 ||
                askSomething?.images?.length > 0 ? (
                  <Popover
                    trigger="hover"
                    content={
                      <View className={styles.askSomethingPopoverContainer}>
                        <View>
                          {askSomething?.prompt}
                          {askSomething?.images?.length > 0 ? (
                            <View>
                              {askSomething?.images?.map((item, index) => {
                                return (
                                  <Image key={index} width={200} src={item?.allContent} />
                                );
                              })}
                            </View>
                          ) : null}
                        </View>
                        <Button danger type="link" onClick={removeAskSomething}>
                          删除这些内容
                        </Button>
                      </View>
                    }
                    title="剪切板内容"
                  >
                    {askSomething?.prompt?.slice(0, 10)}...
                  </Popover>
                ) : null
              }
              onChange={(e) => setAppendContent(e.target.value)}
            />
            {requireIng ? (
              <Button onClick={stopAsk} type="default" key="list-loadmore-more">
                <StopOutlined />
              </Button>
            ) : (
              <Button
                loading={loading}
                onClick={submitAsk}
                icon={<UpOutlined />}
                type="default"
              ></Button>
            )}
          </Space.Compact>
        )}
      </View>

      {type === "clipboard" && (
        <View className={styles.clipboardList}>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  <Button
                    onClick={() => copyContent(item)}
                    type="default"
                    key="list-loadmore-more"
                  >
                    <CopyOutlined />
                  </Button>,
                  <Button
                    onClick={() => askAI(item)}
                    type="default"
                    key="list-loadmore-more"
                  >
                    <CommentOutlined />
                  </Button>,
                ]}
                key={item.id}
              >
                {renderListItem(item)}
              </List.Item>
            )}
          />
        </View>
      )}
      {type === "ai" && (
        <View className={styles.aiResponse}>
          <div dangerouslySetInnerHTML={{ __html: marked(aiResponse) }} />
          <ChatInput />
        </View>
      )}
    </View>
  );
};

export default ClipboardList;
