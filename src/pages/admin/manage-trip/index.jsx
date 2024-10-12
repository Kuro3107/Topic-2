import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import axios from "axios";

const ManageTour = () => {
  const [tours, setTours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTour, setEditingTour] = useState(null);
  const apiTour = "http://localhost:8080/api/tours";
  
  const fetchTours = async () => {
    try {
      const response = await axios.get(apiTour);
      setTours(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách tour");
      console.error("Lỗi khi tải tour:", error);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const showModal = (tour = null) => {
    setEditingTour(tour);
    setIsModalVisible(true);
    if (tour) {
      form.setFieldsValue(tour);
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
      if (editingTour) {
        await axios.put(`${apiTour}/${editingTour.tripId}`, values);
        message.success("Cập nhật tour thành công");
      } else {
        await axios.post(apiTour, values);
        message.success("Thêm tour mới thành công");
      }
      setIsModalVisible(false);
      fetchTours();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu tour");
      console.error("Lỗi khi lưu tour:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiTour}/${id}`);
      message.success("Xóa tour thành công");
      fetchTours();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tour");
      console.error("Lỗi khi xóa tour:", error);
    }
  };

  const columns = [
    {
      title: "Tên tour",
      dataIndex: "tripName",
      key: "tripName",
    },
    {
      title: "Tổng giá",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (price) => (price != null ? `${price.toLocaleString()} VND` : 'N/A'),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Sửa</Button>    
          <Button
            onClick={() => handleDelete(record.tripId)}
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
      <h1>Quản lý Tour</h1>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm tour mới
      </Button>
      <Table 
        columns={columns} 
        dataSource={tours} 
        rowKey="tripId"
      />
      <Modal
        title={editingTour ? "Sửa thông tin tour" : "Thêm tour mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="tripName"
            label="Tên tour"
            rules={[
              { required: true, message: "Vui lòng nhập tên tour!" },
            ]}
          >
            <Input placeholder="Nhập tên tour" />
          </Form.Item>
          <Form.Item
            name="priceTotal"
            label="Tổng giá"
            rules={[
              { required: true, message: "Vui lòng nhập tổng giá!" },
              { type: 'number', min: 0, message: "Giá phải là số dương!" },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Nhập tổng giá"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTour ? "Cập nhật" : "Thêm mới"}
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

export default ManageTour;
