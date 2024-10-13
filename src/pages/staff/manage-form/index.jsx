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
      message.error("Unable to load booking list");
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(`${apiBooking}/${id}`);
      message.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      message.error("An error occurred while canceling the booking.");
      console.error("Error deleting booking:", error);
    }
  };

  const handleViewBooking = (bookingId) => {
    navigate(`/booking/${bookingId}`); // Navigate to a booking details page
  };

  const columns = [
    {
      title: "No",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index) => index + 1, // Automatically assign index as order number
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text) => new Date(text).toLocaleDateString("vi-VN"), // Format date
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "confirmed" ? "Confirmed" : "Pending processing"),
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toLocaleString("vi-VN")} VND`, // Format price
    },
    {
      title: "Action",
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
      <h1>Booking Management</h1>
      <Table columns={columns} dataSource={bookings} rowKey="id" />
      {/* Modal logic can be added for detailed view, if required */}
    </div>
  );
};

export default ManageForm;
