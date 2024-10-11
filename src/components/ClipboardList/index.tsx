import type { RadioChangeEvent } from "antd";
import { v4 as uuidv4 } from "uuid";
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
  Divider,
  Drawer,
  Avatar,
  Menu,
} from "antd";
import { HistoryOutlined, UserOutlined } from "@ant-design/icons";
// import hljs from "highlight.js";
import React, { useEffect, useRef, useState } from "react";
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
import ChatInput from "../ChatInput";
import OllamaHistoryManager from "../../utils/ollamaChatHistory";
import { removeBase64Prefix } from "../../utils";
import { Marked } from "marked";
const styles = require("./index.module.less");
import hljs from "highlight.js";
import "highlight.js/styles/tokyo-night-dark.css";
import { markedHighlight } from "marked-highlight";

enum ClipboardType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}
const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code: string, lang: string, info: string) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  })
);
const ClipboardList = () => {
  const [ollamaHistoryManager] = useState(new OllamaHistoryManager());
  const [data, setData] = useState<ClipboardItem[]>([]);
  const [type, setType] = useState<"clipboard" | "ai">("clipboard");
  const [open, setOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [currentHistory, setCurrentHistory] = useState<HistoryItem>({
    messages: [],
    answer: "",
    timestamp: Date.now(),
    title: "",
    id: uuidv4(),
  });
  const currentHistoryRef = useRef(currentHistory);
  const [askSomething, setAskSomething] = useState<{
    prompt: string;
    images: { noBase64Prefix: string; allContent: string }[];
  }>({
    prompt: "",
    images: [],
  });
  const [aiResponse, setAiResponse] = useState<string>("");

  const handleClipboardChangeData = (newContent: ClipboardItem[]) => {
    setData(newContent);
  };

  useEffect(() => {
    currentHistoryRef.current = currentHistory;
  }, [currentHistory]);

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

    // 加载历史记录
    const history = ollamaHistoryManager.getHistory() ?? [];
    setChatHistory(history);
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

  /**
   * 渲染拷贝的列表项
   */
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
        images: [
          {
            allContent: item.content,
            noBase64Prefix: removeBase64Prefix(item.content),
          },
        ],
      });
    } else {
      setAskSomething({
        prompt: item.content,
        images: [],
      });
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSubmit = (appendContent: string) => {
    // 是否已经存在
    const history = ollamaHistoryManager.getHistory();
    const index = history.findIndex(
      (item) => item.id === currentHistoryRef.current.id
    );
    if (index !== -1) {
      history[index].messages.push({
        role: "user",
        content: appendContent,
        id: uuidv4(),
      });
      setCurrentHistory(history[index]);
      if (index !== 0) {
        // 把这条记录移动到最前面
        const item = history.splice(index, 1)[0];
        history.unshift(item);
      }
      // 更新所有历史记录
      ollamaHistoryManager.updateAllHistory(history);
      return;
    }
    // 不存在添加到历史记录
    const oneHistory = {
      ...currentHistoryRef.current,
      messages: [
        ...currentHistoryRef.current.messages,
        { role: "user", content: appendContent, id: uuidv4() },
      ],
      timestamp: Date.now(),
      title:
        appendContent.length > 10
          ? appendContent.slice(0, 10) + "..."
          : appendContent,
    };
    ollamaHistoryManager.addHistory(oneHistory);
    setCurrentHistory(oneHistory);
    setChatHistory(ollamaHistoryManager.getHistory());
  };

  const handleFinishAnswer = (res: {
    content: string;
    done?: boolean;
    singleContent: string;
  }) => {
    const oneHistory = {
      ...currentHistoryRef.current,
      messages: [
        ...currentHistoryRef.current.messages,
        { role: "assistant", content: res.content, id: uuidv4() },
      ],
    };
    ollamaHistoryManager.updateHistory(oneHistory.id, oneHistory.messages);
    setCurrentHistory(oneHistory);
    setAiResponse("");

  };

  return (
    <View className={styles.container}>
      <View className={styles.Segmented}>
        {/* 历史记录 */}
        {type === "ai" && (
          <Button className={styles.historyBtn} onClick={() => setOpen(true)}>
            <HistoryOutlined />
          </Button>
        )}
        <Segmented
          value={type}
          options={[
            { label: "剪切板", value: "clipboard" },
            { label: "AI", value: "ai" },
          ]}
          onChange={(value) => {
            setType(value as "clipboard" | "ai");
          }}
        />
      </View>
      {type === "ai" && (
        <View className={styles.aiResponse}>
          {currentHistory.messages.map((item) => (
            <React.Fragment key={item.id}>
              {/* 用户提问 */}
              {item.role === "user" && (
                <div className={styles.userMessage}>
                  <div>{item.content}</div>
                  <Avatar className={styles.avatar} icon={<UserOutlined />} />
                </div>
              )}
              {/* 回答 */}
              {item.role === "assistant" && (
                <div className={styles.assistantMessageWrapper}>
                  <Avatar className={styles.avatar} icon={<UserOutlined />} />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(item.content),
                    }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}

          {/* 回答 */}
           <div className={styles.assistantMessageWrapper}>
            {aiResponse && (
              <Avatar className={styles.avatar} icon={<UserOutlined />} />
            )}
            <div
              className={styles.assistantMessage}
              dangerouslySetInnerHTML={{
                __html: marked.parse(aiResponse),
              }}
            />
          </div>

          <View className={styles.chatInputWrapper}>
            <ChatInput
              messages={currentHistory?.messages}
              aiResponseCallback={setAiResponse}
              onSubmit={handleSubmit}
              finishAnswer={handleFinishAnswer}
            />
          </View>
          {/* chat历史记录 */}
          <Drawer
            title="历史记录"
            placement="left"
            closable={false}
            onClose={onClose}
            open={open}
          >
            <View>
              <Menu
                onClick={(e) => {
                  setCurrentHistory(chatHistory.find((item) => item.id === e.key)!);
                  onClose();
                }}
                mode="inline"
                items={chatHistory.map((item) => ({
                  label: item.title,
                  key: item.id,
                }))}
              />
            </View>
          </Drawer>
        </View>
      )}

      {/* 剪切板列表 */}
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
    </View>
  );
};

export default ClipboardList;
