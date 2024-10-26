import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

const ManageFarm = () => {
  const [farms, setFarms] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // Modal cho thêm farm mới
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal cho chỉnh sửa farm
  const [form] = Form.useForm();
  const [editForm] = Form.useForm(); // Form riêng cho modal chỉnh sửa
  const [newFarmId, setNewFarmId] = useState(null); // Lưu ID của farm mới tạo
  const [editingFarm, setEditingFarm] = useState(null); // Lưu farm đang chỉnh sửa
  const [koiList, setKoiList] = useState([]); // Thêm state để quản lý danh sách koi
  const [allKoi, setAllKoi] = useState([]); // Thêm state để quản lý danh sách tất cả các koi
  const [selectedKoi, setSelectedKoi] = useState(null); // Thêm state để lưu koi được chọn
  const apiFarm = "http://localhost:8080/api/farms"; // Cập nhật URL API
  
  const fetchFarms = async () => {
    try {
      const response = await axios.get(apiFarm);
      const farmsWithKoi = await Promise.all(response.data.map(async (farm) => {
        const koiResponse = await axios.get(`${apiFarm}/${farm.farmId}/koi-varieties`);
        return { ...farm, koiVarieties: koiResponse.data }; // Thêm thông tin koi vào farm
      }));
      setFarms(farmsWithKoi);
    } catch (error) {
      message.error("Can't load Koi Farm!!!");
      console.error("Error fetching farms:", error);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchAllKoi = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/koi-varieties");
        setAllKoi(response.data); // Cập nhật danh sách tất cả các koi
    } catch (error) {
        message.error("Can't load Koi Varieties!!!");
        console.error("Error fetching koi varieties:", error);
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
    form.resetFields(); // Đặt lại các trường trong form
    setNewFarmId(null); // Đặt lại ID farm mới
    setKoiList([]); // Đặt lại danh sách koi
  };

  const showEditModal = async (farm) => {
    setEditingFarm(farm);
    setIsEditModalVisible(true);
    editForm.setFieldsValue(farm);
    const koiResponse = await axios.get(`${apiFarm}/${farm.farmId}/koi-varieties`);
    setKoiList(koiResponse.data);
    fetchAllKoi(); // Gọi hàm để lấy danh sách tất cả các koi
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
    setIsEditModalVisible(false);
    form.resetFields();
    editForm.resetFields();
    setSelectedKoi(null); // Đặt lại koi được chọn
  };

  const onFinish = async (values) => {
    console.log("Dữ liệu gửi đến backend:", values); // Thêm log để kiểm tra dữ liệu
    try {
      const response = await axios.post(apiFarm, values); // Gửi dữ liệu mới
      message.success("Add New Farm Success!");
      setNewFarmId(response.data.farmId); // Lưu ID của farm mới tạo
      fetchAllKoi(); // Gọi hàm để lấy danh sách tất cả các koi
      fetchFarms(); // Cập nhật danh sách farm sau khi thêm mới
    } catch (error) {
      message.error("There's Error In Save Farm!");
      console.error("Error saving farm:", error);
    }
  };

  const handleEditFinish = async (values) => {
    console.log("Dữ liệu chỉnh sửa gửi đến backend:", values); // Thêm log để kiểm tra dữ liệu
    try {
      await axios.put(`${apiFarm}/${editingFarm.farmId}`, values); // Cập nhật farmId
      message.success("Updated Farm Success!");
      setIsEditModalVisible(false);
      fetchFarms();
    } catch (error) {
      message.error("There's Error In Update Farm!");
      console.error("Error updating farm:", error);
    }
  };

  const handleAddKoi = async () => {
    if (!selectedKoi || !newFarmId) return; // Nếu không có koi được chọn hoặc farm chưa được tạo thì không làm gì

    // Tìm koi trong danh sách allKoi để lấy varietyId
    const koiToAdd = allKoi.find(koi => koi.varietyName === selectedKoi);
    if (!koiToAdd) {
        message.error("Koi not found!");
        return;
    }

    try {
        // Gửi yêu cầu thêm koi vào farm với varietyId
        await axios.post(`${apiFarm}/${newFarmId}/koi-varieties`, { 
            varietyId: koiToAdd.varietyId // Đảm bảo rằng bạn đang gửi đúng thuộc tính
        }); 
        message.success("Added Koi Successfully!");
        const koiResponse = await axios.get(`${apiFarm}/${newFarmId}/koi-varieties`);
        setKoiList(koiResponse.data); // Cập nhật lại danh sách koi
        setSelectedKoi(null); // Đặt lại koi được chọn
        fetchFarms(); // Cập nhật danh sách farm sau khi thêm koi
    } catch (error) {
        message.error("Error adding Koi!");
        console.error("Error adding koi:", error);
    }
  };

  const handleRemoveKoi = async (varietyId) => { // Thay đổi tham số thành varietyId
    if (!varietyId) {
        message.error("Koi ID is not defined!"); // Thêm thông báo lỗi nếu varietyId không hợp lệ
        return;
    }
    try {
        await axios.delete(`${apiFarm}/${newFarmId}/koi-varieties/${varietyId}`); // Gửi yêu cầu xóa koi
        message.success("Removed Koi Successfully!");
        const koiResponse = await axios.get(`${apiFarm}/${newFarmId}/koi-varieties`);
        setKoiList(koiResponse.data); // Cập nhật lại danh sách koi
        fetchFarms(); // Cập nhật danh sách farm sau khi xóa koi
    } catch (error) {
        message.error("Error removing Koi!");
        console.error("Error removing koi:", error);
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
      title: "Koi In Farm",
      dataIndex: "koiVarieties",
      key: "koiVarieties",
      render: (koiVarieties) => (
        <span>{koiVarieties.map(koi => koi.varietyName).join(', ')}</span> // Hiển thị varietyName
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showEditModal(record)}>Edit</Button>
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
        onClick={showAddModal}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add New Farm
      </Button>
      <Table columns={columns} dataSource={farms} rowKey="farm_id" />{" "}
      
      {/* Modal cho thêm farm mới */}
      <Modal
        title="Add New Farm"
        visible={isAddModalVisible}
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
              Thêm mới
            </Button>
          </Form.Item>
        </Form>

        {/* Hiển thị danh sách koi và nút thêm koi sau khi farm được tạo */}
        {newFarmId && (
          <>
            <h3>Koi in Farm</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {koiList.map(koi => (
                <li key={koi.varietyId} style={{ color: 'black', backgroundColor: 'white' }}>
                  {koi.varietyName}
                  <Button onClick={() => handleRemoveKoi(koi.varietyId)} danger style={{ marginLeft: 8 }}>
                    Xóa
                  </Button>
                </li>
              ))}
            </ul>

            <h3>Thêm Koi</h3>
            <select onChange={(e) => setSelectedKoi(e.target.value)} value={selectedKoi} style={{ color: 'black', backgroundColor: 'white' }}>
              <option value="">Chọn Koi</option>
              {allKoi.filter(koi => !koiList.some(existingKoi => existingKoi.varietyName === koi.varietyName)).map(koi => (
                <option key={koi.varietyId} value={koi.varietyName}>{koi.varietyName}</option>
              ))}
            </select>
            <Button onClick={handleAddKoi} type="primary" style={{ marginTop: 8 }}>
              Thêm Koi
            </Button>
            <Button onClick={handleCancel} style={{ marginTop: 8, marginLeft: 8 }}>
              Hoàn tất
            </Button>
          </>
        )}
      </Modal>

      {/* Modal cho chỉnh sửa farm */}
      <Modal
        title="Edit Farm Information"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEditFinish} layout="vertical">
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

          {/* Hiển thị danh sách koi chỉ khi farm đã được tạo */}
          {editingFarm && (
            <>
              <h3>Koi in Farm</h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {koiList.map(koi => (
                  <li key={koi.varietyId} style={{ color: 'black', backgroundColor: 'white' }}>
                    {koi.varietyName}
                    <Button onClick={() => handleRemoveKoi(koi.varietyId)} danger style={{ marginLeft: 8 }}>
                      Xóa
                    </Button>
                  </li>
                ))}
              </ul>

              <h3>Thêm Koi</h3>
              <select onChange={(e) => setSelectedKoi(e.target.value)} value={selectedKoi} style={{ color: 'black', backgroundColor: 'white' }}>
                <option value="">Chọn Koi</option>
                {allKoi.filter(koi => !koiList.some(existingKoi => existingKoi.varietyName === koi.varietyName)).map(koi => (
                  <option key={koi.varietyId} value={koi.varietyName}>{koi.varietyName}</option>
                ))}
              </select>
              <Button onClick={handleAddKoi} type="primary" style={{ marginTop: 8 }}>
                Thêm Koi
              </Button>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ManageFarm;
