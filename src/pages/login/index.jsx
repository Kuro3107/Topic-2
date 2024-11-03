import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input, message, Modal } from "antd";
import { getAuth, signInWithPopup } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { googleProvider } from "../../config/firebase";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { setUserRole } from "../../utils/auth";
import React, { useState } from 'react';

function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);
  const [username, setUsername] = useState("");
  // State cho form login
const [loginForm] = Form.useForm();

// State cho modal forget password
const [forgotPasswordForm] = Form.useForm();
// State cho form "Login"
const [loginUsername, setLoginUsername] = useState("");

// State cho form "Forgot Password"
const [forgotPasswordUsername, setForgotPasswordUsername] = useState("");

// State lưu trữ username đã xác thực
const [validatedUsername, setValidatedUsername] = useState("");


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
        toast.error("Sign in with Google failed. Email Not Found.");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Sign in with Google failed. Email Not Found.");
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

  // Show the "Forgot Password" modal
  const showForgotPasswordModal = () => {
    setIsModalVisible(true);
    setUsernameExists(false); // Reset state when opening the modal
  };

  // Hide the modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setUsername("");
  };

  // Check if username exists in the database
  // Cập nhật state sau khi kiểm tra username thành công
const checkUsername = async (username) => {
  try {
    const response = await fetch(`http://localhost:8080/api/accounts/check-username?username=${encodeURIComponent(username)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const exists = await response.json();
      if (exists) {
        console.log("Username exists:", exists);
        message.success("Username exists");
        setValidatedUsername(username); // Lưu lại username đã xác thực
        setUsernameExists(true); // Hiển thị form nhập mật khẩu mới
      }
    } else {
      console.error("Error checking username:", response.statusText);
      message.error("Username Not Found")
    }
  } catch (error) {
    console.error("Error during fetch:", error);
  }
};
  

  const handleCheckUsername = async () => {
    try {
      await forgotPasswordForm.validateFields(['username']); // Kiểm tra form trước khi lấy giá trị
      const formValues = forgotPasswordForm.getFieldsValue();
      console.log("Current form values:", formValues);
  
      const username = formValues.username;
      console.log("Username being checked:", username);
  
      if (username) {
        await checkUsername(username);
      } else {
        console.warn("Username is empty");
        message.error("Username Not Found")
      }
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Username Not Found")
    }
  };

  // Handle password reset after username validation
  // Sử dụng state validatedUsername khi gửi yêu cầu đặt lại mật khẩu
const handlePasswordReset = async (values) => {
  console.log("Password reset form submitted:", values);
  try {
    const response = await fetch(
      "http://localhost:8080/api/accounts/reset-password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: validatedUsername, newPassword: values.newPassword }),
      }
    );
    if (response.ok) {
      console.log("Password reset successful");
      message.success("Password reset successful");
      setIsModalVisible(false);
    } else {
      throw new Error("Password reset failed");
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    message.error("Password reset failed")
  }
};

  return (
    <div className="wrapper">
      <AuthenTemplate>
        <h1 className="login-title">Login</h1>
        <Form form={loginForm} labelCol={{ span: 24 }} onFinish={handleLogin}>
          <div className="login-form">
          <Form.Item
    label="Username"
    name="username"
    rules={[{ required: true, message: "Please enter username!" }]}
  >
    <Input
      prefix={<UserOutlined />}
      placeholder="Username"
      value={loginUsername}
      onChange={(e) => setLoginUsername(e.target.value)}
    />
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
            <a onClick={showForgotPasswordModal}>Forgot Password?</a>
          </div>
          <div>
            <Link to="/register">Do not have an account?</Link>
          </div>
          <div>
            <Link to="/">Back to home page</Link>
          </div>
        </Form>
      </AuthenTemplate>

      {/* Forgot Password Modal */}
      <Modal
  title="Forgot Password"
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
>
  {usernameExists ? (
    <Form form={forgotPasswordForm} onFinish={handlePasswordReset} onFinishFailed={(errorInfo) => console.log('Failed:', errorInfo)}>
    <Form.Item
      label="New Password"
      name="newPassword"
      rules={[{ required: true, message: "Please enter your new password!" }]}
    >
      <Input.Password placeholder="New Password" />
    </Form.Item>
    <Button type="primary" htmlType="submit">Save New Password</Button>
  </Form>
  ) : (
    <Form form={forgotPasswordForm}>
  <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: "Please enter username!" }]}
    >
      <Input
        prefix={<UserOutlined />}
        placeholder="Username"
        value={forgotPasswordUsername}
        onChange={(e) => setForgotPasswordUsername(e.target.value)}
      />
    </Form.Item>

  <Button onClick={handleCheckUsername}>Check Username</Button>
</Form>
  )}
</Modal>

    </div>
  );
}

export default LoginPage;
