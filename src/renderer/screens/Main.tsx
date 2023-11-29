import React, { useState, useMemo } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Cashfund from '../components/Cashfund';
import Products from '../components/Products';
import Inventory from '../components/Inventory';
import Reports from '../components/Reports';
import Settings from '../components/Settings';
import Order from '../components/Order';
import Dashboard from '../components/Dashboard';
import Shops from '../components/Shops';
import Customers from '../components/Customers';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [component, setComponent] = useState(<Cashfund />);
  const { colorBgContainer } = theme.useToken().token;

  const sideBarItems = [
    { icon: UserOutlined, label: 'Dashboard' },
    { icon: UserOutlined, label: 'Cashfund' },
    { icon: UserOutlined, label: 'Products' },
    { icon: UserOutlined, label: 'Inventory' },
    { icon: UserOutlined, label: 'Order' },
    { icon: UserOutlined, label: 'Reports' },
    { icon: UserOutlined, label: 'Customers' },
    { icon: UserOutlined, label: 'Shops' },
    { icon: UserOutlined, label: 'Settings' },
  ];

  const handleMenuClick = (item) => {
    const components = {
      Dashboard: <Dashboard />,
      Cashfund: <Cashfund />,
      Products: <Products />,
      Inventory: <Inventory />,
      Order: <Order />,
      Reports: <Reports />,
      Customers: <Customers />,
      Shops: <Shops />,
      Settings: <Settings />,
    };
    setComponent(components[item.label]);
  };

  const menuItems = useMemo(
    () =>
      sideBarItems.map((item, index) => ({
        key: String(index + 1),
        icon: React.createElement(item.icon),
        label: item.label,
        onClick: () => handleMenuClick(item),
      })),
    [sideBarItems],
  );

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
        style={{
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: '#fff',
          paddingTop: '24px',
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {component}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', position: 'fixed', bottom: 0 }}>
          BotikaTech ©2023
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
