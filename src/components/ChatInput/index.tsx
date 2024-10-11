import React, { useEffect } from "react";
import View from "../View";
import { Button, Empty, Input, Space } from "antd";
import useOllama from "./useOllama";
import { StopOutlined, UpOutlined } from "@ant-design/icons";
const styles = require("./index.module.less");
const { TextArea } = Input;

const ChatInput = (props: {
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  aiResponseCallback?: (response: string) => void;
  onSubmit?: (appendContent: string) => void;
  messages?: { role: string; content: string }[];
  finishAnswer?: (res: {
    content: string;
    done?: boolean;
    singleContent: string;
  }) => void;
}) => {
  const { defaultValue = "", onChange, aiResponseCallback, onSubmit, messages, finishAnswer } = props;
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
    modelList,
    appendContent,
    setAppendContent,
  } = useOllama(messages, finishAnswer);

  useEffect(() => {
    // 将aiResponse抛出
    if (aiResponse) {
      aiResponseCallback?.(aiResponse);
    }
  }, [aiResponse, aiResponseCallback]);

  const handleSubmit = () => {
    onSubmit?.(appendContent);
    submitAsk();
  };

  return (
    <View className={styles.chatInput}>
      {/* {modelList.length === 0 ? (
        <Empty className={styles.empty} description="未找到模型" />
      ) : (
        <>
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
        </>
      )} */}

      <View className={styles.textAreaWrapper}>
        <TextArea
          allowClear
          value={appendContent}
          autoSize={{ minRows: 1, maxRows: 10 }}
          className={styles.textArea}
          rows={1}
          defaultValue={defaultValue}
          onChange={(e) => {
            setAppendContent(e.target.value);
            onChange?.(e);
          }}
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
          onClick={handleSubmit}
          icon={<UpOutlined />}
          type="default"
        ></Button>
      )}
    </View>
  );
};

export default ChatInput;
