import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button, Spin, Card, Table, Modal } from "antd";
import PropTypes from "prop-types";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EditOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import "./profile.css";
import api from "../../config/axios";
import { Upload, message } from "antd"; // Thêm import cho Upload

const defaultImageUrl = "/istockphoto-1495088043-612x612.jpg"; // Đường dẫn đến hình ảnh mặc định
// Thêm state cho modal

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedUser, setParsedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const apiAccountBaseUrl = "http://localhost:8080/api/accounts/"; // Địa chỉ API
  const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

  

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
  try {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo) {
      const parsedUserData = JSON.parse(userInfo);
      setParsedUser(parsedUserData); // Cập nhật trạng thái parsedUser

      if (!parsedUserData.id) {
        toast.error("User ID does not exist.");
        return;
      }

      const apiAccount = `${apiAccountBaseUrl}${parsedUserData.id}`;
      console.log("Calling API with URL:", apiAccount);
      
      const response = await api.get(apiAccount);
      console.log("API Response:", response.data);

      if (response.data) {
        const customerData = response.data.customer; // Trích xuất thông tin khách hàng

        // Cập nhật user với thông tin từ API
        setUser({
          fullName: response.data.fullName || "Not Updated!",
          username: response.data.username || "N/A",
          email: response.data.email || "N/A",
          phone: response.data.phone || "N/A",
          status: response.data.status || "N/A",
          roleId: response.data.roleId || "N/A",
          imageUrl: response.data.imageUrl || defaultImageUrl, // Dùng hình ảnh mặc định nếu không có
        });
        
        const bookings = customerData.bookings || []; // Lấy danh sách booking từ phản hồi
        console.log("Bookings:", bookings);
        setOrders(bookings); // Cập nhật orders với bookings
        console.log("Updated Orders:", bookings); // Xem giá trị orders sau khi cập nhật
      } else {
        toast.error("No bookings found for this user.");
      }
    } else {
      toast.warning("Please login to view personal information.");
      navigate("/login");
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    toast.error("An error occurred while fetching user information.");
  } finally {
    setLoading(false);
  }
    };
  
    fetchUserInfo();
  }, [navigate]);
  
  console.log("Rendering Orders:", orders); // Log để kiểm tra orders
  

  useEffect(() => {
    console.log("Orders:", orders); // Kiểm tra giá trị orders sau khi cập nhật
  }, [orders]);
  
  

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleCancelOrder = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      });
      toast.success("Order was canceled successfully.");
      setOrders(orders.filter((order) => order.bookingId !== bookingId)); // Cập nhật lại danh sách orders
    } catch (error) {
      toast.error("An error occurred while canceling the order.");
    }
  };

  const handleViewBooking = (orderId) => {
    const bookingDetails = orders.find((order) => order.bookingId === orderId);
    setSelectedBooking(bookingDetails); // Lưu thông tin booking vào state
    setIsModalVisible(true); // Hiển thị modal
  };

  // Hàm để đóng modal
const handleCloseModal = () => {
  setIsModalVisible(false);
  setSelectedBooking(null); // Đặt lại state khi đóng modal
};

  const roleMapping = {
    1: "Manager",
    2: "Sale Staff",
    3: "Consultant Staff",
    4: "Delivery Staff",
    5: "Customer",
  };

  const handleImageChange = async (info) => {
    if (info.file.status === "done") {
      const newImageUrl = info.file.response.url;
      setUser((prevUser) => ({ ...prevUser, imageUrl: newImageUrl }));

      try {
        await api.put(
          `/api/accounts/${parsedUser.id}/image`,
          { imageUrl: newImageUrl },
          { headers: { Authorization: `Bearer ${parsedUser.token}` } }
        );
        message.success("Image updated successfully!");
      } catch (error) {
        message.error("An error occurred while updating the image.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading information...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <p>Unable to load user information. Please log in again.</p>
        <Button onClick={() => navigate("/login")} type="primary">
          Log in
        </Button>
      </div>
    );
  }

  // Table columns
  const columns = [
    {
      title: "No",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A', // Định dạng ngày, kiểm tra null
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button
            onClick={() => handleViewBooking(record.bookingId)}
            icon={<ShoppingOutlined />}
            style={{ marginRight: 8 }}
          >
            Xem lại
          </Button>
          <Button onClick={() => handleCancelOrder(record.bookingId)} danger>
            Cancel
          </Button>
        </>
      ),
    },
  ];
  

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <Card
          title={
            <div className="card-header">
              <h1>
                <UserOutlined /> Account information
              </h1>
            </div>
          }
          extra={
            <Button
              className="edit-button"
              onClick={handleEdit}
              type="primary"
              icon={<EditOutlined />}
            >
              Edit information
            </Button>
          }
        >
          <div className="profile-info">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <img
                src={defaultImageUrl}
                alt="Default Profile"
                className="profile-image"
              />
            )}
            <Upload
              name="image"
              action={`/api/accounts/${parsedUser.id}/image`}
              showUploadList={false}
              onChange={handleImageChange}
              accept="image/*"
            >
              <Button icon={<EditOutlined />}>Photo editing</Button>
            </Upload>
            <InfoItem
              icon={<UserOutlined />}
              label="fullName"
              value={user.fullName || "Not Updated!"}
            />
            <InfoItem
              icon={<UserOutlined />}
              label="Username"
              value={user.username || "N/A"}
            />
            <InfoItem
              icon={<MailOutlined />}
              label="Email"
              value={user.email || "N/A"}
            />
            <InfoItem
              icon={<PhoneOutlined />}
              label="Phone"
              value={user.phone || "N/A"}
            />
            <InfoItem
              icon={<LockOutlined />}
              label="Status"
              value={user.status || "N/A"}
            />
            <InfoItem
              icon={<UserOutlined />}
              label="Role"
              value={user.roleId ? roleMapping[user.roleId] : "N/A"}
            />
          </div>
        </Card>

        <Card title={<h2><ShoppingOutlined /> Your Order</h2>}>
        <div>
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={orders} // Đảm bảo sử dụng orders ở đây
          rowKey="bookingId"
        />
      )}
    </div>
        </Card>
<Modal
  title="Booking Details"
  visible={isModalVisible}
  onCancel={handleCloseModal}
  footer={[
    <Button key="close" onClick={handleCloseModal}>
      Đóng
    </Button>,
  ]}
>
  {selectedBooking && (
    <div>
      <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
      <p><strong>Booking Date:</strong> {new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
      <p><strong>Full Name:</strong> {selectedBooking.fullname}</p>
      <p><strong>Email:</strong> {selectedBooking.email}</p>
      <p><strong>Phone:</strong> {selectedBooking.phone}</p>
      <p><strong>Start Date:</strong> {new Date(selectedBooking.startDate).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(selectedBooking.endDate).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {selectedBooking.status}</p>
      <p><strong>Favorite Farms:</strong> {selectedBooking.favoriteFarm}</p>
      <p><strong>Favorite Koi:</strong> {selectedBooking.favoriteKoi}</p>
      <p><strong>Note:</strong> {selectedBooking.note}</p>
    </div>
  )}
</Modal>
      </main>
      <Footer />
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">
    <label>
      {icon} {label}:
    </label>
    <span>{value}</span>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Profile;
