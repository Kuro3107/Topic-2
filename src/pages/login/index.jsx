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

  const handleLoginWithGoogle = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user);
      toast.success("Đăng nhập với Google thành công!");
      // Xử lý đăng nhập thành công
    } catch (error) {
      console.error("Lỗi đăng nhập với Google:", error);
      toast.error("Đăng nhập với Google thất bại. Vui lòng thử lại.");
    }
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post("/login", values);
      console.log(response);
      const { role, token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userInfo", JSON.stringify(user));

      toast.success("Đăng nhập thành công!");

      if (role === "ADMIN") {
        navigate("/dashboard");
      } else if (role === "CUSTOMER") {
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập."
        );
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
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
            </Form.Item>
            <Form.Item
              label ="Mật khẩu"
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

          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
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
