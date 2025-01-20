import { useState } from 'react';
import { Button, Form, Input, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success('注册成功');
      navigate('/records');
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        注册
      </Title>
      <Form
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="userName"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="用户名" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            注册
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          已有账号？ <Link to="/login">立即登录</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Register;
