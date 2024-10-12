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
    const fetchUserInfo = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const parsedUserData = JSON.parse(userInfo);
          setParsedUser(parsedUserData);

          if (!parsedUserData.id) {
            toast.error("ID người dùng không tồn tại.");
            return;
          }

          if (parsedUserData.token) {
            const response = await api.get("/accounts", {
              headers: { Authorization: `Bearer ${parsedUserData.token}` },
            });
            setUser(response.data);
          } else {
            setUser(parsedUserData);
          }

          const ordersResponse = await api.get("/booking", {
            headers: { Authorization: `Bearer ${parsedUser.token}` },
          });
          setOrders(ordersResponse.data);
        } else {
          toast.warning("Vui lòng đăng nhập để xem thông tin cá nhân.");
          navigate("/login");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải thông tin. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleCancelOrder = async (tripId) => {
    try {
      await api.delete(`/booking/${tripId}`, {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      });
      toast.success("Đơn hàng đã được hủy thành công.");
      setOrders(orders.filter((trip) => trip.id !== tripId));
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
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
        message.success("Cập nhật hình ảnh thành công!");
      } catch (error) {
        message.error("Có lỗi xảy ra khi cập nhật hình ảnh.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <p>Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.</p>
        <Button onClick={() => navigate("/login")} type="primary">
          Đăng nhập
        </Button>
      </div>
    );
  }

  // Table columns
  const columns = [
    {
      title: "No",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1, // Display order index
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total) => `${total} VND`, // Format as currency
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <>
          <Button
            onClick={() => handleViewBooking(record.id)}
            icon={<ShoppingOutlined />}
            style={{ marginRight: 8 }}
          >
            Xem lại
          </Button>
          <Button onClick={() => handleCancelOrder(record.id)} danger>
            Hủy
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
                <UserOutlined /> Thông tin tài khoản
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
              Chỉnh sửa thông tin
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
              <Button icon={<EditOutlined />}>Chỉnh sửa ảnh</Button>
            </Upload>
            <InfoItem
              icon={<UserOutlined />}
              label="Họ và tên"
              value={user.fullName || "Chưa cập nhật"}
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
              label="Số điện thoại"
              value={user.phone || "N/A"}
            />
            <InfoItem
              icon={<LockOutlined />}
              label="Trạng thái tài khoản"
              value={user.status || "N/A"}
            />
            <InfoItem
              icon={<UserOutlined />}
              label="Vai trò"
              value={user.roleId ? roleMapping[user.roleId] : "N/A"}
            />
          </div>
        </Card>

        <Card
          title={
            <h2>
              <ShoppingOutlined /> Đơn hàng của bạn
            </h2>
          }
        >
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={false}
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
