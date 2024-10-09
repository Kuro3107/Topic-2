import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button, Spin, Card } from "antd";
import PropTypes from "prop-types";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EditOutlined,
  IdcardOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import "./profile.css";
import api from "../../config/axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          if (parsedUser.token) {
            // Nếu có token, sử dụng nó để lấy thông tin người dùng từ server
            const response = await api.get("https://66ffe95a4da5bd2375527007.mockapi.io/User", {
              headers: { Authorization: `Bearer ${parsedUser.token}` }
            });
            setUser(response.data);
            // Gọi API để lấy danh sách đơn hàng của người dùng
            const ordersResponse = await api.get("https://66ffe95a4da5bd2375527007.mockapi.io/Booking", {
              headers: { Authorization: `Bearer ${parsedUser.token}` }
            });
            setOrders(ordersResponse.data); // Lưu danh sách đơn hàng vào state
          } else {
            setUser(parsedUser);
          }
          console.log("Thông tin người dùng:", parsedUser); // Log để debug
        } else {
          toast.warning("Vui lòng đăng nhập để xem thông tin cá nhân.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
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

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <Card title={<h1><UserOutlined /> Thông tin cá nhân</h1>} extra={<Button onClick={handleEdit} type="primary" icon={<EditOutlined />}>Chỉnh sửa thông tin</Button>}>
          <div className="profile-info">
            <InfoItem icon={<IdcardOutlined />} label="ID" value={user.id ? user.id.toString() : "N/A"} />
            <InfoItem icon={<UserOutlined />} label="Họ và tên" value={user.fullName || "Chưa cập nhật"} />
            <InfoItem icon={<MailOutlined />} label="Email" value={user.email || "N/A"} />
            <InfoItem icon={<PhoneOutlined />} label="Số điện thoại" value={user.phone || "N/A"} />
            <InfoItem icon={<LockOutlined />} label="Trạng thái tài khoản" value={user.accountStatus || "N/A"} />
            <InfoItem icon={<UserOutlined />} label="Vai trò" value={user.role || "N/A"} />
          </div>
          <div className="debug-info">
            <h3>Debug Information:</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
        </Card>

        {/* Thêm phần hiển thị danh sách đơn hàng */}
        <Card title={<h2><ShoppingOutlined /> Đơn hàng của bạn</h2>}>
          {orders.length > 0 ? (
            <ul className="orders-list">
              {orders.map((order) => (
                <li key={order.id} className="order-item">
                  <p>Order ID: {order.id}</p>
                  <p>Loại cá: {order.favoriteKoi.join(", ")}</p>
                  <p>Trang trại: {order.favoritefarm.join(", ")}</p>
                  <p>Ngày bắt đầu: {order.startDate}</p>
                  <p>Ngày kết thúc: {order.endDate}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Bạn chưa có đơn hàng nào.</p>
          )}
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
