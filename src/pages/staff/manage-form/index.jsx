import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiBooking = "http://localhost:8080/api/booking";

const ManageForm = () => {
  const [bookings, setBookings] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  // Fetch booking data
  const fetchBookings = async () => {
    try {
      const response = await axios.get(apiBooking);
      setBookings(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách booking");
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(`${apiBooking}/${id}`);
      message.success("Đã hủy booking thành công");
      fetchBookings();
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy booking");
      console.error("Error deleting booking:", error);
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/booking/${bookingId}`); // Navigate to a booking details page
  };

  const columns = [
    {
      title: "Số thứ tự",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index) => index + 1, // Automatically assign index as order number
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"), // Format date
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "confirmed" ? "Đã xác nhận" : "Chờ xử lý"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`, // Format price
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewBooking(record.id)}>Xem</Button>
          <Button
            onClick={() => handleCancelBooking(record.id)}
            danger
            style={{ marginLeft: 8 }}
          >
            Hủy
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý Booking</h1>
      <Table columns={columns} dataSource={bookings} rowKey="id" />
      {/* Modal logic can be added for detailed view, if required */}
    </div>
  );
};

export default ManageForm;
