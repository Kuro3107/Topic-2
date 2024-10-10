import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../../config/firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";  // Đảm bảo file api.js đã được cấu hình đúng
import { LockOutlined, UserOutlined } from "@ant-design/icons";

function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Xử lý đăng nhập bằng Google
  const handleLoginWithGoogle = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user);
      toast.success("Đăng nhập với Google thành công!");
    } catch (error) {
      console.error("Lỗi đăng nhập với Google:", error);
      toast.error("Đăng nhập với Google thất bại. Vui lòng thử lại.");
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post("http://localhost:8080/api/v1/auth/login", values, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // Nhận user từ response
      const { role_id, token, user } = response.data;
  
      // Kiểm tra xem token và accountId có tồn tại không
      if (!token || !user || !user.accountId) {
        throw new Error("Không thể lấy được ID người dùng.");
      }
  
      // Lưu token và userInfo vào localStorage
      const userInfo = { id: user.accountId, username: user.username, fullName: user.fullName, email: user.email, phone: user.phone, roleId: user.roleId, status: user.status };
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
  
      toast.success("Đăng nhập thành công!");
  
      // Điều hướng dựa trên vai trò người dùng
      if (role_id === 1) { // Giả sử role_id 1 là manager
        navigate("/dashboard");
      } else if (role_id === 5) { // Giả sử role_id 5 là customer
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    }
  };
  
  
  

  return (
    <div className="wrapper">
      <AuthenTemplate>
        <h1 className="login-title">Login</h1>
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleLogin}>
          <div className="login-form">
          <Form.Item
  label="Username"
  name="username"  // Sửa thành "username" nếu backend yêu cầu
  rules={[{ required: true, message: "Vui lòng nhập username!" }]}
>
  <Input prefix={<UserOutlined />} placeholder="Username" />
</Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Mật khẩu"
              />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit">Đăng nhập</Button>
          <Button onClick={handleLoginWithGoogle}>Đăng nhập bằng Google</Button>
          <div>
            <Link to="/register">Chưa có tài khoản?</Link>
          </div>
          <div>
            <Link to="/">Quay lại trang chủ</Link>
          </div>
        </Form>
      </AuthenTemplate>
    </div>
  );
}

export default LoginPage;
