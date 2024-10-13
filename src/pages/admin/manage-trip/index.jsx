import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message, Select } from "antd";
import axios from "axios";

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
    } else {
      form.resetFields();
      setTripDetails([]); // Reset trip details khi tạo mới
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const tourData = {
        ...values,
        farms: editingTour ? farms : selectedFarms,
        tripDetails: tripDetails, // Thêm trip details vào dữ liệu
      };
      if (editingTour) {
        await axios.put(`${apiTour}/${editingTour.tripId}`, tourData);
        message.success("Tour updated successfully");
      } else {
        await axios.post(apiTour, tourData);
        message.success("New tour added successfully");
      }
      setIsModalVisible(false);
      fetchTours();
    } catch (error) {
      message.error("An error occurred while saving the tour");
      console.error("Error saving tour:", error);
    }
  };

  const handleAddTripDetail = async (values) => {
    const newDetail = {
      tripDetailId: Date.now(), // Tạo ID tự động
      ...values,
    };
    setTripDetails([...tripDetails, newDetail]); // Thêm trip detail vào danh sách
    setIsTripDetailModalVisible(false); // Đóng modal
    tripDetailForm.resetFields(); // Reset form trip detail
  };

  const handleEditTripDetail = (detail) => {
    setEditingTripDetail(detail);
    tripDetailForm.setFieldsValue(detail); // Đặt giá trị cho form từ detail
    setIsTripDetailModalVisible(true); // Mở modal để chỉnh sửa
  };

  const handleUpdateTripDetail = async (values) => {
    if (editingTripDetail) {
      try {
        await axios.put(`${apiTour}/${currentTourId}/details/${editingTripDetail.tripDetailId}`, values);
        const updatedDetails = tripDetails.map(detail => 
          detail.tripDetailId === editingTripDetail.tripDetailId ? { ...detail, ...values } : detail
        );
        setTripDetails(updatedDetails); // Cập nhật danh sách trip details
        setIsTripDetailModalVisible(false); // Đóng modal
        tripDetailForm.resetFields(); // Reset form trip detail
        setEditingTripDetail(null); // Reset editing state
        message.success("Trip detail updated successfully");
      } catch (error) {
        message.error("An error occurred while updating the trip detail");
        console.error("Error updating trip detail:", error);
      }
    }
  };

  const handleDeleteTripDetail = (tripDetailId) => {
    setTripDetails(tripDetails.filter(detail => detail.tripDetailId !== tripDetailId)); // Xóa trip detail
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
        fetchFarms(currentTourId);
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
        <Button onClick={() => showFarmsModal(record.tripId)}>View</Button>
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
            name="imageUrl"
            label="Image URL"
            rules={[{ required: true, message: "Please enter the image URL!" }]}
          >
            <Input placeholder="Enter image URL" />
          </Form.Item>
          {!editingTour && (
            <Form.Item
              name="farms"
              label="Select Farms"
              rules={[{ required: true, message: "Please select at least one farm!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select farms"
                onChange={setSelectedFarms}
                options={availableFarms.map(farm => ({ label: farm.farmName, value: farm.farmId }))}
              />
            </Form.Item>
          )}
          <Form.Item label="Activities">
            <Button onClick={() => setIsTripDetailModalVisible(true)}>
              Add Trip Detail
            </Button>
            <ul>
              {tripDetails.map(detail => (
                <li key={detail.tripDetailId}>
                  <strong>Main Topic:</strong> {detail.mainTopic} <br />
                  <strong>Sub Topic:</strong> {detail.subTopic} <br />
                  <strong>Note Price:</strong> {detail.notePrice} <br />
                  <strong>Day:</strong> {detail.day} <br />
                  <Button onClick={() => handleEditTripDetail(detail)}>Edit</Button> {/* Nút chỉnh sửa */}
                  <Button onClick={() => handleDeleteTripDetail(detail.tripDetailId)} danger>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
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
      <Modal
        title="Edit Trip Detail"
        open={isTripDetailModalVisible}
        onCancel={() => setIsTripDetailModalVisible(false)}
        footer={null}
      >
        <Form form={tripDetailForm} onFinish={handleUpdateTripDetail}>
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
              Update Detail
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