import { useState } from 'react';
import { Button, Form, Input, message, Typography, Tabs } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const credentials = {
        userName: values.userName,
        password: values.password,
      };

      if (isRegister) {
        await register({
          ...credentials,
          confirmPassword: values.confirmPassword,
        });
        message.success('注册成功，请登录');
        setIsRegister(false);
      } else {
        await login(credentials);
        message.success('登录成功');
        navigate('/records');
      }
    } catch (error) {
      message.error(error);
      message.error(
        error.response?.data?.message || (isRegister ? '注册失败' : '登录失败')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: '0 16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>记账系统登录</h1>
      <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
        {/* 用户名输入框 */}
        {!isRegister && (
          <>
            <Form.Item
              name="userName"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户名" style={{ color: '#000' }} />
            </Form.Item>
            {/* 密码输入框 */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" style={{ color: '#000' }} />
            </Form.Item>
          </>
        )}

        {/* 确认密码输入框（仅注册时显示） */}
        {isRegister && (
          <>
            <Form.Item
              name="userName"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input placeholder="用户名" style={{ color: '#000' }} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="密码" style={{ color: '#000' }} />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="确认密码" />
            </Form.Item>
          </>
        )}

        {/* 提交按钮 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {isRegister ? '注册' : '登录'}
          </Button>
        </Form.Item>

        {/* 切换登录/注册按钮 */}
        <Form.Item style={{ textAlign: 'center' }}>
          <Button type="link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? '已有账号？去登录' : '没有账号？立即注册'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;
