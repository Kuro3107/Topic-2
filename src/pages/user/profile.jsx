import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button, Spin, Card, Table } from "antd";
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

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedUser, setParsedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect is running"); // Kiểm tra useEffect có chạy không
    const fetchUserInfo = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const parsedUserData = JSON.parse(userInfo);
          setParsedUser(parsedUserData);
  
          if (!parsedUserData.id) {
            toast.error("User ID does not exist.");
            return;
          }
  
          // Kiểm tra token trước khi gọi API
          if (parsedUserData.token) {
            // Giả sử API đã trả về thông tin account cùng với bookings
const response = await api.get(`/accounts/${parsedUserData.id}`, {
  headers: { Authorization: `Bearer ${parsedUserData.token}` },
});

if (response.data && response.data.customer && response.data.customer.bookings && response.data.customer.bookings.length) {
  const bookings = response.data.customer.bookings;
  console.log("Bookings:", bookings);
  setOrders(bookings);
  console.log("Orders:", orders); // Kiểm tra giá trị orders

} else {
  toast.error("No bookings found for this user.");
}
          } else {
            setUser(parsedUserData);
          }
        } else {
          toast.warning("Please login to view personal information.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user info:", error); // Log lỗi nếu có
        toast.error("An error occurred while fetching user information.");
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };
  
    fetchUserInfo();
  }, [navigate]);
  

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleCancelOrder = async (tripId) => {
    try {
      await api.delete(`/bookings/${tripId}`, {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      });
      toast.success("Order was canceled successfully.");
      setOrders(orders.filter((trip) => trip.id !== tripId));
    } catch (error) {
      toast.error("An error occurred while canceling the order.");
    }
  };

  const handleViewBooking = (orderId) => {
    navigate(`/booking/${orderId}`); // Điều hướng đến trang xem chi tiết booking
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
      // render: (_, __, index) => index + 1, // Display order index
    },
    {
      title: "Booking Date",
      dataIndex: "startDate", // Cập nhật để lấy startDate
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(), // Định dạng ngày
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Full Name",
      dataIndex: "fullname", // Cập nhật để lấy fullname
      key: "fullname",
    },
    {
      title: "Phone",
      dataIndex: "phone", // Cập nhật để lấy phone
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email", // Cập nhật để lấy email
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button
            onClick={() => handleViewBooking(record.bookingId)} // Sử dụng bookingId
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
          <Table
            columns={columns} 
            dataSource={orders} 
            rowKey="bookingId" // Sử dụng bookingId làm khóa cho từng dòng
          />
        </Card>
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
