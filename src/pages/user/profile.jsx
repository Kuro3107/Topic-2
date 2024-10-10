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
} from "@ant-design/icons";
import "./profile.css";
import api from "../../config/axios";
import { Upload, message } from "antd"; // Thêm import cho Upload

const defaultImageUrl = "/istockphoto-1495088043-612x612.jpg"; // Đường dẫn đến hình ảnh mặc định

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedUser, setParsedUser] = useState(null); // Thêm trạng thái để lưu parsedUser
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = localStorage.getItem("userInfo");
        console.log("User Info from localStorage:", userInfo); // Kiểm tra giá trị của userInfo
        if (userInfo) {
          const parsedUserData = JSON.parse(userInfo);
          setParsedUser(parsedUserData); // Lưu parsedUser vào trạng thái
          
          // Kiểm tra xem parsedUserData có chứa id hay không
          if (!parsedUserData.id) {
            toast.error("ID người dùng không tồn tại.");
            return;
          }
  
          if (parsedUserData.token) {
            const response = await api.get("/accounts", {
              headers: { Authorization: `Bearer ${parsedUserData.token}` }
            });
            setUser(response.data);
          } else {
            setUser(parsedUserData);
          }
          console.log("Thông tin người dùng:", parsedUserData);
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

  const roleMapping = {
    1: "Manager",
    2: "Sale Staff",
    3: "Consultant Staff",
    4: "Delivery Staff",
    5: "Customer",
  };

  const handleImageChange = async (info) => {
    if (info.file.status === "done") {
      if (!parsedUser || !parsedUser.id) {
        message.error("Không thể xác định người dùng.");
        return;
      }
      const newImageUrl = info.file.response.url; // Giả sử API trả về URL hình ảnh
      setUser((prevUser) => ({ ...prevUser, imageUrl: newImageUrl }));

      // Cập nhật hình ảnh trong cơ sở dữ liệu
      try {
        await api.put(`/api/accounts/${parsedUser.id}/image`, { // Sử dụng parsedUser từ trạng thái
          imageUrl: newImageUrl,
        }, {
          headers: { Authorization: `Bearer ${parsedUser.token}` }
        });
        message.success("Cập nhật hình ảnh thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật hình ảnh:", error);
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

  return (
    <div className="profile-page">
      <Header />
      <main className="profile-content">
        <Card title={<div className="card-header"><h1><UserOutlined /> Thông tin tài khoản</h1></div>} extra={<Button className="edit-button" onClick={handleEdit} type="primary" icon={<EditOutlined />}>Chỉnh sửa thông tin</Button>}>
          <div className="profile-info">
            {user.imageUrl ? (
              <img src={user.imageUrl} alt="Profile" className="profile-image" />
            ) : (
              <img src={defaultImageUrl} alt="Default Profile" className="profile-image" />
            )}
            <Upload
              name="image"
              action={`/api/accounts/${parsedUser.id}/image`} // Đường dẫn đến API tải lên hình ảnh
              showUploadList={false}
              onChange={handleImageChange}
              accept="image/*"
            >
              <Button icon={<EditOutlined />}>Chỉnh sửa ảnh</Button>
            </Upload>
            <InfoItem icon={<UserOutlined />} label="Họ và tên" value={user.fullName || "Chưa cập nhật"} />
            <InfoItem icon={<UserOutlined />} label="Username" value={user.username || "N/A"} />
            <InfoItem icon={<MailOutlined />} label="Email" value={user.email || "N/A"} />
            <InfoItem icon={<PhoneOutlined />} label="Số điện thoại" value={user.phone || "N/A"} />
            <InfoItem icon={<LockOutlined />} label="Trạng thái tài khoản" value={user.status || "N/A"} />
            <InfoItem icon={<UserOutlined />} label="Vai trò" value={user.roleId ? roleMapping[user.roleId] : "N/A"} />
          </div>
          {/* Ẩn phần Debug Information */}
          {/* <div className="debug-info">
            <h3>Debug Information:</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div> */}
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