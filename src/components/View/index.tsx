import React from "react";
// import styles from "./index.less";

/**
 * 视图组件
 * @param {React.ReactNode} children - 子组件
 * @returns {React.ReactNode} - 视图组件
 */
const View: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={className}>{children ? children : null}</div>;
};

export default View;
