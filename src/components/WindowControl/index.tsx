import React from "react"
import View from "../View"
import { Button } from "antd"
import { CloseOutlined, MinusOutlined } from "@ant-design/icons"

const WindowControl = () => {
  const hideWindow = () => {
    
  }
  const closeWindow = () => {

  }
  return <View>
    <Button onClick={hideWindow} type="default" icon={<MinusOutlined />}></Button>
    <Button onClick={closeWindow} type="default" icon={<CloseOutlined />}></Button>
  </View>
}

export default WindowControl