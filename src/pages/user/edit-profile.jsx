/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Header from "../../components/header/index";
import Footer from "../../components/footer/index";
import "./edit-profile.css";

function EditProfile() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      form.setFieldsValue({
        username: userInfo.username,
        password: userInfo.password,
        fullName: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone,
        imageUrl: userInfo.imageUrl,
        roleId: userInfo.roleId,
      });
    }
  }, [form]);


  const handleSave = async (values) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      // Kiểm tra email tồn tại nếu email được thay đổi
      if (values.email && values.email !== userInfo.email) {
        const checkAccounts = await api.get("http://localhost:8080/api/accounts");
        const emailExists = checkAccounts.data.some(
          (account) => account.email === values.email && account.id !== userInfo.id
        );
        
        if (emailExists) {
          message.error("This email is already registered. Please use another email.");
          return;
        }
      }
  
      // Include all fields, preserving non-form fields from userInfo
      const updateData = {
        username: values.username || userInfo.username,
        password: values.password || userInfo.password,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        imageUrl: values.imageUrl !== undefined ? values.imageUrl : userInfo.imageUrl,
        roleId: values.roleId !== undefined ? values.roleId : userInfo.roleId,
      };
  
      // Make the update request
      const response = await api.put(`/accounts/${userInfo.id}`, updateData, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
  
      console.log("Response data:", response.data);
  
      // Update localStorage
      const updatedUserInfo = {
        ...userInfo,
        ...updateData,
      };
  
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      message.success("Information updated successfully");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error(error);
      message.error("Information updated successfully");
    }
  };

  const handleCancel = () => {
    navigate("/profile"); // Adjust this path to your profile page route
  };
  

  return (
    <div className="edit-profile-page">
      <Header />
      <main className="edit-profile-content">
        <h1>Edit personal information</h1>
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter Username" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full Name"
            // rules={[{ required: false, message: "Please enter your full name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              // { required: false, message: "Please enter email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              // { required: true, message: "Please enter phone number" },
              { type: "phone", message: "Invalid phone number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save changes
            </Button>
            <Button type="default" onClick={handleCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </main>
      <Footer />
    </div>
  );
}

export default EditProfile;
