import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const ManageFarm = () => {
  const [farms, setFarms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFarm, setEditingFarm] = useState(null);
  const apiFarm = "http://localhost:8080/api/farms"; // Cập nhật URL API
  
  const fetchFarms = async () => {
    try {
      const response = await axios.get(apiFarm);
      setFarms(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách trang trại");
      console.error("Error fetching farms:", error);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const showModal = (farm = null) => {
    setEditingFarm(farm);
    setIsModalVisible(true);
    if (farm) {
      form.setFieldsValue(farm);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    console.log("Dữ liệu gửi đến backend:", values); // Thêm log để kiểm tra dữ liệu
    try {
      if (editingFarm) {
        await axios.put(`${apiFarm}/${editingFarm.farmId}`, values); // Cập nhật farmId
        message.success("Cập nhật trang trại thành công");
      } else {
        await axios.post(apiFarm, values); // Gửi dữ liệu mới
        message.success("Thêm trang trại mới thành công");
      }
      setIsModalVisible(false);
      fetchFarms();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu trang trại");
      console.error("Error saving farm:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiFarm}/${id}`); // Xóa theo farm_id
      message.success("Xóa trang trại thành công");
      fetchFarms();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa trang trại");
      console.error("Error deleting farm:", error);
    }
  };

  const columns = [
    // Đã loại bỏ cột ID
    {
      title: "Tên trang trại",
      dataIndex: "farmName",
      key: "farmName",
    },
    {
      title: "Hình ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <img src={imageUrl} alt="Farm" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Thông tin liên hệ",
      dataIndex: "contactInfo",
      key: "contactInfo",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Button
            onClick={() => handleDelete(record.farmId)}
            danger
            style={{ marginLeft: 8 }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Trang trại</h1>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm trang trại mới
      </Button>
      <Table columns={columns} dataSource={farms} rowKey="farm_id" />{" "}
      {/* Cập nhật để sử dụng farm_id */}
      <Modal
        title={editingFarm ? "Sửa thông tin trang trại" : "Thêm trang trại mới"}
        visible = {isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="farmName" // Cập nhật để sử dụng farmName
            label="Tên trang trại"
            rules={[
              { required: true, message: "Vui lòng nhập tên trang trại!" },
            ]}
          >
            <Input placeholder="Nhập tên trang trại" />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL Hình ảnh">
            {" "}
            {/* Cập nhật để sử dụng imageUrl */}
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>
          <Form.Item
            name="location" // Cập nhật để sử dụng location
            label="Location"
            rules={[{ required: true, message: "Vui lòng nhập location!" }]}
          >
            <Input placeholder="Nhập location trang trại" />
          </Form.Item>
          <Form.Item
            name="contactInfo" // Thêm trường cho thông tin liên hệ
            label="Thông tin liên hệ"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin liên hệ!" },
            ]}
          >
            <Input placeholder="Nhập thông tin liên hệ" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingFarm ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageFarm;
