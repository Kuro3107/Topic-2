import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import ManageFarm from "../../pages/admin/manage-farm";
import ManageTrip from "../../pages/admin/manage-trip";
import ManageBooking from "../../pages/admin/manage-booking";
import ManageAccounts from "../../pages/admin/manage-accounts";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />),
  getItem("Manage Accounts", "2", <TeamOutlined />),
  getItem("Manage Booking", "3", <DesktopOutlined />),
  getItem("Manage Trip", "4", <FileOutlined />),
  getItem("Manage Farm", "5", <DesktopOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedKey) {
      case "2":
        return <ManageAccounts />;
      case "3":
        return <ManageBooking />;
      case "4":
        return <ManageTrip />;
      case "5":
        return <ManageFarm />;
      default:
        return <div>Welcome to the Dashboard</div>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onSelect={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Koi Farm Management System ©2023 Created by Your Company
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
