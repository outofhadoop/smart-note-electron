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
// import hljs from "highlight.js";
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
            setType(value as "clipboard" | "ai");
          }}
        />

      </View>
      {type === "ai" && (
        <View className={styles.aiResponse}>
          <div dangerouslySetInnerHTML={{ __html: marked(aiResponse) }} />
          <View className={styles.chatInputWrapper}>
            <ChatInput aiResponseCallback={setAiResponse} />
          </View>
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
