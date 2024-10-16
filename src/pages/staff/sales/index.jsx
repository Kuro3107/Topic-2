import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  InputNumber,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { Space } from 'antd';


function SalesDashboard() {
  const [bookings, setBookings] = useState([]);
  const [koiFarms, setKoiFarms] = useState([]); // State để lưu danh sách Koi Farms
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tripForm] = Form.useForm();
  
  const [viewingBooking, setViewingBooking] = useState(null);

  const bookingApi = "http://localhost:8080/api/bookings";
  const tripApi = "http://localhost:8080/api/trips";
  const farmApi = "http://localhost:8080/api/farms"; // API cho Koi Farms

  useEffect(() => {
    fetchBookings();
    fetchKoiFarms(); // Lấy danh sách Koi Farms khi component mount
  }, []);

  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const handleViewEditTrip = (trip) => {
    setTripForm(trip); // Đặt thông tin trip vào form
    setIsEditingTrip(true); // Đặt chế độ edit
    setIsTripModalVisible(true); // Mở modal
};



  const fetchBookings = async () => {
    try {
      const response = await axios.get(bookingApi);
      const filteredBookings = response.data.filter(
        (booking) =>
          booking.status === "pending" ||
          booking.status === "rejected" ||
          booking.status === "detailed"
      );
      setBookings(filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Unable to fetch bookings");
    }
  };

  const fetchKoiFarms = async () => {
    try {
      const response = await axios.get(farmApi);
      setKoiFarms(response.data); // Lưu danh sách Koi Farms vào state
    } catch (error) {
      console.error("Error fetching Koi Farms:", error);
      message.error("Unable to fetch Koi Farms");
    }
  };

  const showModal = (booking) => {
    setViewingBooking(booking); // Đảm bảo rằng booking được truyền đúng
    form.setFieldsValue({
        customerId: booking.customerId,
        tripId: booking.tripId, // Thêm tripId
        fullname: booking.fullname,
        phone: booking.phone,
        email: booking.email,
        favoriteKoi: booking.favoriteKoi || [], // Khởi tạo là mảng nếu không có giá trị
        favoriteFarm: booking.favoriteFarm || [], // Khởi tạo là mảng nếu không có giá trị
        note: booking.note,
        status: booking.status,
        startDate: dayjs(booking.startDate),
        endDate: dayjs(booking.endDate),
        bookingDate: dayjs(booking.bookingDate),
    });
    setIsModalVisible(true);
  };

  const showTripModal = (booking) => {
    setViewingBooking(booking);

    if (booking.tripId) {
        // Booking đã có tripId, gọi API để lấy chi tiết trip
        axios.get(`http://localhost:8080/api/trips/${booking.tripId}`)
          .then(response => {
            const tripData = response.data;

            // Đặt giá trị vào form để chỉnh sửa trip
            tripForm.setFieldsValue({
              tripName: tripData.tripName,
              priceTotal: tripData.priceTotal,
              tripDetails: tripData.tripDetails,
              koiFarms: tripData.koiFarms
            });

            setIsEditingTrip(true); // Đặt cờ cho chế độ chỉnh sửa
          })
          .catch(error => {
            console.error("Error fetching trip details:", error);
            message.error("Unable to fetch trip details");
          });
    } else {
        // Chưa có tripId, chuẩn bị tạo trip mới
        setIsEditingTrip(false);
        tripForm.resetFields(); // Xóa sạch form để tạo mới
    }

    setIsTripModalVisible(true); // Hiển thị modal
};


  
  const handleOk = () => {
    form.validateFields().then((values) => {
        const bookingData = {
            ...values,
            startDate: values.startDate.format(),
            endDate: values.endDate.format(),
            favoriteKoi: values.favoriteKoi ? values.favoriteKoi.split(',').map(koi => koi.trim()) : [], // Chuyển đổi thành mảng
            favoriteFarm: values.favoriteFarm ? values.favoriteFarm.split(',').map(farm => farm.trim()) : [], // Chuyển đổi thành mảng
        };
        updateBooking(viewingBooking.bookingId, bookingData); // Cập nhật booking
        setIsModalVisible(false);
    });
  };

  // Hàm xử lý khi nhấn nút "OK" (Update trip)
  const handleTripOk = () => {
    tripForm.validateFields().then(async (values) => {
        if (isEditingTrip) {
            // Cập nhật trip hiện có
            axios.put(`http://localhost:8080/api/trips/${viewingBooking.tripId}`, values)
              .then(() => {
                message.success("Trip updated successfully");
                fetchBookings(); // Làm mới danh sách bookings
              })
              .catch((error) => {
                console.error("Error updating trip:", error);
                message.error("Unable to update trip");
              });
        } else {
            // Tạo mới trip
            axios.post('http://localhost:8080/api/trips', values)
              .then((response) => {
                const newTripId = response.data.tripId;
                // Cập nhật tripId vào booking
                return axios.put(`http://localhost:8080/api/bookings/${viewingBooking.bookingId}`, {
                  tripId: newTripId
                });
              })
              .then(() => {
                message.success("Trip created successfully");
                fetchBookings(); // Làm mới danh sách bookings
              })
              .catch((error) => {
                console.error("Error creating trip:", error);
                message.error("Unable to create trip");
              });
        }

        setIsTripModalVisible(false); // Đóng modal
    });
};

  const updateTripId = async (bookingId, tripId) => {
    try {
      // Giả sử bạn có đầy đủ dữ liệu booking hiện tại trong state `viewingBooking`
      const updatedBooking = { ...viewingBooking, tripId }; // Giữ nguyên các trường khác, ch cập nhật tripId
  
      console.log("Updating booking with tripId:", bookingId, tripId);
      await axios.put(`${bookingApi}/${bookingId}`, updatedBooking); // Gửi toàn bộ dữ liệu booking đã cập nhật
      message.success("Booking updated with tripId successfully");
    } catch (error) {
      console.error("Error updating booking with tripId:", error);
      message.error("Unable to update booking with tripId");
    }
  };
  

  const updateBooking = async (BookingID, bookingData) => {
    try {
      console.log("Updating booking with ID:", BookingID);
      console.log("Booking data to update:", bookingData); // Kiểm tra dữ liệu gửi đi
      
  
      await axios.put(`${bookingApi}/${BookingID}`, bookingData);
      message.success("Booking updated successfully");
      fetchBookings(); // Refresh bookings sau khi cập nhật
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Unable to update booking");
    }
  };
  

  const columns = [
    { title: "ID", dataIndex: "bookingId", key: "bookingId" },
    { title: "Name", dataIndex: "fullname", key: "fullname" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => showModal(record)}>Update Booking</Button>
      ),
    },
    {
      title: "Trip Details",
      key: "tripDetail",
      render: (_, record) => {
        if (record.tripId) {
          // Nếu booking đã có tripId thì hiện nút "View & Edit Trip"
          return (
            <Button onClick={() => showTripModal(record)}>View & Edit Trip</Button>
          );
        }
        // Nếu chưa có tripId thì hiện nút "Create Trip"
        return (
          <Button onClick={() => showTripModal(record)}>Create Trip</Button>
        );
      },
    }
  ];
  

  return (
    <div>
      <h1>Sales Staff Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={bookings.length}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pending Bookings"
              value={bookings.filter(b => b.status === "pending").length}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Rejected Bookings"
              value={bookings.filter(b => b.status === "rejected").length}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={bookings} rowKey="bookingId" />

      {/* Modal Cập Nhật Booking */}
      <Modal
        title="Update Booking"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tripId" label="Trip ID">
            <Input disabled />
          </Form.Item>
          <Form.Item name="fullname" label="Customer Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
          <Form.Item name="favoriteKoi" label="Favorite Koi">
            <Select mode="multiple" disabled>
              {Array.isArray(form.getFieldValue('favoriteKoi')) ? form.getFieldValue('favoriteKoi').map(koi => (
                  <Select.Option key={koi} value={koi}>
                      {koi}
                  </Select.Option>
              )) : null}
            </Select>
          </Form.Item>
          <Form.Item name="favoriteFarm" label="Favorite Farm">
            <Select mode="multiple" disabled>
              {Array.isArray(form.getFieldValue('favoriteFarm')) ? form.getFieldValue('favoriteFarm').map(farm => (
                  <Select.Option key={farm} value={farm}>
                      {farm}
                  </Select.Option>
              )) : null}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="detailed">Detailed</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <DatePicker disabled />
          </Form.Item>
          <Form.Item name="endDate" label="End Date">
            <DatePicker disabled />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea disabled />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Tạo/Chỉnh Sửa Trip */}
      <Modal
        title={isEditingTrip ? "Edit Trip" : "Create Trip"}
        open={isTripModalVisible}
        onOk={handleTripOk}
        onCancel={() => setIsTripModalVisible(false)}
        width={800}
      >
        <Form form={tripForm} layout="vertical">
  <Form.Item name="tripName" label="Trip Name">
    <Input placeholder="Enter trip name" />
  </Form.Item>

  <Form.Item name="priceTotal" label="Total Price">
    <InputNumber placeholder="Enter total price" style={{ width: '100%' }} />
  </Form.Item>

  <Form.List name="tripDetails">
    {(fields, { add, remove }) => (
      <>
        {fields.map((field) => (
          <Space key={field.key} align="baseline">
            <Form.Item {...field} name={[field.name, 'mainTopic']} label="Main Topic">
              <Input placeholder="Enter main topic" />
            </Form.Item>
            <Form.Item {...field} name={[field.name, 'subTopic']} label="Sub Topic">
              <Input placeholder="Enter sub topic" />
            </Form.Item>
            <Form.Item {...field} name={[field.name, 'notePrice']} label="Price Note">
              <Input placeholder="Enter price note" />
            </Form.Item>
            <Form.Item {...field} name={[field.name, 'day']} label="Day">
              <InputNumber min={1} />
            </Form.Item>
            <Button onClick={() => remove(field.name)}>Remove</Button>
          </Space>
        ))}
        <Button onClick={() => add()}>Add Trip Detail</Button>
      </>
    )}
  </Form.List>

  <Form.List name="koiFarms">
    {(fields) => (
      <>
        {fields.map((field) => (
          <div key={field.key}>
            <h4>{tripForm.getFieldValue(['koiFarms', field.name, 'farmName'])}</h4>
            <p>{tripForm.getFieldValue(['koiFarms', field.name, 'location'])}</p>
            <img src={tripForm.getFieldValue(['koiFarms', field.name, 'imageUrl'])} alt="Farm Image" style={{ width: '100%' }} />
          </div>
        ))}
      </>
    )}
  </Form.List>
</Form>

      </Modal>
    </div>
);

}

export default SalesDashboard;
