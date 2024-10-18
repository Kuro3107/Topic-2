import { useState, useEffect } from "react";
import { Table, Button, message, Space, Modal } from "antd";
import api from "../../../config/axios";

function Consulting() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      const filteredBookings = response.data.filter(
        (booking) =>
          booking.status === "purchased" || booking.status === "checkin"
      );
      setBookings(filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const currentBooking = bookings.find(
        (booking) => booking.bookingId === bookingId
      );
      if (!currentBooking) {
        throw new Error("Booking not found");
      }
      const updatedBooking = { ...currentBooking, status: newStatus };
      await api.put(`/bookings/${bookingId}`, updatedBooking);
      message.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Failed to update booking status");
    }
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
    // { title: 'Customer Name', dataIndex: 'fullname', key: 'fullname' },
    // { title: 'Email', dataIndex: 'email', key: 'email' },
    // { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button onClick={() => showBookingDetails(record)}>
            View Details
          </Button>
          {record.status === "purchased" && (
            <Button
              onClick={() => handleStatusChange(record.bookingId, "checkin")}
            >
              Check In
            </Button>
          )}
          {record.status === "checkin" && (
            <Button
              onClick={() => handleStatusChange(record.bookingId, "checkout")}
            >
              Check Out
            </Button>
          )}
          {
            <Button
              onClick={() => handleStatusChange(record.bookingId, "cancel")}
            >
              Create Purchase Order
            </Button>
          }
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Consulting Staff Dashboard</h1>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="bookingId"
        loading={loading}
      />
      <Modal
        title="Booking Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <p>
              <strong>Booking ID:</strong> {selectedBooking.bookingId}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedBooking.fullname}
            </p>
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedBooking.phone}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(selectedBooking.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(selectedBooking.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {selectedBooking.status}
            </p>
            <p>
              <strong>Favorite Farms:</strong>{" "}
              {selectedBooking.favoriteFarm || "N/A"}
            </p>
            <p>
              <strong>Favorite Koi:</strong>{" "}
              {selectedBooking.favoriteKoi || "N/A"}
            </p>
            <p>
              <strong>Note:</strong> {selectedBooking.note || "N/A"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Consulting;
