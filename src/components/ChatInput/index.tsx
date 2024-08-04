import React from "react";
import View from "../View";
import { Button, Input, Space } from "antd";
import useOllama from "./useOllama";
import { StopOutlined, UpOutlined } from "@ant-design/icons";
const styles = require("./index.module.less");
const { TextArea } = Input;

const ChatInput = (props: {
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  const { defaultValue = "", onChange } = props;
  const {
    connected,
    requireIng,
    loading,
    stopAsk,
    submitAsk,
    aiResponse,
    setAiResponse,
    askSomething,
    setAskSomething,
  } = useOllama();

  return (
    <View className={styles.chatInput}>
      <View className={styles.textAreaWrapper}>
        <TextArea
          allowClear
          autoSize={{ minRows: 1, maxRows: 10 }}
          className={styles.textArea}
          rows={1}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </View>

      {requireIng ? (
        <Button onClick={stopAsk} type="default" key="list-loadmore-more">
          <StopOutlined />
        </Button>
      ) : (
        <Button
          className={styles.submitBtn}
          loading={loading}
          onClick={submitAsk}
          icon={<UpOutlined />}
          type="default"
        ></Button>
      )}
    </View>
  );
};

export default ChatInput;
