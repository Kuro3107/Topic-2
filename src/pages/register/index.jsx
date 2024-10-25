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
        username: values.username,
        password: values.password,
        phone: values.phone,
        rePassword: values['re-password'],
        fullName: values.fullName || null,
        email: values.email || null,
      };

      console.log("Request Body:", requestBody);

      const response = await api.post("/v1/auth/register", requestBody);
      console.log("Response:", response);

      if (response.data && response.data.token) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        toast.success("Registered successfully and logged in");
        navigate("/profile");
      } else {
        toast.success("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <AuthenTemplate>
        <Form labelCol={{ span: 24 }} className="register-form" onFinish={handleRegister}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter username!" }]}
            >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Re-Password"
            name="re-password"
            rules={[{ required: true, message: "Please confirm password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="Full Name (Optional)" name="fullName">
            <Input />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please enter phone number!" },
              { pattern: /^0\d{9}$/, message: "Phone number must be 10 digits and start with 0" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email (Optional)" name="email">
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


