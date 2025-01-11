import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { PieChartOutlined, UnorderedListOutlined } from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar() {
  const location = useLocation();

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
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="/records" icon={<UnorderedListOutlined />}>
          <Link to="/records">消费记录</Link>
        </Menu.Item>
        <Menu.Item key="/statistics" icon={<PieChartOutlined />}>
          <Link to="/statistics">消费统计</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default Sidebar;
