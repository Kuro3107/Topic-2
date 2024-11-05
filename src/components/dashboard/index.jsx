import React, { useState } from "react";
import { BarChartOutlined, CommentOutlined, ContainerOutlined, DatabaseOutlined, LogoutOutlined, ScheduleOutlined, ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import ManageFarm from "../../pages/admin/manage-farm";
import ManageTrip from "../../pages/admin/manage-trip";
import ManageBooking from "../../pages/admin/manage-booking";
import ManageAccounts from "../../pages/admin/manage-accounts";
import ManageFeedback from "../../pages/admin/manage-feedback";
import ManageKoi from "../../pages/admin/manage-koi";
import ManagePO from "../../pages/admin/manage-po";
import "../dashboard/index.css"
import Diagram from "../../pages/admin/Diagram";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  getItem("Diagram", "Diagram", <BarChartOutlined />),
  getItem("Manage Booking", "Booking", <ContainerOutlined />),
  getItem("Manage Trip", "Trip", <ScheduleOutlined />),
  getItem("Manage PO", "PO", <ShoppingOutlined />),
  getItem("Manage Farm", "Farm", <DatabaseOutlined />),
  getItem("Manage Koi", "Koi", <DatabaseOutlined />),
  getItem("Manage Accounts", "Accounts", <UserOutlined />),
  getItem("Manage Feedback", "Feedback", <CommentOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("userInfo") !== null;
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
      case "PO":
        return <ManagePO />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  // Hàm để xử lý đăng xuất
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      navigate("/");
      toast.success("Log out successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error when logging out:", error);
      toast.error("An error occurred while logging out. Please try again.");
    }
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
