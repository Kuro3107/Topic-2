import { Button, Table, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import { ShoppingOutlined } from "@ant-design/icons";

function ManageFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null); // Tour details
  const [selectedAccount, setSelectedAccount] = useState(null); // Customer details
  const [openTourDialog, setOpenTourDialog] = useState(false); // Modal control for tour
  const [openAccountDialog, setOpenAccountDialog] = useState(false); // Modal control for customer info
  const [bookingData, setBookingData] = useState([]); // Data for bookings

  // Fetch feedback and booking data on component mount
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

  // Handle View Booking (trip details)
  const handleViewBooking = async (bookingId) => {
    const bookingDetails = bookingData.find(
      (booking) => booking.bookingId === bookingId
    );

    if (!bookingDetails) {
      toast.error("Booking not found.");
      return;
    }

    // Fetch associated trip details if tripId is available
    if (bookingDetails.tripId) {
      try {
        const tripResponse = await api.get(
          `/api/trips/${bookingDetails.tripId}`
        );
        if (tripResponse.data) {
          setSelectedTour(tripResponse.data); // Store trip details in state
          setOpenTourDialog(true); // Open tour dialog
        } else {
          toast.error("No trip details found.");
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("An error occurred while fetching trip details.");
      }
    } else {
      toast.error("Trip ID not found in booking details.");
    }
  };

  // Handle View Info (customer profile)
  const handleViewInfo = async (customerId) => {
    try {
      const accountResponse = await api.get(
        `/api/accounts/${customerId}`
      );
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
            onClick={() => handleViewBooking(record.bookingId)} // Handle booking view
            icon={<ShoppingOutlined />}
            style={{ marginRight: 8 }}
          >
            View Booking
          </Button>
          <Button
            onClick={() => handleViewInfo(record.customerId)} // Handle customer info view
          >
            View Info
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Feedback</h1>
      <Table columns={columns} dataSource={feedbackData} rowKey="id" />

      {/* Modal for Viewing Tour */}
      <Modal
        title="Tour Details"
        visible={openTourDialog}
        onCancel={() => setOpenTourDialog(false)}
        footer={null}
      >
        {selectedTour ? (
          <div>
            <p><strong>Tour Name:</strong> {selectedTour.name}</p>
            <p><strong>Destination:</strong> {selectedTour.destination}</p>
            <p><strong>Price:</strong> {selectedTour.price}</p>
            <p><strong>Duration:</strong> {selectedTour.duration} days</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>

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
