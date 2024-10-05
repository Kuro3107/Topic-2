import React from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      values.role = "CUSTOMER";
      const response = await api.post("/register", values);
      console.log(response);
      
      if (response.data && response.data.token) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        toast.success("Đăng ký thành công và đã đăng nhập");
        navigate("/profile"); // Chuyển hướng đến trang profile
      } else {
        toast.success("Đăng ký thành công");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Đăng ký thất bại");
    }
  };

  return (
    <div>
      <AuthenTemplate>
        <Form labelCol={{ span: 24 }} className="register-form" onFinish={handleRegister}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Re-Password" name="re-password">
            <Input />
          </Form.Item>
          <Form.Item label="Fullname" name="fullname">
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Phone number must be 10 digits",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <div>
            <Link to="/login">Already have an account?</Link>
          </div>
          <div></div>
        </Form>
      </AuthenTemplate>
    </div>
  );
}

export default RegisterPage;
