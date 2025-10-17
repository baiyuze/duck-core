import { LogoutOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../utils/request";

/**
 * 登出按钮组件
 * 可以在需要的地方引入使用
 */
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 清除token
    removeToken();

    // 提示用户
    message.success("已退出登录");

    // 跳转到登录页
    navigate("/login");
  };

  return (
    <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} danger>
      退出登录
    </Button>
  );
};

export default LogoutButton;
