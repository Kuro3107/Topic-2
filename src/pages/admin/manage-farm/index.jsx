import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const ManageFarm = () => {
  const [farms, setFarms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingFarm, setEditingFarm] = useState(null);
  const apiFarm = "https://66fbc1b08583ac93b40d17b4.mockapi.io/Farm";

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
    try {
      if (editingFarm) {
        await axios.put(`${apiFarm}/${editingFarm.id}`, values);
        message.success("Cập nhật trang trại thành công");
      } else {
        await axios.post(apiFarm, values);
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
      await axios.delete(`${apiFarm}/${id}`);
      message.success("Xóa trang trại thành công");
      fetchFarms();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa trang trại");
      console.error("Error deleting farm:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên trang trại",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => (
        <img src={avatar} alt="Farm" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Loại",
      dataIndex: "variety",
      key: "variety",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Button
            onClick={() => handleDelete(record.id)}
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
      <Table columns={columns} dataSource={farms} rowKey="id" />

      <Modal
        title={editingFarm ? "Sửa thông tin trang trại" : "Thêm trang trại mới"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Tên trang trại"
            rules={[
              { required: true, message: "Vui lòng nhập tên trang trại!" },
            ]}
          >
            <Input placeholder="Nhập tên trang trại" />
          </Form.Item>
          <Form.Item name="avatar" label="URL Hình ảnh">
            <Input placeholder="Nhập URL hình ảnh" />
          </Form.Item>
          <Form.Item
            name="variety"
            label="Loại"
            rules={[{ required: true, message: "Vui lòng nhập loại!" }]}
          >
            <Input placeholder="Nhập loại trang trại" />
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
