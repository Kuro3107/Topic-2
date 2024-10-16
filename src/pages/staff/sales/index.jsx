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
    setViewingBooking(booking); // Lưu toàn bộ đối tượng booking, bao gồm cả tripId nếu có
    tripForm.setFieldsValue({
        tripName: booking.tripName, // Giả sử tripName có trong booking
        koiFarmIds: booking.koiFarmIds || [], // Giả sử koiFarmIds có trong booking
        // Thêm các trường khác của trip nếu cần
    });
    setIsTripModalVisible(true); // Mở modal để xem và chỉnh sửa
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
    if (!viewingBooking || !viewingBooking.bookingId) {
      console.error("Viewing booking is not set or bookingId is undefined");
      message.error("Unable to process: bookingId is undefined");
      return;
    }

    const tripData = {
      ...values,
      bookingId: viewingBooking.bookingId,
    };

    try {
      if (viewingBooking.tripId) {
        // Nếu đã có tripId, thì chỉnh sửa trip
        await axios.put(`${tripApi}/${viewingBooking.tripId}`, tripData);
        message.success("Trip updated successfully");
      } else {
        // Nếu chưa có tripId, thì tạo mới trip
        const response = await axios.post(tripApi, tripData);
        const tripId = response.data.tripId;
        await updateTripId(viewingBooking.bookingId, tripId);
        message.success("Trip created successfully");
      }

      fetchBookings(); // Làm mới danh sách bookings sau khi cập nhật
    } catch (error) {
      console.error("Error processing trip:", error);
      message.error("Unable to process trip");
    }

    setIsTripModalVisible(false); // Đóng modal sau khi hoàn thành
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
          return (
            <>
              <Button onClick={() => showTripModal(record)}>
                View & Edit Trip
              </Button>
              {/* Hiển thị thông tin trip nếu cần */}
              {viewingBooking && viewingBooking.tripId === record.tripId && (
                <div>
                  {/* Hiển thị thông tin trip ở đây */}
                  <p>Trip ID: {record.tripId}</p>
                  {/* Thêm các thông tin khác của trip nếu cần */}
                </div>
              )}
            </>
          );
        }
        return (
          <Button onClick={() => showTripModal(record)}>Create Trip</Button>
        );
      },
    },
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

      <Modal
        title="Update Booking"
        visible={isModalVisible}
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

      <Modal
        title="Create Trip"
        visible={isTripModalVisible}
        onOk={handleTripOk}
        onCancel={() => setIsTripModalVisible(false)}
        width={800}
      >
        <Form form={tripForm} layout="vertical">
          <Form.Item
            name="tripName"
            label="Trip Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="koiFarmIds"
            label="Select Koi Farms"
            rules={[{ required: true, message: "Please select at least one Koi Farm" }]}
          >
            <Select mode="multiple" placeholder="Select Koi Farms">
              {koiFarms.map(farm => (
                <Select.Option key={farm.farmId} value={farm.farmId}>
                  {farm.farmName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.List name="tripdetailed">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Card key={key} style={{ marginBottom: 16 }}>
                    <Row gutter={16} align="middle">
                      <Col span={4}>
                        <Form.Item
                          {...restField}
                          name={[name, "day"]}
                          rules={[{ required: true, message: "Missing day" }]}
                        >
                          <InputNumber
                            min={1}
                            placeholder="Day"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "mainTopic"]}
                          rules={[{ required: true, message: "Missing main topic" }]}
                        >
                          <Input placeholder="Main Topic" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...restField}
                          name={[name, "priceNote"]}
                          rules={[{ required: true, message: "Missing price" }]}
                        >
                          <InputNumber
                            min={0}
                            placeholder="Price"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Button
                          onClick={() => remove(name)}
                          danger
                          style={{ width: "100%" }}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Trip Detail
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}

export default SalesDashboard;
