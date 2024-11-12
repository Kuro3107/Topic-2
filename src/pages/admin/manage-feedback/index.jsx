import { Table, Rate, message, Tabs } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/axios";

function ManageFeedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [bookingData, setBookingData] = useState([]);

  // Fetch both feedback and booking data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackResponse = await api.get("/feedbacks");
        const bookingResponse = await api.get("/bookings");
        
        setFeedbackData(feedbackResponse.data);
        setBookingData(bookingResponse.data);
      } catch (error) {
        console.error("Error fetching feedback or booking data:", error);
        message.error("Cannot load feedback data");
      }
    };

    fetchData();
  }, []);

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
      render: (text) => <Rate disabled value={text} />,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
  ];

  // Kết hợp và xử lý dữ liệu
  const combinedData = bookingData.map(booking => {
    const feedback = feedbackData.find(f => f.feedbackId === booking.feedbackId) || {};
    if (feedback.rating) {
      return {
        bookingId: booking.bookingId,
        bookingDate: booking.bookingDate,
        fullName: booking.fullname,
        phone: booking.phone,
        email: booking.email,
        rating: feedback.rating || 0,
        comment: feedback.comments || 'N/A',
      };
    }
    return null;
  }).filter(item => item !== null);

  // Lọc feedback theo số sao
  const filterFeedbackByRating = (rating) => {
    return combinedData.filter(item => item.rating === rating);
  };

  const tabItems = [
    {
      key: 'all',
      label: 'All Feedback',
      children: (
        <Table 
          columns={columns} 
          dataSource={combinedData} 
          rowKey="bookingId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} feedbacks`,
          }}
        />
      ),
    },
    {
      key: '5',
      label: '5 stars',
      children: (
        <Table 
          columns={columns} 
          dataSource={filterFeedbackByRating(5)} 
          rowKey="bookingId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} 5 stars feedbacks`,
          }}
        />
      ),
    },
    {
      key: '4',
      label: '4 stars',
      children: (
        <Table 
          columns={columns} 
          dataSource={filterFeedbackByRating(4)} 
          rowKey="bookingId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} 4 stars feedbacks`,
          }}
        />
      ),
    },
    {
      key: '3',
      label: '3 stars',
      children: (
        <Table 
          columns={columns} 
          dataSource={filterFeedbackByRating(3)} 
          rowKey="bookingId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} 3 stars feedbacks`,
          }}
        />
      ),
    },
    {
      key: '2',
      label: '2 stars',
      children: (
        <Table 
          columns={columns} 
          dataSource={filterFeedbackByRating(2)} 
          rowKey="bookingId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} 2 stars feedbacks`,
          }}
        />
      ),
    },
    {
      key: '1',
      label: '1 star',
      children: (
        <Table 
          columns={columns} 
          dataSource={filterFeedbackByRating(1)} 
          rowKey="bookingId"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} 1 star feedbacks`,
          }}
        />
      ),
    },
  ];

  return (
    <div>
      <h1>Manage Feedback</h1>
      <Tabs
        defaultActiveKey="all"
        items={tabItems}
        type="card"
      />
    </div>
  );
}

export default ManageFeedback;
