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
        status: values.status, // Chỉ gửi trạng thái
      };
      if (editingBooking && editingBooking.bookingId) { // Kiểm tra BookingID
        const updatedData = { ...editingBooking, ...bookingData }; // Giữ nguyên các trường khác
        updateBooking(editingBooking.bookingId, updatedData); // Cập nhật chỉ trạng thái
      } else {
        message.error("Không có ID đặt chỗ để cập nhật."); // Thông báo lỗi nếu không có ID
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
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thc",
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
            onClick={() => deleteBooking(record.bookingId)} // Sửa lại để sử dụng bookingId
            danger
            disabled={!record.isActive}
          >
            Xóa
          </Button>
          <Button onClick={() => viewTripDetails(record.bookingId)}>
            View Trip Detail
          </Button>
        </>
      ),
    },
  ];

  const viewTripDetails = async (bookingId) => {
    try {
        const responseTrips = await axios.get(`http://localhost:8080/api/trips`); // Gọi API để lấy tất cả các chuyến đi
        const responseFarms = await axios.get(`http://localhost:8080/api/farms`); // Gọi API để lấy tất cả các trang trại

        // Lấy trip_id từ booking tương ứng
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (!booking) {
            message.warning("Không tìm thấy đặt chỗ.");
            return;
        }

        // Lọc chuyến đi theo trip_id từ booking
        const trips = responseTrips.data.filter(trip => trip.tripId === booking.tripId);
        
        // Hiển thị thông tin chuyến đi
        if (trips.length > 0) {
            Modal.info({
                title: 'Chi tiết chuyến đi',
                content: (
                    <div>
                        {trips.map(trip => (
                            <div key={trip.tripId}>
                                <p>Trip ID: {trip.tripId}</p>
                                <p>Tên chuyến đi: {trip.tripName}</p>
                                <p>Tổng giá: {trip.priceTotal} VNĐ</p>
                                <img src={trip.imageUrl} alt={trip.tripName} style={{ width: '100%', height: 'auto' }} />
                                
                                <h4>Chi tiết chuyến đi:</h4>
                                {trip.tripDetails.map(detail => (
                                    <div key={detail.tripDetailId}>
                                        <p>Ngày: {detail.day}</p>
                                        <p>Chủ đề chính: {detail.mainTopic}</p>
                                        <p>Chủ đề phụ: {detail.subTopic || 'Không có'}</p>
                                        <p>Giá ghi chú: {detail.notePrice} VNĐ</p>
                                    </div>
                                ))}
                                
                                <h4>Trang trại Koi:</h4>
                                {trip.koiFarms.map(farm => (
                                    <div key={farm.farmId}>
                                        <p>Tên trang trại: {farm.farmName}</p>
                                        <p>Địa điểm: {farm.location}</p>
                                        <p>Thông tin liên hệ: {farm.contactInfo}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ),
                onOk() {},
            });
        } else {
            message.warning("Không có chuyến đi nào cho đặt chỗ này.");
        }
    } catch (error) {
        console.error("Lỗi khi lấy thông tin chuyến đi:", error);
        message.error("Không thể lấy thông tin chuyến đi");
    }
};


  return (
    <div>
      {/* Xóa nút "Thêm đặt chỗ mới" */}
      {/* <Button
        onClick={() => showModal()}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Thêm đặt chỗ mới
      </Button> */}
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
              {/* <Select.Option value="pending">Pending</Select.Option> */}
              <Select.Option value="detailed">Detailed</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              <Select.Option value="rejected">Rejected</Select.Option>
              {/* <Select.Option value="delivered">Delivered</Select.Option> */}
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
        
          <Form.Item name="isActive" label="Hoạt động" valuePropName="checked">
            <Switch disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageBooking;
