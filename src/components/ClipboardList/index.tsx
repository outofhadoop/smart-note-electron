import type { RadioChangeEvent } from "antd";
import { Button, List, Radio, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import View from "../View";
import { CopyOutlined } from "@ant-design/icons";
import { copyToClipboard } from "../../utils/electronApi";
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
    window?.electronAPI?.onClipboardChanged?.((event, newContent: ClipboardItem[]) => {
      console.log("剪切板内容:", newContent, event);
      handleClipboardChangeData(newContent);
    });
    // 首次运行时，读取历史记录
    const historyList = window?.electronAPI?.readClipboardHistory?.();
    console.log('historyList', historyList);
    
    if (historyList?.length) {
      setData(historyList)
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
          image: item.content,
        });
        break;
    }
  };

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
            ]}
            key={item.id}
          >
            <List.Item.Meta
              title={<View className={styles.title}>{item.title}</View>}
              description={`${item.time}`}
            />
          </List.Item>
        )}
      />
    </View>
  );
};

export default ClipboardList;
