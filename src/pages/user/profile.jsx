import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Button } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <h1><UserOutlined /> Thông tin cá nhân</h1>
        <div className="profile-info">
          <div className="info-item">
            <label><UserOutlined /> Họ và tên:</label>
            <span>{user.fullName || "Chưa cập nhật"}</span>
          </div>
          <div className="info-item">
            <label><MailOutlined /> Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <label><PhoneOutlined /> Số điện thoại:</label>
            <span>{user.phone}</span>
          </div>
          <div className="info-item">
            <label><LockOutlined /> Trạng thái tài khoản:</label>
            <span>{user.accountStatus}</span>
          </div>
        </div>
        <Button onClick={handleEdit} type="primary" className="edit-button" icon={<EditOutlined />}>
          Chỉnh sửa thông tin
        </Button>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
