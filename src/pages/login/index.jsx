import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { googleProvider } from "../../config/firebase";
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
      toast.success("Sign in with Google successfully!");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Sign in with Google failed. Please try again.");
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post(
        "http://localhost:8080/api/v1/auth/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Nhận user từ response
      const { role_id, token, user } = response.data;
  
      // Kiểm tra xem token và accountId có tồn tại không
      if (!token || !user || !user.accountId) {
        throw new Error("Unable to get user ID.");
      }
  
      // Lưu token và userInfo vào localStorage
      const userInfo = {
        id: user.accountId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleId: user.roleId,
        status: user.status,
        token: token, // Thêm token vào userInfo
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo)); // Lưu toàn bộ userInfo bao gồm token
      localStorage.setItem("token", token);

      console.log("Stored userInfo:", localStorage.getItem("userInfo"));

  
      toast.success("Login successful!");
  
      // Điều hướng dựa trên vai trò người dùng
      if (role_id === 1) {
        navigate("/dashboard"); // Manager
      } else if (role_id === 5) {
        navigate("/"); // Customer
      } else if (role_id === 2) {
        navigate("/sales"); // Staff
      }
      
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your login information again.");
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
              name="username" // Sửa thành "username" nếu backend yêu cầu
              rules={[{ required: true, message: "Please enter username!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
          </div>

          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
          <Button onClick={handleLoginWithGoogle}>Sign in with Google</Button>
          <div>
            <Link to="/register">Do not have an account?</Link>
          </div>
          <div>
            <Link to="/">Back to home page</Link>
          </div>
        </Form>
      </AuthenTemplate>
    </div>
  );
}

export default LoginPage;
