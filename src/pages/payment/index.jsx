/* eslint-disable no-unused-vars */
import React, { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, message, Card, Typography, Descriptions, Spin } from "antd";
import api from "../../config/axios";
import "./index.css";

const { Title } = Typography;

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceTotal, setPriceTotal] = useState(null);
  const [paymentProcessed, setPaymentProcessed] = useState(false); // Trạng thái ngăn lặp lại
  
  const bookingId = location.state?.order?.bookingId; // Lấy bookingId từ location

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (!bookingId) {
          navigate("/profile");
          return;
        }
        const response = await api.get(`/bookings/${bookingId}`);
        setBooking(response.data);

        if (response.data.tripId) {
          const tripResponse = await api.get(`/trips/${response.data.tripId}`);
          setPriceTotal(tripResponse.data.priceTotal);
        }
      } catch (error) {
        message.error("An error occurred while loading order information.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    try {
      const orderId = bookingId;
      const amount = priceTotal;

      const response = await api.post(`/vnpay/purchase?orderId=${orderId}&amount=${amount}`);
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        message.error("An error occurred while processing payment.");
      }
    } catch (error) {
      console.error("Error when paying:", error);
      message.error("An error occurred while making payment. Please try again.");
    }
  };

  

  const handlePaymentResult = useCallback(async () => {
    console.log("handlePaymentResult called");
  if (paymentProcessed || !booking) {
    console.log("Skipping because paymentProcessed is true or booking is null");
    return;
  }
    setPaymentProcessed(true); // Đánh dấu đã xử lý

    try {
      const params = new URLSearchParams(window.location.search);
      const responseCode = params.get("vnp_ResponseCode");
      const txnRef = params.get("vnp_TxnRef");

      if (responseCode === "00" && String(txnRef) === String(booking?.bookingId)) {
        await api.put(`/bookings/${booking.bookingId}`, { ...booking, status: "Purchased" });
        message.success("Payment successful!");
        setTimeout(() => navigate("/profile", { replace: true, state: { fromVnPay: true } }), 1000);
      } else {
        message.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error handling payment result:", error);
      message.error("An error occurred while processing payment.");
    }
  }, [booking, navigate, paymentProcessed]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const message = query.get('message');
    if (message === 'success') {
        alert('Payment successful!');
    } else if (message === 'failure') {
        alert('Payment failed. Please try again.');
    } else if(message === 'retry'){
      alert('Please purchase again')
    }

}, []);


  useEffect(() => {
    console.log("useEffect triggered");
    const searchParams = new URLSearchParams(window.location.search);
    const responseCode = searchParams.get("vnp_ResponseCode");
    console.log("Response code from URL:", responseCode);
  
    if (responseCode) {
      handlePaymentResult();
    }
  }, [handlePaymentResult]);
  

  const handleCancelPayment = () => {
    navigate("/profile");
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
        <Title level={2} className="payment-title">Order Payment</Title>
        <Descriptions bordered>
          <Descriptions.Item label="Order ID" span={3}>
            {booking.bookingId}
          </Descriptions.Item>
          <Descriptions.Item label="Booking Date" span={3}>
            {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
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
            {booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="End Date" span={3}>
            {booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A"}
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
          Exit
        </Button>
      </Card>
    </div>
  );
}

export default Payment;


