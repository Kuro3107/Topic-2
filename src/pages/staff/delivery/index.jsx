import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, Form, Select, Button, Row, Col } from "antd";
import {
  LogoutOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "./index.css"; // Import file CSS

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

const bookingApi = "http://localhost:8080/api/bookings";

const Delivery = () => {
  const [bookingData, setBookingData] = useState(null);
  const [status, setStatus] = useState("");

  // Hàm dùng để gọi API lấy dữ liệu booking
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(bookingApi);
        const data = await response.json();
        if (response.ok) {
          setBookingData(data); // Gán dữ liệu lấy từ API vào state
          setStatus(data.status); // Gán trạng thái của đơn hàng
        } else {
          console.error("Lỗi khi lấy dữ liệu:", data);
        }
      } catch (error) {
        console.error("Có lỗi khi gọi API:", error);
      }
    };

    fetchData();
  }, []);

  // Hàm để xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token (hoặc bất kỳ thông tin đăng nhập nào)
    localStorage.removeItem("authToken"); // Giả sử bạn lưu token ở đây
    // Chuyển hướng về trang đăng nhập
    history.push("/login"); // Điều hướng về trang login
  };

  // Hàm để xử lý cập nhật trạng thái
  const handleUpdate = () => {
    console.log("Trạng thái đã được cập nhật:", status);
    alert(`Trạng thái cập nhật: ${status}`);
  };

  // Nếu chưa có dữ liệu, hiển thị 'Loading...'
  if (!bookingData) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="deli-header">
          Trang Giao Hàng
          <Button
            type="primary"
            icon={<LogoutOutlined />} // Icon logout
            onClick={handleLogout}
            style={{ float: "right" }} // Căn phải
          >
            Đăng xuất
          </Button>
        </Header>
        <Content className="deli-content">
          <div className="site-layout-background">
            <Row gutter={[16, 16]}>
              {/* Phần thông tin khách hàng */}
              <Col span={12}>
                <Card title="Thông Tin Khách Hàng">
                  <p>
                    <strong>Tên:</strong> {bookingData.fullname}
                  </p>
                  <p>
                    <strong>Email:</strong> {bookingData.email}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {bookingData.phone}
                  </p>
                </Card>
              </Col>

              {/* Phần chi tiết đơn hàng */}
              <Col span={12}>
                <Card title="Chi Tiết Đơn Hàng">
                  <p>
                    <strong>Ngày bắt đầu:</strong>{" "}
                    {new Date(bookingData.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Ngày kết thúc:</strong>{" "}
                    {new Date(bookingData.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Gói Koi Yêu Thích:</strong>{" "}
                    {bookingData.favoriteKoi}
                  </p>
                  <p>
                    <strong>Nông Trại Ưa Thích:</strong>{" "}
                    {bookingData.favoriteFarm}
                  </p>
                  <Form.Item label="Trạng thái">
                    <Select value={status} onChange={setStatus}>
                      <Option value="pending">Đang chờ</Option>
                      <Option value="approved">Đã phê duyệt</Option>
                      <Option value="completed">Hoàn tất</Option>
                    </Select>
                  </Form.Item>
                  <Button type="primary" onClick={handleUpdate}>
                    Cập nhật trạng thái
                  </Button>
                </Card>
              </Col>
            </Row>

            {/* Phần chi tiết chuyến đi */}
            <Row>
              <Col span={24}>
                <Card title="Chi Tiết Chuyến Đi">
                  <p>
                    <strong>Tiền báo giá:</strong>{" "}
                    {bookingData.quotedAmount
                      ? `${bookingData.quotedAmount} JPY`
                      : "Chưa có"}
                  </p>
                  <p>
                    <strong>Ngày báo giá:</strong>{" "}
                    {new Date(bookingData.quoteSentDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Ngày duyệt báo giá:</strong>{" "}
                    {bookingData.quoteApprovedDate
                      ? new Date(
                          bookingData.quoteApprovedDate
                        ).toLocaleDateString()
                      : "Chưa duyệt"}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {bookingData.status}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Được tạo bởi Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Delivery;
