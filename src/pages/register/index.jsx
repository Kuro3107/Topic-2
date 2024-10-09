import React from "react";
import AuthenTemplate from "../../components/authen-template";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const requestBody = {
        ...values,
        role_id: 5, // role_id cho Customer
        rePassword: values['re-password'] // Gửi cả rePassword
      };
      console.log(requestBody); // Kiểm tra xem fullname có được gửi không

      const response = await api.post("http://localhost:8080/api/v1/auth/register", requestBody);
      console.log(response);

      if (response.data && response.data.token) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        toast.success("Đăng ký thành công và đã đăng nhập");
        navigate("/profile");
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
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Re-Password"
            name="re-password"
            rules={[{ required: true, message: "Please confirm your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Fullname" name="fullName"> {/* Đảm bảo tên trường là "fullName" */}
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone!" },
              { pattern: /^0\d{9}$/, message: "Phone number must be 10 digits and start with 0" },
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
        </Form>
      </AuthenTemplate>
    </div>
  );
}

export default RegisterPage;
