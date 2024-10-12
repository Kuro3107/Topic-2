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
      message.error("Can't load Koi Farm!!!");
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
        message.success("Updated Farm Success!");
      } else {
        await axios.post(apiFarm, values); // Gửi dữ liệu mới
        message.success("Add New Farm Success!");
      }
      setIsModalVisible(false);
      fetchFarms();
    } catch (error) {
      message.error("There's Error In Save Farm!");
      console.error("Error saving farm:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiFarm}/${id}`); // Xóa theo farm_id
      message.success("Deleted Koi Farm!");
      fetchFarms();
    } catch (error) {
      message.error("There's Error In Delete Farm!");
      console.error("Error deleting farm:", error);
    }
  };

  const columns = [
    // Đã loại bỏ cột ID
    {
      title: "Farm Name",
      dataIndex: "farmName",
      key: "farmName",
    },
    {
      title: "Image",
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
      title: "Contact",
      dataIndex: "contactInfo",
      key: "contactInfo",
    },
    {
      title: "Action",
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
      <h1>Farm Manage</h1>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add New Farm
      </Button>
      <Table columns={columns} dataSource={farms} rowKey="farm_id" />{" "}
      {/* Cập nhật để sử dụng farm_id */}
      <Modal
        title={editingFarm ? "Edit Farm Information" : "Add New Farm"}
        visible = {isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="farmName" // Cập nhật để sử dụng farmName
            label="Farm Name"
            rules={[
              { required: true, message: "Please Input Farm Name!" },
            ]}
          >
            <Input placeholder="Input Farm Name" />
          </Form.Item>
          <Form.Item name="imageUrl" label="URL Image">
            {" "}
            {/* Cập nhật để sử dụng imageUrl */}
            <Input placeholder="Input URL Image" />
          </Form.Item>
          <Form.Item
            name="location" // Cập nhật để sử dụng location
            label="Location"
            rules={[{ required: true, message: "Please input location!" }]}
          >
            <Input placeholder="Input location farm" />
          </Form.Item>
          <Form.Item
            name="contactInfo" // Thêm trường cho thông tin liên hệ
            label="Contact Information"
            rules={[
              { required: true, message: "Please input contact information!" },
            ]}
          >
            <Input placeholder="Input Contact Information" />
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
