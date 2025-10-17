import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { post, setToken } from "../../utils/request";
import styles from "./Login.module.scss";

const Login = () => {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("开始登录请求...", { account, password });

      const data = await post<{ token: { token: string } }>(
        "/api/users/login",
        {
          account,
          password,
        }
      );

      console.log("登录成功，返回数据:", data);

      // 保存token到localStorage
      console.log("保存token到localStorage:", data.data.token);
      setToken(data.data.token.token);
      // 跳转到Canvas页面
      navigate("/canvas");
    } catch (err: any) {
      console.error("登录失败:", err);
      setError(err.message || "登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>欢迎登录</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="account">账号</label>
            <input
              id="account"
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="请输入账号"
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">密码</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              disabled={loading}
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
