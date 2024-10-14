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
  List,
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
  const [trips, setTrips] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tripForm] = Form.useForm();
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  const bookingApi = "https://6704fc27031fd46a830e2ee2.mockapi.io/BookingForm";
  const tripApi = "https://6704fc27031fd46a830e2ee2.mockapi.io/Trip";

  useEffect(() => {
    fetchBookings();
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

      filteredBookings.forEach((booking) =>
        fetchTripDetails(booking.BookingID)
      );
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Unable to fetch bookings");
    }
  };

  const fetchTripDetails = async (bookingId) => {
    try {
      const response = await axios.get(`${tripApi}?BookingID=${bookingId}`);
      setTrips((prevTrips) => ({
        ...prevTrips,
        [bookingId]: response.data[0], // Assuming one trip per booking
      }));
    } catch (error) {
      console.error(
        `Error fetching trip details for booking ${bookingId}:`,
        error
      );
    }
  };

  const showModal = (booking) => {
    setViewingBooking(booking);
    form.setFieldsValue({
      ...booking,
      startDate: dayjs(booking.startDate),
      endDate: dayjs(booking.endDate),
    });
    setIsModalVisible(true);
  };

  const showTripModal = (bookingId) => {
    let trip = trips[bookingId];
    if (!trip) {
      // Tạo một trip mới nếu không tồn tại
      trip = {
        tripName: `Trip for Booking ${bookingId}`,
        priceTotal: 0,
        tripdetailed: [
          {
            day: 1,
            mainTopic: "",
            subTopic: "",
            priceNote: 0
          }
        ],
        BookingID: bookingId
      };
      // Cập nhật state trips với trip mới
      setTrips(prevTrips => ({
        ...prevTrips,
        [bookingId]: trip
      }));
    }
    
    setEditingTrip(trip);
    tripForm.setFieldsValue({
      ...trip,
      tripdetailed: trip.tripdetailed.map(detail => ({
        ...detail,
        priceNote: Number(detail.priceNote)
      }))
    });
    setIsTripModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const bookingData = {
        ...values,
        startDate: values.startDate.format(),
        endDate: values.endDate.format(),
      };
      updateBooking(viewingBooking.BookingID, bookingData);
      setIsModalVisible(false);
    });
  };

  const handleTripOk = () => {
    tripForm.validateFields().then((values) => {
      const tripData = {
        ...values,
        priceTotal: values.tripdetailed.reduce(
          (sum, detail) => sum + detail.priceNote,
          0
        ),
      };

      if (editingTrip.id) {
        // Cập nhật trip hiện có
        updateTrip(editingTrip.id, tripData);
      } else {
        // Tạo mới trip
        createTrip(tripData);
      }
      setIsTripModalVisible(false);
    });
  };

  const createTrip = async (tripData) => {
    try {
      const response = await axios.post(tripApi, tripData);
      message.success("Trip created successfully");
      fetchBookings(); // Refresh data after creating new trip
    } catch (error) {
      console.error("Error creating trip:", error);
      message.error("Unable to create trip");
    }
  };

  const updateTrip = async (tripId, tripData) => {
    try {
      await axios.put(`${tripApi}/${tripId}`, tripData);
      message.success("Trip updated successfully");
      fetchBookings(); // Refresh data after updating trip
    } catch (error) {
      console.error("Error updating trip:", error);
      message.error("Unable to update trip");
    }
  };

  const updateBooking = async (BookingID, bookingData) => {
    try {
      await axios.put(`${bookingApi}/${BookingID}`, bookingData);
      message.success("Booking updated successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Unable to update booking");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "BookingID", key: "BookingID" },
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
      render: (_, record) => (
        <Button onClick={() => showTripModal(record.BookingID)}>
          Edit Trip
        </Button>
      ),
    },
  ];

  const getStatistics = () => {
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    ).length;
    const rejectedBookings = bookings.filter(
      (b) => b.status === "rejected"
    ).length;

    return {
      totalBookings,
      pendingBookings,
      rejectedBookings,
    };
  };

  const stats = getStatistics();

  return (
    <div>
      <h1>Sales Staff Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.totalBookings}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Pending Bookings"
              value={stats.pendingBookings}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Rejected Bookings"
              value={stats.rejectedBookings}
              prefix={<CheckOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Table columns={columns} dataSource={bookings} rowKey="BookingID" />

      <Modal
        title="Update Booking"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="fullname" label="Customer Name">
            <Input disabled />
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
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Trip"
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
                          rules={[
                            { required: true, message: "Missing main topic" },
                          ]}
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
                            formatter={(value) =>
                              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
                    <Form.Item
                      {...restField}
                      name={[name, "subTopic"]}
                      label="Sub Topic"
                    >
                      <Input.TextArea rows={3} />
                    </Form.Item>
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
