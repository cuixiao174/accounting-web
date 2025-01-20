import { Outlet } from 'react-router-dom';
import { Layout, Row, Col } from 'antd';
import Sidebar from './components/Sidebar';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%', maxWidth: 1200 }}>
      <Row gutter={[24, 24]}>
        <Col span={20}>
          <Content
            style={{
              padding: '24px',
              background: '#fff',
              borderRadius: '8px',
              minHeight: 'calc(100vh - 48px)',
            }}
          >
            <Outlet />
          </Content>
        </Col>
      </Row>
    </Layout>
  );
}

export default App;
