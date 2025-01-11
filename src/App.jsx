import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';

const { Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default App;
