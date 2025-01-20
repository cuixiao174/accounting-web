import { Layout, Menu, Avatar, Typography, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  PieChartOutlined,
  UnorderedListOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Sider } = Layout;
const { Text } = Typography;

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sider
      width={200}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Avatar
          size="large"
          style={{ backgroundColor: '#1890ff', marginBottom: 8 }}
        >
          {user?.userName?.charAt(0).toUpperCase()}
        </Avatar>
        <Text strong style={{ color: '#fff', display: 'block' }}>
          {user?.userName}
        </Text>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ flex: 1, borderRight: 0 }}
      >
        <Menu.Item key="/records" icon={<UnorderedListOutlined />}>
          <Link to="/records">消费记录</Link>
        </Menu.Item>
        <Menu.Item key="/statistics" icon={<PieChartOutlined />}>
          <Link to="/statistics">消费统计</Link>
        </Menu.Item>
      </Menu>

      <div style={{ padding: 16 }}>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{ color: '#fff', width: '100%' }}
        >
          退出登录
        </Button>
      </div>
    </Sider>
  );
}

export default Sidebar;
