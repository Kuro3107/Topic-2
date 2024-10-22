import React, { useState, useEffect } from "react";
import { Table, Button, Modal, message } from "antd";
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
    fetchFeedbackData();
    fetchBookingData();
  }, []);

  // View Trip Details function
  const handleViewTripDetails = async (bookingId) => {
    try {
      const booking = bookingData.find(b => b.bookingId === bookingId);
      if (!booking) {
        message.warning("No booking found.");
        return;
      }

      const tripResponse = await axios.get(tripsApi);
      const tripDetails = tripResponse.data.find(trip => trip.tripId === booking.tripId);

      if (tripDetails) {
        setSelectedTripDetails(tripDetails);
        setIsTripModalVisible(true);
      } else {
        message.warning("No trip details found for this booking.");
      }
    } catch (error) {
      console.error("Error fetching trip details:", error);
      message.error("Could not fetch trip details.");
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
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text, record) => {
        const booking = bookingData.find(b => b.bookingId === record.bookingId);
        return booking ? dayjs(booking.bookingDate).format("DD/MM/YYYY") : "N/A";
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => handleViewTripDetails(record.bookingId)}>
            View Trip Details
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Feedback</h1>
      <Table columns={columns} dataSource={feedbackData} rowKey="id" />

      {/* Modal for Viewing Trip Details */}
      <Modal
        title="Trip Details"
        visible={isTripModalVisible}
        onCancel={() => setIsTripModalVisible(false)}
        footer={null}
      >
        {selectedTripDetails ? (
          <div>
            <p><strong>Trip Name:</strong> {selectedTripDetails.tripName}</p>
            <p><strong>Total Price:</strong> {selectedTripDetails.priceTotal} VNĐ</p>
            <img
              src={selectedTripDetails.imageUrl}
              alt={selectedTripDetails.tripName}
              style={{ width: "100%", height: "auto" }}
            />
            <h4>Trip Details:</h4>
            {selectedTripDetails.tripDetails.map(detail => (
              <div key={detail.tripDetailId}>
                <p>Day: {detail.day}</p>
                <p>Main Topic: {detail.mainTopic}</p>
                <p>Sub Topic: {detail.subTopic || "None"}</p>
                <p>Price Note: {detail.notePrice} VNĐ</p>
              </div>
            ))}
            <h4>Koi Farms:</h4>
            {selectedTripDetails.koiFarms.map(farm => (
              <div key={farm.farmId}>
                <p>Farm Name: {farm.farmName}</p>
                <p>Location: {farm.location}</p>
                <p>Contact Info: {farm.contactInfo}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading trip details...</p>
        )}
      </Modal>
    </div>
  );
}

export default ManageFeedback;
