import type { RadioChangeEvent } from "antd";
import { Button, List, Radio, Timeline, Image } from "antd";
import React, { useEffect, useState } from "react";
import View from "../View";
import { CommentOutlined, CopyOutlined } from "@ant-design/icons";
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
    fetchAndDisplayStream('你好')
  }

  return (
    <View className={styles.container}>
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
    </View>
  );
};

export default ClipboardList;
