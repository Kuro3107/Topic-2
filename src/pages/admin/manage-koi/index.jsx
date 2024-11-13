import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import axios from "axios";

const { Search } = Input;

function ManageKoi() {
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKoi, setEditingKoi] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchKoiVarieties();
  }, []);

  const fetchKoiVarieties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/koi-varieties");
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setKoiVarieties(response.data);
      } else {
        console.error("Data is not an array");
        setKoiVarieties([]);
      }
    } catch (error) {
      message.error("Failed to fetch koi varieties");
    }
  };

  const handleAdd = () => {
    setEditingKoi(null);
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingKoi(record);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this koi variety?',
      okText: 'Delete',
      okType: 'danger', 
      cancelText: 'Cancel',
      async onOk() {
        try {
          await axios.delete(`http://localhost:8080/api/koi-varieties/${id}`);
          message.success("Koi deleted successfully");
          fetchKoiVarieties();
        } catch (error) {
          message.error("An error occurred while deleting the koi");
          console.error("Error deleting koi:", error);
        }
      },
    });
  };

  const handleModalOk = async (values) => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/koi-varieties/${editingKoi.varietyId}`, values);
        message.success("Koi variety updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/koi-varieties", values);
        message.success("Koi variety created successfully");
      }
      fetchKoiVarieties();
      setIsModalVisible(false);
      setEditingKoi(null);
    } catch (error) {
      message.error("Failed to save koi variety");
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredKoiVarieties = koiVarieties.filter((koi) => {
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        koi.varietyName?.toLowerCase().includes(searchLower) ||
        koi.description?.toLowerCase().includes(searchLower) ||
        koi.koiPrice?.toString().includes(searchLower)
      );
    }
    return true;
  });

  const columns = [
    {
      title: "Variety Name",
      dataIndex: "varietyName",
      key: "varietyName",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Price",
      dataIndex: "koiPrice",
      key: "koiPrice",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => <img src={text} alt="Koi" style={{ width: 100 }} />,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button 
            onClick={() => handleDelete(record.varietyId)}
            danger
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Add Koi Variety
        </Button>

        <Search
          placeholder="Search by name, description, or price..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredKoiVarieties} 
        rowKey="varietyId" 
      />

      <Modal
        title={isEditing ? "Edit Koi Variety" : "Add Koi Variety"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingKoi || {}}
          onFinish={handleModalOk}
          key={editingKoi ? editingKoi.varietyId : 'new'}
        >
          <Form.Item name="varietyName" label="Variety Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
          <Form.Item name="koiPrice" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="imageUrl" label="Image URL">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageKoi;
