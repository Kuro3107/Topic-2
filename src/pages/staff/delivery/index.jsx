import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Table,
  Button,
  Row,
  Col,
  Modal,
  Select,
  DatePicker,
} from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import moment from "moment"; // Import moment
import "./index.css"; // Import file CSS

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

const Delivery = () => {
  const [poData, setPoData] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPODetails, setSelectedPODetails] = useState([]);
  const [isPODetailsVisible, setIsPODetailsVisible] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [koiDeliveryDate, setKoiDeliveryDate] = useState(null);
  const [status, setStatus] = useState("");
  const [farms, setFarms] = useState([]);
  const [varieties, setVarieties] = useState([]);

  // Hàm fetch dữ liệu Farms và Varieties
  const fetchFarmsAndVarieties = async () => {
    try {
      const farmsResponse = await fetch("http://localhost:8080/api/farms");
      const farmsData = await farmsResponse.json();
      setFarms(farmsData);

      const varietiesResponse = await fetch(
        "http://localhost:8080/api/koi-varieties"
      );
      const varietiesData = await varietiesResponse.json();
      setVarieties(varietiesData);
    } catch (error) {
      console.error("Error calling farms or varieties API:", error);
    }
  };

  // Hàm fetch dữ liệu PO và Bookings
  const fetchData = async () => {
    try {
      const poResponse = await fetch("http://localhost:8080/api/pos");
      const poData = await poResponse.json();
      const bookingResponse = await fetch("http://localhost:8080/api/bookings");
      const bookingData = await bookingResponse.json();

      if (poResponse.ok && bookingResponse.ok) {
        const deliveringPOs = poData.filter(
          (po) => po.status === "delivering" || po.status === "delivered"
        );
        setPoData(deliveringPOs);
        setBookings(bookingData);
      } else {
        console.error("Error while retrieving data:", poData, bookingData);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API sau khi component mount
  useEffect(() => {
    fetchData();
    fetchFarmsAndVarieties();
  }, []);

  // Kết hợp thông tin từ bookings vào poData
  const combinedData = poData.map((po) => {
    const booking = bookings.find((b) => b.poId === po.poId);
    return {
      ...po,
      fullname: booking ? booking.fullname : "Unknown",
      phone: booking ? booking.phone : "Unknown",
      email: booking ? booking.email : "Unknown",
    };
  });

  // Hàm xử lý khi xem PODetails
  const handleViewPODetails = async (poId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/podetails/po/${poId}`
      );
      const podetails = await response.json();

      if (response.ok) {
        // Không cần tìm variety và farm nữa vì đã có trong response
        const updatedPODetails = podetails.map((podetail) => ({
          ...podetail,
          varietyName: podetail.variety?.varietyName || "N/A",
          farmName: podetail.farm?.farmName || "N/A",
        }));

        setSelectedPODetails(updatedPODetails);
        setIsPODetailsVisible(true);
      } else {
        console.error("Error fetching PODetails:", podetails);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (po) => {
    setSelectedPO(po);
    setKoiDeliveryDate(po.koiDeliveryDate ? moment(po.koiDeliveryDate) : null);
    setStatus(po.status);
    setIsEditVisible(true);
  };

  const handleUpdate = async () => {
    try {
      const updatedPO = {
        ...selectedPO,
        koiDeliveryDate: koiDeliveryDate ? koiDeliveryDate.toISOString() : null,
        status: status,
      };

      const response = await fetch(
        `http://localhost:8080/api/pos/${selectedPO.poId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPO),
        }
      );

      if (response.ok) {
        const updatedPOs = poData.map((po) =>
          po.poId === selectedPO.poId ? updatedPO : po
        );
        setPoData(updatedPOs);
        setIsEditVisible(false);
      } else {
        console.error("Error while updating PO:", await response.json());
      }
    } catch (error) {
      console.error("Error while get API:", error);
    }
  };

  const handleCloseEdit = () => {
    setIsEditVisible(false);
  };

  const handleClosePODetails = () => {
    setIsPODetailsVisible(false);
  };

  // Hàm để xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Assuming you store your token here
    // Redirect to the login page
    window.location.href = "/login"; // Navigate to the login page
  };

  // Hiển thị loading nếu dữ liệu chưa được tải
  if (loading) {
    return <div>Loading data...</div>;
  }
  // Define the columns for the table
  const columns = [
    { title: "PO ID", dataIndex: "poId", key: "poId" },
    { title: "Full Name", dataIndex: "fullname", key: "fullname" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    {
      title: "Koi Delivery Date",
      dataIndex: "koiDeliveryDate",
      key: "koiDeliveryDate",
      render: (date) => (date ? moment(date).format("DD/MM/YYYY") : "Chưa có"),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewPODetails(record.poId)}>
            Xem PODetails
          </Button>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
        </>
      ),
    },
  ];

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
        </Menu>
      </Sider>
      <Layout>
        <Header className="deli-header">
          <h5>Order details</h5>
          <Button
            type="primary"
            icon={<LogoutOutlined />} // Icon logout
            onClick={handleLogout}
            style={{ float: "right" }} // Căn phải
          >
            Logout
          </Button>
        </Header>
        <Content className="deli-content">
          <div className="site-layout-background">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="List of Orders in Delivery">
                  <Table
                    dataSource={combinedData}
                    columns={columns}
                    rowKey="poId"
                    pagination={false}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          © 2024 LOOKOI. TRUST ALWAYS COMES FIRST.
        </Footer>
      </Layout>

      {/* Modal chỉnh sửa PODetails */}
      <Modal
        title="Chỉnh sửa PODetails"
        visible={isEditVisible}
        onCancel={handleCloseEdit}
        footer={[
          <Button key="cancel" onClick={handleCloseEdit}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <div>
          <label>Koi Delivery Date:</label>
          <DatePicker
            value={koiDeliveryDate}
            onChange={(date) => setKoiDeliveryDate(date)}
            style={{ width: "100%", marginBottom: "10px" }}
            format="DD/MM/YYYY" // Định dạng ngày trong DatePicker
          />
          <label>Status:</label>
          <Select value={status} onChange={setStatus} style={{ width: "100%" }}>
            <Option value="delivering">delivering</Option>
            <Option value="delivered">delivered</Option>
            <Option value="deny">deny</Option>
          </Select>
        </div>
      </Modal>

      {/* Modal hiển thị PODetails */}
      <Modal
        title="Chi Tiết PODetails"
        visible={isPODetailsVisible}
        onCancel={handleClosePODetails}
        footer={[
          <Button key="ok" type="primary" onClick={handleClosePODetails}>
            OK
          </Button>,
        ]}
      >
        <Table
          dataSource={selectedPODetails}
          columns={[
            { title: "Variety", dataIndex: "varietyName", key: "varietyName" },
            { title: "Farm", dataIndex: "farmName", key: "farmName" },
            { title: "Quantity", dataIndex: "quantity", key: "quantity" },
            { title: "Deposit", dataIndex: "deposit", key: "deposit" },
            {
              title: "Remaining Price",
              dataIndex: "remainingPrice",
              key: "remainingPrice",
            },
            {
              title: "Total Koi Price",
              dataIndex: "totalKoiPrice",
              key: "totalKoiPrice",
            },
            { title: "Day", dataIndex: "day", key: "day" },
          ]}
          rowKey="poDetailId"
          pagination={false}
        />
      </Modal>
    </Layout>
  );
};

export default Delivery;
