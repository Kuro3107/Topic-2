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

  // Xử lý đăng nhập thông qua API backend
  const handleLogin = async (values) => {
    console.log({
      "username": "yourUsername",
      "password": "yourPassword"
    });  // Kiểm tra giá trị của form trước khi gửi
    try {
      const response = await api.post("http://localhost:8080/api/v1/auth/login", values, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
        // Đảm bảo endpoint đúng
      console.log(response);
      const { role_id, token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      toast.success("Đăng nhập thành công!");

      // Điều hướng dựa trên vai trò người dùng
      if (role_id == 1) {
        navigate("/dashboard");
      } else if (role_id == 5) {
        navigate("/");
      }
    }  catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response && error.response.data) {
        console.log("Chi tiết lỗi từ backend:", error.response.data);  // Thêm dòng này
        toast.error(error.response.data.message || "Đăng nhập thất bại");
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      }
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
