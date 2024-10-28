import React, { useState } from "react";
import { DesktopOutlined, FileOutlined, LogoutOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import ManageFarm from "../../pages/admin/manage-farm";
import ManageTrip from "../../pages/admin/manage-trip";
import ManageBooking from "../../pages/admin/manage-booking";
import ManageAccounts from "../../pages/admin/manage-accounts";
import ManageFeedback from "../../pages/admin/manage-feedback";
import ManageKoi from "../../pages/admin/manage-koi";
import "../dashboard/index.css"
import Diagram from "../../pages/admin/Diagram";

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
  getItem("Diagram", "Diagram", <DesktopOutlined />),
  getItem("Manage Booking", "Booking", <DesktopOutlined />),
  getItem("Manage Trip", "Trip", <FileOutlined />),
  getItem("Manage Farm", "Farm", <DesktopOutlined />),
  getItem("Manage Accounts", "Accounts", <DesktopOutlined />),
  getItem("Manage Feedback", "Feedback", <DesktopOutlined />),
  getItem("Manage Koi", "Koi", <DesktopOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderContent = () => {
    switch (selectedKey) {
      case "Diagram":
        return <Diagram />;
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
      case "Koi":
        return <ManageKoi />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  // Hàm để xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Assuming you store your token here
    // Redirect to the login page
    window.location.href = "/login"; // Navigate to the login page
  };

  return (
    <Layout className={`ant-layout-has-sider ${collapsed ? 'sider-collapsed' : ''}`}>
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
        <Header>
        <Button
            type="primary"
            icon={<LogoutOutlined />} // Icon logout
            onClick={handleLogout}
            style={{ float: "right" }} // Căn phải
          >
            Đăng xuất
          </Button>
        </Header>
        <Content>
          <div className="content-wrapper">
            {renderContent()}
          </div>
        </Content>
        <Footer>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
