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
          message.error("Không tìm thấy thông tin đơn hàng.");
          navigate('/profile');
          return;
        }
        const response = await api.get(`/bookings/${bookingId}`);
        console.log("Fetched booking data:", response.data);
        setBooking(response.data);
      } catch (error) {
        console.error('Lỗi khi tải thông tin đơn hàng:', error);
        message.error('Có lỗi xảy ra khi tải thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [location.state, navigate]);

  const handlePayment = async () => {
    try {
      await api.put(`/bookings/${booking.bookingId}`, { ...booking, status: 'purchased' });
      message.success('Thanh toán thành công!');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi khi thanh toán:', error);
      message.error('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="payment-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return <div className="payment-container">Không có thông tin đơn hàng</div>;
  }

  return (
    <div className="payment-container">
      <Card className="payment-card">
        <Title level={2} className="payment-title">Thanh toán đơn hàng</Title>
        <Descriptions bordered>
          <Descriptions.Item label="Mã đơn hàng" span={3}>{booking.bookingId}</Descriptions.Item>
          <Descriptions.Item label="Ngày đặt" span={3}>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Họ tên" span={3}>{booking.fullname || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>{booking.email || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại" span={3}>{booking.phone || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu" span={3}>{booking.startDate ? new Date(booking.startDate).toLocaleDateString() : 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc" span={3}>{booking.endDate ? new Date(booking.endDate).toLocaleDateString() : 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái" span={3}>{booking.status || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Tổng tiền" span={3}>{booking.totalAmount || 'N/A'} VND</Descriptions.Item>
        </Descriptions>
        <Button type="primary" onClick={handlePayment} className="payment-button" disabled={booking.status === 'purchased'}>
          {booking.status === 'purchased' ? 'Đã thanh toán' : 'Thanh toán ngay'}
        </Button>
      </Card>
    </div>
  );
}

export default Payment;
