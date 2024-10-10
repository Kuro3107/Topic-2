import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./edit-profile.css";

function EditProfile() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      form.setFieldsValue(userInfo);
    }
  }, [form]);

  const handleSave = async (values) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const response = await api.put(`/accounts/${userInfo.id}`, values, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      
      console.log("Response data:", response.data); // Kiểm tra giá trị của response.data

      // Lưu lại thông tin mới bao gồm token và ID cũ
      const updatedUserInfo = {
        ...userInfo, // Giữ lại ID cũ
        ...response.data // Cập nhật thông tin mới
      };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo)); // Đảm bảo response.data chứa thông tin đầy đủ
      message.success("Cập nhật thông tin thành công");
      navigate("/profile", { replace: true }); // Sử dụng replace để ngăn quay lại trang edit
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thông tin thất bại");
    }
  };
  
  return (
    <div className="edit-profile-page">
      <Header />
      <main className="edit-profile-content">
        <h1>Chỉnh sửa thông tin cá nhân</h1>
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập Username' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </main>
      <Footer />
    </div>
  );
}

export default EditProfile;