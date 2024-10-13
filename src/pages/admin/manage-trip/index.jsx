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
      message.error("Unable to load the list of tours");
      console.error("Error loading tours:", error);
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
        message.success("Tour updated successfully");
      } else {
        await axios.post(apiTour, values);
        message.success("New tour added successfully");
      }
      setIsModalVisible(false);
      fetchTours();
    } catch (error) {
      message.error("An error occurred while saving the tour");
      console.error("Error saving tour:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiTour}/${id}`);
      message.success("Tour deleted successfully");
      fetchTours();
    } catch (error) {
      message.error("An error occurred while deleting the tour");
      console.error("Error deleting tour:", error);
    }
  };

  const columns = [
    {
      title: "Tour Name",
      dataIndex: "tripName",
      key: "tripName",
    },
    {
      title: "Total Price",
      dataIndex: "priceTotal",
      key: "priceTotal",
      render: (price) => (price != null ? `${price.toLocaleString()} VND` : 'N/A'),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Edit</Button>    
          <Button
            onClick={() => handleDelete(record.tripId)}
            danger
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Tours</h1>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add New Tour
      </Button>
      <Table 
        columns={columns} 
        dataSource={tours} 
        rowKey="tripId"
      />
      <Modal
        title={editingTour ? "Edit Tour Information" : "Add New Tour"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="tripName"
            label="Tour Name"
            rules={[{ required: true, message: "Please enter the tour name!" }]}
          >
            <Input placeholder="Enter tour name" />
          </Form.Item>
          <Form.Item
            name="priceTotal"
            label="Total Price"
            rules={[
              { required: true, message: "Please enter the total price!" },
              { type: 'number', min: 0, message: "Price must be a positive number!" },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              placeholder="Enter total price"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTour ? "Update" : "Add New"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageTour;