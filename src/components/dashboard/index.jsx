import React, { useState } from "react";
import { DesktopOutlined, FileOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import ManageFarm from "../../pages/admin/manage-farm";
import ManageTrip from "../../pages/admin/manage-trip";
import ManageBooking from "../../pages/admin/manage-booking";
import ManageAccounts from "../../pages/admin/manage-accounts";
import ManageFeedback from "../../pages/admin/manage-feedback";

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
  getItem("Manage Booking", "Booking", <DesktopOutlined />),
  getItem("Manage Trip", "Trip", <FileOutlined />),
  getItem("Manage Farm", "Farm", <DesktopOutlined />),
  getItem("Manage Accounts", "Accounts", <DesktopOutlined />),
  getItem("Manage Feedback", "Feedback", <DesktopOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedKey) {
      case "Farm":
        return <ManageFarm />;
      case "Trip":
        return <ManageTrip />;
      case "Booking":
        return <ManageBooking />;
      case "Accounts":
        return <ManageAccounts />;
      case "Feedback":
        return <ManageFeedback />;
      // Thêm các case khác cho các menu item khác nếu cần
      default:
        return <div>Select a menu item</div>;
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
        <Header />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb></Breadcrumb>
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
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
