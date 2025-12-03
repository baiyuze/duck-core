import React, { useMemo } from "react";

interface MouseProps {
  left: number;
  top: number;
}

// 生成随机用户名
const generateRandomUsername = () => {
  const randomNum = Math.floor(Math.random() * 9999);
  return `匿名用户${randomNum.toString().padStart(4, "0")}`;
};

const Mouse: React.FC<MouseProps> = ({ left, top }) => {
  // 使用 useMemo 确保用户名在组件生命周期内保持不变
  const username = useMemo(() => generateRandomUsername(), []);

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        pointerEvents: "none",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <svg
        className="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6746"
        width="26"
        height="26"
      >
        <path
          d="M147.77747345 147.77747345l249.04632569 728.4450531 143.60332489-335.79540252 335.79540252-143.6033249z"
          p-id="6747"
          fill="#5a84ff"
        ></path>
      </svg>
      <span
        style={{
          fontSize: "12px",
          color: "#5a84ff",
          backgroundColor: "rgba(90, 132, 255, 0.1)",
          padding: "2px 8px",
          borderRadius: "4px",
          whiteSpace: "nowrap",
          border: "1px solid rgba(90, 132, 255, 0.3)",
        }}
      >
        {username}
      </span>
    </div>
  );
};

export default Mouse;
