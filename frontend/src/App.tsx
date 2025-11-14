import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  HashRouter,
} from "react-router-dom";
import "./App.css";
import Canvas from "./Canvas/Canvas";
import Login from "./Pages/Login/Login";
import TokenTest from "./Components/TokenTest";
import TokenDebug from "./Components/TokenDebug";

// 路由守卫：检查是否登录
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const token = localStorage.getItem("token");
  // if (!token) {
  //   return <Navigate to="/login" replace />;
  // }
  return <>{children}</>;
};

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/canvas"
          element={
            <ProtectedRoute>
              <Canvas width={800} height={800} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/token-test"
          element={
            <ProtectedRoute>
              <TokenTest />
            </ProtectedRoute>
          }
        />
        {/* Token 调试页面 - 不需要登录也能访问，方便调试 */}
        <Route path="/token-debug" element={<TokenDebug />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
