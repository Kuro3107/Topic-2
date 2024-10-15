import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

function ManageBooking() {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBooking, setEditingBooking] = useState(null);

  const api = "http://localhost:8080/api/bookings"; // Cập nhật URL API

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(api); // Lấy dữ liệu từ API
      const updatedBookings = response.data.map((booking) => ({
        ...booking,
        isActive: booking.status !== "delivered",
      }));
      setBookings(updatedBookings);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đặt chỗ:", error);
      message.error("Không thể lấy danh sách đặt chỗ");
    }
  };

  const showModal = (booking = null) => {
    if (booking && !booking.isActive) {
      message.warning("Không thể chỉnh sửa booking đã không còn hoạt động");
      return;
    }
    setEditingBooking(booking);
    if (booking) {
      form.setFieldsValue({
        ...booking,
        startDate: dayjs(booking.startDate),
        endDate: dayjs(booking.endDate),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const bookingData = {
        ...values,
        startDate: values.startDate.format(),
        endDate: values.endDate.format(),
        isActive: values.status !== "delivered",
      };
      if (editingBooking) {
        updateBooking(editingBooking.BookingID, bookingData);
      } else {
        createBooking(bookingData);
      }
      setIsModalVisible(false);
    });
  };

  const createBooking = async (bookingData) => {
    try {
      await axios.post(api, bookingData);
      message.success("Đã tạo đặt chỗ mới");
      fetchBookings();
    } catch (error) {
      console.error("Lỗi khi tạo đặt chỗ:", error);
      message.error("Không thể tạo đặt chỗ mới");
    }
  };

  const updateBooking = async (BookingID, bookingData) => {
    try {
      await axios.put(`${api}/${BookingID}`, bookingData);
      message.success("Đã cập nhật đặt chỗ");
      fetchBookings();
    } catch (error) {
      console.error("Lỗi khi cập nhật đặt chỗ:", error);
      message.error("Không thể cập nhật đặt chỗ");
    }
  };

  const deleteBooking = async (BookingID) => {
    try {
      await axios.delete(`${api}/${BookingID}`);
      message.success("Đã xóa đặt chỗ");
      fetchBookings();
    } catch (error) {
      console.error("Lỗi khi xóa đặt chỗ:", error);
      message.error("Không thể xóa đặt chỗ");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "bookingId", key: "bookingId" }, // Cập nhật dataIndex cho bookingId
    { title: "Tên", dataIndex: "fullname", key: "fullname" },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Koi yêu thích", dataIndex: "favoriteKoi", key: "favoriteKoi" },
    {
      title: "Trang trại yêu thích",
      dataIndex: "favoriteFarm",
      key: "favoriteFarm",
    },
    {
      title: "Hoạt động",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Có" : "Không"),
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)} disabled={!record.isActive}>
            Sửa
          </Button>
          <Button
            onClick={() => deleteBooking(record.BookingID)}
            danger
            disabled={!record.isActive}
          >
            Xóa
          </Button>
        </>
      ),
    },
    {
      title: "View Trip Detail",
      key: "view",
      render: (_, record) => (
        <Button onClick={() => showModal(record)}>View</Button>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm đặt chỗ mới
      </Button>
      <Table columns={columns} dataSource={bookings} rowKey="BookingID" />
      <Modal
        title={editingBooking ? "Sửa đặt chỗ" : "Thêm đặt chỗ mới"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullname"
            label="Tên đầy đủ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="detailed">Detailed</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
              <Select.Option value="delivered">Delivered</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="favoriteKoi" label="Koi yêu thích">
            <Input />
          </Form.Item>
          <Form.Item name="favoriteFarm" label="Trang trại yêu thích">
            <Input />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="district" label="Quận/Huyện">
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
            <Switch disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageBooking;
