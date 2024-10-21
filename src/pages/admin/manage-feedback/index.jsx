import { Button, Table, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import axios from "axios";

function ManageFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null); // Tour details
  const [selectedAccount, setSelectedAccount] = useState(null); // Customer details
  const [openAccountDialog, setOpenAccountDialog] = useState(false); // Modal control for customer info
  const [bookingData, setBookingData] = useState([]); // Data for bookings

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch feedback data
        const feedbackResponse = await api.get("/feedbacks");
        setFeedbackData(feedbackResponse.data); // Set feedback data to state

        // Fetch booking data
        const bookingResponse = await api.get("/bookings");
        setBookingData(bookingResponse.data); // Set booking data to state
      } catch (error) {
        console.error("Error fetching feedback or booking data:", error);
      }
    };

    fetchData();
  }, []);

  const handleViewInfo = async (customerId) => {
    try {
      const accountResponse = await api.get(`/api/accounts/${customerId}`);
      if (accountResponse.data) {
        setSelectedAccount(accountResponse.data); // Store customer info in state
        setOpenAccountDialog(true); // Open account dialog
      } else {
        message.error("No account details found.");
      }
    } catch (error) {
      console.error("Error fetching account info:", error);
      message.error("An error occurred while fetching account details.");
    }
  };

  // Define table columns
  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate", // Use booking data for booking date
      key: "bookingDate",
      render: (text, record) => {
        const booking = bookingData.find(
          (b) => b.bookingId === record.bookingId
        );
        return booking ? booking.bookingDate : "";
      },
    },
    {
      title: "Rating",
      dataIndex: "rating", // Use feedback data for rating
      key: "rating",
    },
    {
      title: "Comments",
      dataIndex: "comments", // Use feedback data for comments
      key: "comments",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => viewTripDetails(record.bookingId)} // Chuyển đổi nút view booking để gọi viewTripDetails
            style={{ marginRight: 8 }}
          >
            View Booking
          </Button>
          <Button onClick={() => handleViewInfo(record.customerId)}>
            View Info
          </Button>
        </>
      ),
    },
  ];

  // Function to view trip details similar to ManageBooking
  const viewTripDetails = async (bookingId) => {
    try {
      const responseTrips = await axios.get(`http://localhost:8080/api/trips`); // Gọi API để lấy tất cả các chuyến đi
      const responseFarms = await axios.get(`http://localhost:8080/api/farms`); // Gọi API để lấy tất cả các trang trại

      const booking = bookingData.find(b => b.bookingId === bookingId);
      if (!booking) {
        message.warning("Không tìm thấy đặt chỗ.");
        return;
      }

      const trips = responseTrips.data.filter(trip => trip.tripId === booking.tripId);
      
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
      <h1>Manage Feedback</h1>
      <Table columns={columns} dataSource={feedbackData} rowKey="id" />

      {/* Modal for Viewing Account Info */}
      <Modal
        title="Customer Information"
        visible={openAccountDialog}
        onCancel={() => setOpenAccountDialog(false)}
        footer={null}
      >
        {selectedAccount ? (
          <div>
            <p><strong>Name:</strong> {selectedAccount.fullName}</p>
            <p><strong>Email:</strong> {selectedAccount.email}</p>
            <p><strong>Phone:</strong> {selectedAccount.phone}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </div>
  );
}

export default ManageFeedback;
