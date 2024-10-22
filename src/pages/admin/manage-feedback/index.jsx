import { Button, Table, Modal, message, Rate } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import axios from "axios";
import dayjs from "dayjs";

function ManageFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [selectedTripDetails, setSelectedTripDetails] = useState(null);

  // API URLs
  const feedbackApi = "http://localhost:8080/api/feedbacks";
  const bookingApi = "http://localhost:8080/api/bookings";
  const tripsApi = "http://localhost:8080/api/trips";

  // Fetch feedback data
  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get(feedbackApi);
      setFeedbackData(response.data);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
      message.error("Could not fetch feedback data.");
    }
  };

  // Fetch booking data
  const fetchBookingData = async () => {
    try {
      const response = await axios.get(bookingApi);
      setBookingData(response.data);
    } catch (error) {
      console.error("Error fetching booking data:", error);
      message.error("Could not fetch booking data.");
    }
  };

  // Fetch both feedback and booking data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy dữ liệu từ API cho booking và feedback
        const feedbackResponse = await api.get("/feedbacks");
        const bookingResponse = await api.get("/bookings");
        
        setFeedbackData(feedbackResponse.data); // Set feedback data
        setBookingData(bookingResponse.data); // Set booking data
      } catch (error) {
        console.error("Error fetching feedback or booking data:", error);
      }
    };

    fetchData();
  }, []);

  // Định nghĩa các cột cho bảng
  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (text) => <Rate disabled value={text} />, // Hiển thị đánh giá bằng hình ngôi sao
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  // Kết hợp dữ liệu booking và feedback
  const combinedData = bookingData.map(booking => {
    const feedback = feedbackData.find(f => f.feedbackId === booking.feedbackId) || {};
    return {
      bookingId: booking.bookingId,
      bookingDate: booking.bookingDate,
      fullName: booking.fullname,
      phone: booking.phone,
      email: booking.email,
      rating: feedback.rating || 0, // Đảm bảo giá trị mặc định là 0
      comment: feedback.comments || 'N/A',
    };
  });

  return (
    <div>
      <h1>Manage Feedback</h1>
      <Table columns={columns} dataSource={combinedData} rowKey="bookingId" />
    </div>
  );
}

export default ManageFeedback;
