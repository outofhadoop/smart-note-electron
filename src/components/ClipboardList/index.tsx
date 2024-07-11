import type { RadioChangeEvent } from "antd";
import { Button, List, Radio, Timeline } from "antd";
import React, { useEffect, useState } from "react";
import View from "../View";
import { CopyOutlined } from "@ant-design/icons";
const { v4: uuid } = require("uuid");
const styles = require("./index.module.less");

enum ClipboardType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

const ClipboardList = () => {
  const [data, setData] = useState<
    {
      id: string;
      title: string;
      description?: string;
      time?: string;
      type: ClipboardType;
      content: any;
    }[]
  >([
    {
      id: uuid(),
      title: "test",
      description: new Date().toLocaleString(),
      time: new Date().toLocaleString(),
      type: ClipboardType.TEXT,
      content: "test",
    },
  ]);

  const handleClipboardChangeData = (newContent: {
    type: ClipboardType;
    content: any;
  }) => {
    /**
     * 如果是已经复制过的内容就置顶匹配项
     */
    const index = data.findIndex((item) => item.content === newContent.content);
    if (index !== -1) {
      data.splice(index, 1);
      data.unshift(newContent.content);
    }

    const commonInfo = {
      id: uuid(),
      time: new Date().toLocaleString(),
      type: newContent.type,
      content: newContent.content,
    };
    switch (newContent.type) {
      case ClipboardType.TEXT:
        setData([
          {
            title: newContent.content,

            ...commonInfo,
          },
          ...data,
        ]);
        break;
      case ClipboardType.IMAGE:
        setData([
          {
            title: newContent.content,
            ...commonInfo,
          },
          ...data,
        ]);
        break;
    }
  };

  useEffect(() => {
    window?.electronAPI?.onClipboardChanged?.((event, newContent) => {
      console.log("剪切板内容:", newContent, event);
      handleClipboardChangeData(newContent);
    });
  }, []);
  return (
    <View className={styles.container}>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button  type="text" key="list-loadmore-more">
                <CopyOutlined />
              </Button>,

            ]}
            key={item.id}
          >
            <List.Item.Meta
              title={<View>{item.title}</View>}
              description={`${item.time}`}
            />
          </List.Item>
        )}
      />
    </View>
  );
};

export default ClipboardList;
