import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { googleProvider } from "../../config/firebase";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { setUserRole } from "../../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Xử lý đăng nhập bằng Google
  const handleLoginWithGoogle = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Lấy idToken từ Firebase User
      const idToken = await user.getIdToken();

      // Gửi idToken lên backend để xác thực
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/login-google",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Nếu backend không yêu cầu thêm thông tin, có thể để body rỗng
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);

        // Check if token and accountId exist
        const { role, account, token } = data;
        if (!token || !account || !account.accountId) {
          throw new Error("Unable to get user ID.");
        }

        // Save token and user info to localStorage
        const userInfo = {
          id: account.accountId,
          username: account.username,
          fullName: account.fullName,
          email: account.email,
          phone: account.phone,
          roleId: account.roleId,
          status: account.status,
          token: token,
        };

        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        localStorage.setItem("token", token);

        console.log("Stored userInfo:", localStorage.getItem("userInfo"));

        toast.success("Sign in with Google successfully!");

        // Redirect based on role
        if (role === 1) {
          navigate("/dashboard"); // Manager
        } else if (role === 5) {
          navigate("/"); // Customer
        } else if (role === 2) {
          navigate("/sales"); // Staff
        } else if (role === 3) {
          navigate("/consulting"); // Consulting
        } else if (role === 4) {
          navigate("/delivery"); // Delivery
        }
      } else {
        console.error("Failed to login:", response);
        toast.error("Sign in with Google failed. Please try again.");
      }
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

      const { role_id, token, user } = response.data;
      console.log("Role ID from login response:", role_id); // Thêm dòng này

      if (!token || !user || !user.accountId) {
        throw new Error("Unable to get user ID.");
      }

      const userInfo = {
        id: user.accountId,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleId: role_id,
        status: user.status,
        token: token,
      };

      if (role_id === 5) {
        userInfo.customerId = user.customer ? user.customer.customerId : null;
      }

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      localStorage.setItem("token", token);

      // Lưu vai trò người dùng
      setUserRole(role_id);
      console.log(
        "Role set in localStorage:",
        localStorage.getItem("userRole")
      ); // Thêm dòng này

      toast.success("Login successful!");

      // Điều hướng dựa trên vai trò người dùng
      switch (role_id) {
        case 1:
          navigate("/dashboard");
          break;
        case 2:
          navigate("/sales");
          break;
        case 3:
          navigate("/consulting");
          break;
        case 4:
          navigate("/delivery");
          break;
        case 5:
          navigate("/");
          break;
        default:
          navigate("/");
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
            Log In
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
