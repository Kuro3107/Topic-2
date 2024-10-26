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

        // Lấy idToken từ Firebase User
        const idToken = await user.getIdToken();

        // Gửi idToken lên backend để xác thực
        const response = await fetch("http://localhost:8080/api/v1/auth/login-google", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${idToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}), // Nếu backend không yêu cầu thêm thông tin, có thể để body rỗng
        });

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

      // Chỉ thêm customerId nếu role là customer
      if (role_id === 5) { // Giả sử role_id 5 là customer
        userInfo.customerId = user.customer ? user.customer.customerId : null; // Kiểm tra user.customer có tồn tại không
      }

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
     else if (role_id === 3) {
      navigate("/consulting"); // Staff
    }
    else if (role_id === 4) {
      navigate("/delivery"); // Delivery
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
