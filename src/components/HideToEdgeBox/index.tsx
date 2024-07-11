
import React, { useEffect } from "react";
import View from "../View";
const styles = require('./index.module.less')
/**
 * 隐藏到边缘的盒子
 */
const HideToEdgeBox: React.FC<{children?: React.ReactNode}> = ({children}) => {
  
  return <View className={`${styles.hideToEdgeBox}`}>
      <View className={styles.leftBar}></View>  
      <View className={styles.container}>{children ? children : null}</View>
    </View>
};

export default HideToEdgeBox;