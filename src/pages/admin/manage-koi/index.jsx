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

function ManageKoi() {
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKoi, setEditingKoi] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Thêm trạng thái để phân biệt giữa thêm mới và chỉnh sửa

  useEffect(() => {
    fetchKoiVarieties();
  }, []);

  const fetchKoiVarieties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/koi-varieties");
      console.log(response.data); // Kiểm tra dữ liệu
      if (Array.isArray(response.data)) {
        setKoiVarieties(response.data);
      } else {
        console.error("Data is not an array");
        setKoiVarieties([]); // Hoặc xử lý lỗi theo cách khác
      }
    } catch (error) {
      message.error("Failed to fetch koi varieties");
    }
  };

  const handleAdd = () => {
    setEditingKoi(null); // Đặt editingKoi là null để thêm mới
    setIsEditing(false); // Đặt isEditing là false để thêm mới
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleEdit = (record) => {
    setEditingKoi(record); // Cập nhật bản ghi đang chỉnh sửa
    setIsEditing(true); // Đặt isEditing là true để chỉnh sửa
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/koi-varieties/${id}`);
      message.success("Koi variety deleted successfully");
      fetchKoiVarieties();
    } catch (error) {
      message.error("Failed to delete koi variety");
    }
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
      render: (text) => <img src={text} alt="Koi" style={{ width: 100 }} />, // Hiển thị hình ảnh
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.varietyId)}>Delete</Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add Koi Variety
      </Button>
      <Table columns={columns} dataSource={koiVarieties} rowKey="varietyId" />
      <Modal
        title={isEditing ? "Edit Koi Variety" : "Add Koi Variety"} // Thay đổi tiêu đề dựa trên trạng thái
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={editingKoi || {}} // Đảm bảo rằng initialValues được cập nhật đúng
          onFinish={handleModalOk}
          key={editingKoi ? editingKoi.varietyId : 'new'} // Đảm bảo form được reset khi editingKoi thay đổi
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
