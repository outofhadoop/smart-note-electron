import React from "react";
import View from "../View";
import { Button, Input, Space } from "antd";
import useOllama from "./useOllama";
import { StopOutlined, UpOutlined } from "@ant-design/icons";
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
    <View>
      <Space.Compact style={{ width: "100%", marginTop: "10px" }}>
        <TextArea rows={4} defaultValue={defaultValue} onChange={onChange} />
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
    </View>
  );
};

export default ChatInput;
