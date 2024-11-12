import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";
const { Search } = Input;

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
  const [searchText, setSearchText] = useState("");
  
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

  const showAddModal = async () => {
    setIsAddModalVisible(true);
    form.resetFields(); // Đặt lại các trường trong form
    setNewFarmId(null); // Đặt lại ID farm mới
    setKoiList([]); // Đặt lại danh sách koi
    await fetchAllKoi(); // Fetch danh sách koi khi mở modal
  };

  const showEditModal = async (farm) => {
    setEditingFarm(farm);
    setIsEditModalVisible(true);
    editForm.setFieldsValue(farm);
    const koiResponse = await axios.get(`${apiFarm}/${farm.farmId}/koi-varieties`);
    setKoiList(koiResponse.data);
    fetchAllKoi(); // Gọi hàm để lấy danh sách tất cả các koi
  };

  const handleAddModalClose = () => {
    setIsAddModalVisible(false);
    form.resetFields();
    setNewFarmId(null);
    setKoiList([]);
    setSelectedKoi(null);
    fetchFarms(); // Cập nhật lại danh sách farm để hiển thị đầy đủ thông tin
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
    setEditingFarm(null);
    setSelectedKoi(null);
  };

  const handleCancel = () => {
    if (isAddModalVisible) {
        handleAddModalClose();
    } else if (isEditModalVisible) {
        handleEditModalClose();
    }
  };

  const onFinish = async (values) => {
    console.log("Data sent to backend:", values); // Thêm log để kiểm tra dữ liệu
    try {
      const response = await axios.post(apiFarm, values); // Gửi dữ liệu mới
      message.success("Add New Farm Success!");
      setNewFarmId(response.data.farmId); // Lưu ID của farm mới tạo
      await fetchAllKoi(); // Fetch danh sách koi ngay sau khi tạo farm
      const koiResponse = await axios.get(`${apiFarm}/${response.data.farmId}/koi-varieties`);
      setKoiList(koiResponse.data); // Cập nhật danh sách koi của farm mới
      fetchFarms(); // Cập nhật danh sách farm sau khi thêm mới
    } catch (error) {
      message.error("There's Error In Save Farm!");
      console.error("Error saving farm:", error);
    }
  };

  const handleEditFinish = async (values) => {
    console.log("Data edited sent to backend:", values); // Thêm log để kiểm tra dữ liệu
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
    if (!selectedKoi) return;
    const farmId = editingFarm ? editingFarm.farmId : newFarmId;
    if (!farmId) return;

    const koiToAdd = allKoi.find(koi => koi.varietyName === selectedKoi);
    if (!koiToAdd) {
        message.error("Koi not found!");
        return;
    }

    try {
        await axios.post(`${apiFarm}/${farmId}/koi-varieties`, { 
            varietyId: koiToAdd.varietyId
        }); 
        message.success("Added Koi Successfully!");
        const koiResponse = await axios.get(`${apiFarm}/${farmId}/koi-varieties`);
        setKoiList(koiResponse.data);
        setSelectedKoi(null);
        fetchFarms();
    } catch (error) {
        message.error("Error adding Koi!");
        console.error("Error adding koi:", error);
    }
  };

  const handleRemoveKoi = async (varietyId) => {
    if (!varietyId) {
        message.error("Koi ID is not defined!");
        return;
    }
    const farmId = editingFarm ? editingFarm.farmId : newFarmId;
    if (!farmId) return;

    try {
        await axios.delete(`${apiFarm}/${farmId}/koi-varieties/${varietyId}`);
        message.success("Removed Koi Successfully!");
        const koiResponse = await axios.get(`${apiFarm}/${farmId}/koi-varieties`);
        setKoiList(koiResponse.data);
        fetchFarms();
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

  const handleEditSubmit = async () => {
    try {
        const values = await editForm.validateFields();
        await handleEditFinish(values);
        message.success("Farm updated successfully!");
        setIsEditModalVisible(false);
        fetchFarms();
    } catch (error) {
        console.error("Validation failed:", error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredFarms = farms.filter((farm) => {
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        farm.farmName?.toLowerCase().includes(searchLower) ||
        farm.location?.toLowerCase().includes(searchLower) ||
        farm.contactInfo?.toLowerCase().includes(searchLower) ||
        farm.koiVarieties?.some(koi => 
          koi.varietyName.toLowerCase().includes(searchLower)
        )
      );
    }
    return true;
  });

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
        <img 
            src={imageUrl} 
            alt="Farm" 
            style={{ 
                width: 100,         // Tăng kích thước từ 50 lên 100
                height: 100,        // Tăng kích thước từ 50 lên 100
                objectFit: 'cover', // Đảm bảo ảnh không bị méo
                borderRadius: '8px', // Bo tròn góc
                border: '1px solid #d9d9d9', // Thêm viền
                cursor: 'pointer'   // Con trỏ pointer khi hover
            }}
            onClick={() => {
                // Hiển thị ảnh kích thước đầy đủ khi click
                Modal.info({
                    title: 'Farm Image',
                    content: (
                        <img 
                            src={imageUrl} 
                            alt="Farm Full Size" 
                            style={{ 
                                width: '100%',
                                maxHeight: '80vh',
                                objectFit: 'contain'
                            }} 
                        />
                    ),
                    width: 800,
                });
            }}
        />
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
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button
          onClick={showAddModal}
          type="primary"
        >
          Add New Farm
        </Button>
        
        <Search
          placeholder="Search by farm name, location, contact, or koi variety..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 400 }}
          allowClear
        />
      </div>

      <Table columns={columns} dataSource={filteredFarms} rowKey="farm_id" />
      
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
              Add New
            </Button>
          </Form.Item>
        </Form>

        {newFarmId && (
          <>
            <h3>Koi in Farm</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {koiList.map(koi => (
                <li key={koi.varietyId} style={{ color: 'black', backgroundColor: 'white' }}>
                  {koi.varietyName}
                  <Button onClick={() => handleRemoveKoi(koi.varietyId)} danger style={{ marginLeft: 8 }}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>

            <h3>Add Koi</h3>
            {allKoi.length > 0 ? (
                <>
                    <select 
                        onChange={(e) => setSelectedKoi(e.target.value)} 
                        value={selectedKoi || ""} 
                        style={{ color: 'black', backgroundColor: 'white', width: '200px' }}
                    >
                        <option value="">Choose Koi</option>
                        {allKoi
                            .filter(koi => !koiList.some(existingKoi => existingKoi.varietyId === koi.varietyId))
                            .map(koi => (
                                <option key={koi.varietyId} value={koi.varietyName}>
                                    {koi.varietyName}
                                </option>
                            ))
                        }
                    </select>
                    <Button 
                        onClick={handleAddKoi} 
                        type="primary" 
                        disabled={!selectedKoi}
                        style={{ marginTop: 8, marginLeft: 8 }}
                    >
                        Add Koi
                    </Button>
                </>
            ) : (
                <div>Loading Koi varieties...</div>
            )}
            <Button 
                onClick={handleAddModalClose} 
                style={{ marginTop: 8, marginLeft: 8 }}
            >
                Hoàn tất
            </Button>
          </>
        )}
      </Modal>

      <Modal
        title="Edit Farm Information"
        visible={isEditModalVisible}
        onCancel={handleCancel}
        footer={[
            <Button key="cancel" onClick={handleCancel}>
                Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleEditSubmit}>
                Submit
            </Button>
        ]}
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

          {editingFarm && (
            <>
              <h3>Koi in Farm</h3>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {koiList.map(koi => (
                  <li key={koi.varietyId} style={{ color: 'black', backgroundColor: 'white' }}>
                    {koi.varietyName}
                    <Button onClick={() => handleRemoveKoi(koi.varietyId)} danger style={{ marginLeft: 8 }}>
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>

              <h3>Add Koi</h3>
              <select onChange={(e) => setSelectedKoi(e.target.value)} value={selectedKoi} style={{ color: 'black', backgroundColor: 'white' }}>
                <option value="">Choose Koi</option>
                {allKoi.filter(koi => !koiList.some(existingKoi => existingKoi.varietyName === koi.varietyName)).map(koi => (
                  <option key={koi.varietyId} value={koi.varietyName}>{koi.varietyName}</option>
                ))}
              </select>
              <Button onClick={handleAddKoi} type="primary" style={{ marginTop: 8 }}>
                Add Koi
              </Button>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ManageFarm;
