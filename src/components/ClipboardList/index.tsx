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
} from "antd";
import React, { useEffect, useState } from "react";
import View from "../View";
import { CommentOutlined, CopyOutlined, StopOutlined, UpOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../utils/electronApi";
import { fetchAndDisplayStream } from "../../serverApi";
const styles = require("./index.module.less");

enum ClipboardType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

const ClipboardList = () => {
  const [data, setData] = useState<ClipboardItem[]>([]);
  const [type, setType] = useState<"clipboard" | "ai">("clipboard");
  const [askSomething, setAskSomething] = useState<string>("");
  const [requireIng, setRequireIng] = useState<boolean>(false);
  const [appendContent, setAppendContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleClipboardChangeData = (newContent: ClipboardItem[]) => {
    setData(newContent);
  };

  useEffect(() => {
    window?.electronAPI?.onClipboardChanged?.(
      (event, newContent: ClipboardItem[]) => {
        console.log("剪切板内容:", newContent, event);
        handleClipboardChangeData(newContent);
      }
    );
    // 首次运行时，读取历史记录
    const historyList = window?.electronAPI?.readClipboardHistory?.();
    console.log("historyList", historyList);

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
    setAskSomething(item.content);
  };

  const submitAsk = () => {
    fetchAndDisplayStream(`${askSomething}\n${appendContent}`, (content) => {
      setLoading(false);
      setRequireIng(true);
      setAppendContent(content.content);

      if (content.done) {
        setRequireIng(false);
      }
    });
  };

  return (
    <View className={styles.container}>
      <View>
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
      </View>

      {type === "clipboard" && (
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => copyContent(item)}
                  type="text"
                  key="list-loadmore-more"
                >
                  <CopyOutlined />
                </Button>,
                <Button
                  onClick={() => askAI(item)}
                  type="text"
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
      )}
      {type === "ai" && (
        <View>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              addonBefore={<View>{askSomething.slice(0, 10)}...</View>}
              onChange={(e) => setAppendContent(e.target.value)}
            />
            {requireIng ? (
              <Button
                onClick={() => setRequireIng(false)}
                type="text"
                key="list-loadmore-more"
              >
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
        </View>
      )}
    </View>
  );
};

export default ClipboardList;
