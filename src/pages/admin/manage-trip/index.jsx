import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message, Select, Radio } from "antd";
import axios from "axios";
const { Search } = Input;

const ManageTour = () => {
  const [tours, setTours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTour, setEditingTour] = useState(null);
  const [farms, setFarms] = useState([]);
  const [isFarmsModalVisible, setIsFarmsModalVisible] = useState(false);
  const [currentTourId, setCurrentTourId] = useState(null);
  const [availableFarms, setAvailableFarms] = useState([]);
  const [selectedFarms, setSelectedFarms] = useState([]);
  const [selectedFarmToAdd, setSelectedFarmToAdd] = useState(null);
  const [tripDetails, setTripDetails] = useState([]); // State để lưu trip details
  const [isTripDetailModalVisible, setIsTripDetailModalVisible] = useState(false); // State cho modal trip detail
  const [tripDetailForm] = Form.useForm(); // Form cho trip detail
  const [editingTripDetail, setEditingTripDetail] = useState(null); // State cho trip detail đang chỉnh sửa
  const apiTour = "http://localhost:8080/api/trips";
  const [isCreatingTour, setIsCreatingTour] = useState(true); // Trạng thái để xác định bước tạo tour
  const [viewMode, setViewMode] = useState("available"); // State để theo dõi chế độ xem
  const [searchText, setSearchText] = useState(""); // Thêm state cho tìm kiếm

  const fetchTours = async () => {
    try {
      const response = await axios.get(apiTour);
      const toursWithDetails = await Promise.all(response.data.map(async (tour) => {
        const detailResponse = await axios.get(`${apiTour}/${tour.tripId}`);
        return { ...tour, tripDetails: detailResponse.data.tripDetails };
      }));
      setTours(toursWithDetails);
    } catch (error) {
      message.error("Unable to load the list of tours");
      console.error("Error loading tours:", error);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchAvailableFarms();
  }, []);

  const fetchAvailableFarms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/farms");
      setAvailableFarms(response.data);
    } catch (error) {
      message.error("Unable to load available farms");
      console.error("Error loading farms:", error);
    }
  };

  const showModal = (tour = null) => {
    setEditingTour(tour);
    setIsModalVisible(true);
    if (tour) {
      form.setFieldsValue(tour);
      setTripDetails(tour.tripDetails || []); // Lấy trip details nếu có
      setCurrentTourId(tour.tripId); // Thiết lập currentTourId khi chỉnh sửa tour
      setIsCreatingTour(false); // Chuyển sang chế độ chỉnh sửa
      fetchFarms(tour.tripId); // Lấy danh sách farms cho tour
    } else {
      form.resetFields();
      setTripDetails([]); // Reset trip details khi tạo mới
      setCurrentTourId(null); // Đặt currentTourId là null khi tạo mới
      setIsCreatingTour(true); // Chuyển sang chế độ tạo mới
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setIsCreatingTour(true); // Reset về trạng thái tạo tour
  };

  const onFinishCreateTour = async (values) => {
    try {
      const tourData = {
        tripName: values.tripName,
        imageUrl: values.imageUrl,
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post(apiTour, tourData, config);
      if (response.status === 201) {
        message.success("New tour created successfully");
        setCurrentTourId(response.data.tripId); // Lưu lại ID của tour mới tạo
        setIsCreatingTour(false); // Chuyển sang bước cập nhật thông tin chi tiết
      } else {
        throw new Error("Failed to create new tour");
      }
    } catch (error) {
      message.error(`An error occurred while creating the tour: ${error.message}`);
      console.error("Error creating tour:", error);
    }
  };

  const onFinishUpdateTour = async (values) => {
    try {
        const tourData = {
            ...values,
            farms: selectedFarms, // Đảm bảo rằng selectedFarms được bao gồm trong dữ liệu
            tripDetails: tripDetails,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const response = await axios.put(`${apiTour}/${currentTourId}`, tourData, config);
        if (response.status === 200) {
            message.success("Tour updated successfully");
            setIsModalVisible(false);
            fetchTours();
        } else {
            throw new Error("Failed to update tour");
        }
    } catch (error) {
        message.error(`An error occurred while updating the tour: ${error.message}`);
        console.error("Error updating tour:", error);
    }
  };

  const handleAddTripDetail = async (values) => {
    if (!currentTourId) {
      message.error("No tour selected for adding trip detail");
      return;
    }
    const newDetail = {
      ...values,
    };
    try {
      await axios.post(`${apiTour}/${currentTourId}/trip-details`, newDetail, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTripDetails([...tripDetails, newDetail]); // Thêm trip detail vào danh sách
      message.success("Trip detail added successfully");
    } catch (error) {
      message.error("An error occurred while adding the trip detail");
      console.error("Error adding trip detail:", error);
    }
    setIsTripDetailModalVisible(false); // Đóng modal
    tripDetailForm.resetFields(); // Reset form trip detail
  };

  const handleEditTripDetail = (detail) => {
    setEditingTripDetail(detail);
    tripDetailForm.setFieldsValue(detail); // Đặt giá trị cho form từ detail
    setIsTripDetailModalVisible(true); // Mở modal để chỉnh sửa
  };

  const handleUpdateTripDetail = async (values) => {
    if (!currentTourId) {
      message.error("No tour selected for updating trip detail");
      return;
    }
    if (editingTripDetail) {
      try {
        await axios.put(`${apiTour}/${currentTourId}/trip-details/${editingTripDetail.tripDetailId}`, values, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const updatedDetails = tripDetails.map(detail => 
          detail.tripDetailId === editingTripDetail.tripDetailId ? { ...detail, ...values } : detail
        );
        setTripDetails(updatedDetails); // Cập nhật danh sách trip details
        message.success("Trip detail updated successfully");
      } catch (error) {
        message.error("An error occurred while updating the trip detail");
        console.error("Error updating trip detail:", error);
      }
      setIsTripDetailModalVisible(false); // Đóng modal
      tripDetailForm.resetFields(); // Reset form trip detail
      setEditingTripDetail(null); // Reset editing state
    }
  };

  const handleDeleteTripDetail = async (tripDetailId) => {
    if (!currentTourId) {
      message.error("No tour selected for deleting trip detail");
      return;
    }
    try {
      await axios.delete(`${apiTour}/${currentTourId}/trip-details/${tripDetailId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTripDetails(tripDetails.filter(detail => detail.tripDetailId !== tripDetailId)); // Xóa trip detail
      message.success("Trip detail deleted successfully");
    } catch (error) {
      message.error("An error occurred while deleting the trip detail");
      console.error("Error deleting trip detail:", error);
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

  const fetchFarms = async (tourId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/trips/${tourId}`);
      setFarms(response.data.koiFarms); // Lấy danh sách farms từ trường koiFarms
    } catch (error) {
      message.error("Unable to load the list of farms");
      console.error("Error loading farms:", error);
    }
  };

  const showFarmsModal = (tourId) => {
    setCurrentTourId(tourId);
    fetchFarms(tourId);
    setIsFarmsModalVisible(true);
  };

  const handleAddFarm = async () => {
    if (selectedFarmToAdd) {
        try {
            await axios.post(`http://localhost:8080/api/trips/${currentTourId}/farms`, { farmId: selectedFarmToAdd });
            message.success("Farm added successfully");
            fetchFarms(currentTourId); // Cập nhật danh sách farms sau khi thêm
            setSelectedFarmToAdd(null); // Reset farm đã chọn sau khi thêm
        } catch (error) {
            message.error("An error occurred while adding the farm");
            console.error("Error adding farm:", error);
        }
    } else {
        message.error("Please select a farm to add");
    }
  };

  const handleDeleteFarm = async (farmId) => {
    try {
      await axios.delete(`http://localhost:8080/api/trips/${currentTourId}/farms/${farmId}`);
      message.success("Farm deleted successfully");
      fetchFarms(currentTourId);
    } catch (error) {
      message.error("An error occurred while deleting the farm");
      console.error("Error deleting farm:", error);
    }
  };

  const handleOpenAddTripDetailModal = () => {
    setEditingTripDetail(null); // Đảm bảo không có trip detail nào đang được chỉnh sửa
    tripDetailForm.resetFields(); // Reset form để tạo mới
    setIsTripDetailModalVisible(true); // Mở modal
  };

  const handleAddFarmToTour = async (farmId) => {
    try {
        await axios.post(`http://localhost:8080/api/trips/${currentTourId}/farms`, { farmId });
        message.success("Farm added successfully");
        fetchFarms(currentTourId); // Cập nhật danh sách farms sau khi thêm
    } catch (error) {
        message.error("An error occurred while adding the farm");
        console.error("Error adding farm:", error);
    }
  };

  const handleSelectFarms = (farmIds) => {
    setSelectedFarms(farmIds);
    farmIds.forEach(farmId => handleAddFarmToTour(farmId)); // Thêm từng farm vào tour
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredTours = tours.filter((tour) => {
    const viewModeFilter = viewMode === "available" ? tour.imageUrl : !tour.imageUrl;
    if (!viewModeFilter) return false;

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        tour.tripName?.toLowerCase().includes(searchLower) ||
        tour.priceTotal?.toString().includes(searchLower) ||
        tour.tripDetails?.some(detail => 
          detail.mainTopic?.toLowerCase().includes(searchLower) ||
          detail.subTopic?.toLowerCase().includes(searchLower)
        ) ||
        tour.koiFarms?.some(farm => 
          farm.farmName?.toLowerCase().includes(searchLower) ||
          farm.location?.toLowerCase().includes(searchLower)
        )
      );
    }
    return true;
  });

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
      render: (price) => (price != null ? `${price.toLocaleString()}` : 'N/A'),
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => imageUrl ? <img src={imageUrl} alt="Trip" style={{ width: 100 }} /> : 'N/A',
    },
    {
      title: "Activities",
      key: "activities",
      render: (_, record) => (
        <ul>
          {record.tripDetails && record.tripDetails.length > 0 ? (
            record.tripDetails.map(detail => (
              <li key={detail.tripDetailId}>
                <strong>Day:</strong> {detail.day} <br />
                <strong>Main Topic:</strong> {detail.mainTopic} <br />
                {detail.subTopic && <span><strong>Sub Topic:</strong> {detail.subTopic} <br /></span>}
              </li>
            ))
          ) : (
            <li>No activities available</li>
          )}
        </ul>
      ),
    },
    {
      title: "Farms",
      key: "farms",
      render: (_, record) => (
        <ul>
          {record.koiFarms && record.koiFarms.length > 0 ? (
            record.koiFarms.map(farm => (
              <li key={farm.farmId}>
                <strong>{farm.farmName}</strong> - Location: {farm.location}
              </li>
            ))
          ) : (
            <li>No farms available</li>
          )}
        </ul>
      ),
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
      <div style={{ marginBottom: 16 }}>
        <Radio.Group 
          value={viewMode} 
          onChange={(e) => setViewMode(e.target.value)} 
          style={{ marginRight: 16 }}
        >
          <Radio value="available">Tour có sẵn</Radio>
          <Radio value="custom">Tour của riêng khách hàng</Radio>
        </Radio.Group>

        <Search
          placeholder="Tìm kiếm theo tên tour, giá, hoạt động hoặc farm..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 400, marginLeft: 16 }}
          allowClear
        />
      </div>

      <Button
        onClick={() => {
          setIsModalVisible(true);
          setIsCreatingTour(true);
        }}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Add New Tour
      </Button>

      <Table 
        columns={columns} 
        dataSource={filteredTours}
        rowKey="tripId"
      />

      <Modal
        title={isCreatingTour ? "Create New Tour" : "Update Tour Details"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={isCreatingTour ? onFinishCreateTour : onFinishUpdateTour}
          layout="vertical"
        >
          <Form.Item
            name="tripName"
            label="Tour Name"
            rules={[{ required: true, message: "Please enter the tour name!" }]}
          >
            <Input placeholder="Enter tour name" />
          </Form.Item>
          <Form.Item
            name="imageUrl"
            label="Image URL"
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
          {!isCreatingTour && (
            <>
              <Form.Item
                name="priceTotal"
                label="Total Price"
                rules={[{ required: true, message: "Please enter the total price!" }, { type: 'number', min: 0, message: "Price must be a positive number!" }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Enter total price"
                />
              </Form.Item>
              <Form.Item
                name="farms"
                label="Select Farms"
              >
                <Select
                    placeholder="Select Farm to Add"
                    onChange={setSelectedFarmToAdd}
                    options={availableFarms.map(farm => ({ label: farm.farmName, value: farm.farmId }))}
                    style={{ width: '100%', marginBottom: 16 }}
                />
                <Button onClick={handleAddFarm}>Add Farm</Button>
                <ul>
                  {farms.map(farm => (
                    <li key={farm.farmId}>
                      <div>
                        <img src={farm.imageUrl} alt={farm.farmName} style={{ width: 100, marginRight: 10 }} />
                        <strong>{farm.farmName}</strong>
                      </div>
                      <div>Location: {farm.location}</div>
                      <div>Contact: {farm.contactInfo}</div>
                      <Button onClick={() => handleDeleteFarm(farm.farmId)} danger style={{ marginLeft: 8 }}>
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </Form.Item>
              <Form.Item label="Activities">
                <Button onClick={handleOpenAddTripDetailModal} type="primary">
                  Add Trip Detail
                </Button>
                <ul>
                  {tripDetails.map(detail => (
                    <li key={detail.tripDetailId}>
                      <strong>Main Topic:</strong> {detail.mainTopic} <br />
                      <strong>Sub Topic:</strong> {detail.subTopic} <br />
                      <strong>Note Price:</strong> {detail.notePrice} <br />
                      <strong>Day:</strong> {detail.day} <br />
                      <Button onClick={() => handleEditTripDetail(detail)}>Edit</Button>
                      <Button onClick={() => handleDeleteTripDetail(detail.tripDetailId)} danger>
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isCreatingTour ? "Create Tour" : "Update Tour"}
            </Button>
            <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={editingTripDetail ? "Edit Trip Detail" : "Create Trip Detail"} // Đổi tiêu đề modal dựa trên trạng thái
        open={isTripDetailModalVisible}
        onCancel={() => setIsTripDetailModalVisible(false)}
        footer={null}
      >
        <Form form={tripDetailForm} onFinish={editingTripDetail ? handleUpdateTripDetail : handleAddTripDetail}>
            {/* Các trường cho modal */}
            <Form.Item
                name="mainTopic"
                label="Main Topic"
                rules={[{ required: true, message: "Please enter the main topic!" }]}
            >
                <Input placeholder="Enter main topic" />
            </Form.Item>
            <Form.Item
                name="subTopic"
                label="Sub Topic"
            >
                <Input placeholder="Enter sub topic" />
            </Form.Item>
            <Form.Item
                name="notePrice"
                label="Note Price"
                rules={[{ required: true, message: "Please enter the note price!" }]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Enter note price"
                />
            </Form.Item>
            <Form.Item
                name="day"
                label="Day"
                rules={[{ required: true, message: "Please select a day!" }]}
            >
                <Select placeholder="Select day">
                    {Array.from({ length: 30 }, (_, i) => (
                        <Select.Option key={i + 1} value={i + 1}>{i + 1}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {editingTripDetail ? "Update Detail" : "Create Trip Detail"}
                </Button>
                <Button onClick={() => setIsTripDetailModalVisible(false)} style={{ marginLeft: 8 }}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Farms in Tour"
        open={isFarmsModalVisible}
        onCancel={() => setIsFarmsModalVisible(false)}
        footer={null}
      >
        <h3>Farms List</h3>
        <ul>
          {farms.map(farm => (
            <li key={farm.farmId}>
              <div>
                <img src={farm.imageUrl} alt={farm.farmName} style={{ width: 100, marginRight: 10 }} />
                <strong>{farm.farmName}</strong>
              </div>
              <div>Location: {farm.location}</div>
              <div>Contact: {farm.contactInfo}</div>
              <Button onClick={() => handleDeleteFarm(farm.farmId)} danger style={{ marginLeft: 8 }}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <Select
          placeholder="Select Farm to Add"
          onChange={setSelectedFarmToAdd}
          options={availableFarms.map(farm => ({ label: farm.farmName, value: farm.farmId }))}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <Button onClick={handleAddFarm}>Add Farm</Button>
      </Modal>
    </div>
  );
};

export default ManageTour;
