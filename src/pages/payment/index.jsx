import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, message, Card, Typography, Descriptions, Spin } from "antd";
import { useState, useEffect } from "react";
import api from "../../config/axios";
import "./index.css";

const { Title } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const bookingId = location.state?.order?.bookingId;
        if (!bookingId) {
          message.error("Order information not found.");
          navigate("/profile");
          return;
        }
        const response = await api.get(`/bookings/${bookingId}`);
        console.log("Fetched booking data:", response.data);
        setBooking(response.data);
      } catch (error) {
        console.error("Error loading order information:", error);
        message.error("An error occurred while loading order information.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [location.state, navigate]);

  const handlePayment = async () => {
    try {
      await api.put(`/bookings/${booking.bookingId}`, {
        ...booking,
        status: "Purchased",
      });
      message.success("Payment successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Error when paying:", error);
      message.error(
        "An error occurred while making payment. Please try again."
      );
    }
  };

  const handleCancelPayment = () => {
    navigate("/profile"); // Quay lại trang hồ sơ
  };

  if (loading) {
    return (
      <div className="payment-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return <div className="payment-container">No order information</div>;
  }

  return (
    <div className="payment-container">
      <Card className="payment-card">
        <Title level={2} className="payment-title">
          Order Payment
        </Title>
        <Descriptions bordered>
          <Descriptions.Item label="Order ID" span={3}>
            {booking.bookingId}
          </Descriptions.Item>
          <Descriptions.Item label="Booking Date" span={3}>
            {booking.bookingDate
              ? new Date(booking.bookingDate).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Full Name" span={3}>
            {booking.fullname || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>
            {booking.email || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number" span={3}>
            {booking.phone || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date" span={3}>
            {booking.startDate
              ? new Date(booking.startDate).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="End Date" span={3}>
            {booking.endDate
              ? new Date(booking.endDate).toLocaleDateString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={3}>
            {booking.status || "N/A"}
          </Descriptions.Item>
         
        </Descriptions>
        <Button
          type="primary"
          onClick={handlePayment}
          className="payment-button"
          disabled={booking.status === "Purchased"}
        >
          {booking.status === "Purchased" ? "Purchased" : "Purchase Now"}
        </Button>
        <Button
          type="default"
          onClick={handleCancelPayment}
          className="cancel-button"
        >
          Cancel Payment
        </Button>
      </Card>
    </div>
  );
}

export default Payment;
