import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    if (token && user_id) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          ...decoded,
          id: user_id,
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
      }
    }
    setLoading(false);
  }, []);

  // 修改后的登录函数（增加错误处理和token校验）
  const login = async (credentials) => {
    try {
      const res = await apiLogin(credentials);
      let response = res.content;

      // 检查响应中是否包含 token
      if (!response.token) {
        throw new Error('登录失败：服务器未返回令牌');
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user_id', response.user.id);
      const decoded = jwtDecode(response.token);

      // 验证 Token 是否过期
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        throw new Error('登录失败：令牌已过期');
      }

      setUser({
        ...decoded,
        id: response.user.id,
      });
      return decoded; // 返回解码后的用户信息
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
      throw error; // 抛出错误供UI层捕获
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiRegister(userData);
      let response = res.content; // 假设后端返回结构为 { code: 200, content: { token: 'xxx' } }

      // 检查必要字段
      if (!response?.token) {
        throw new Error('注册失败：服务器未返回令牌');
      }

      // 存储并验证 Token
      localStorage.setItem('token', response.token);
      localStorage.setItem('user_id', response.user.id);
      const decoded = jwtDecode(response.token);

      // 检查 Token 过期时间
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        throw new Error('注册失败：令牌已过期');
      }

      // 自动登录状态更新
      setUser({
        ...decoded,
        id: response.user.id,
      });
      return decoded; // 返回用户信息用于后续跳转
    } catch (error) {
      // 清理无效 Token 并抛出错误
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
