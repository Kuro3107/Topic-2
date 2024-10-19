import { useState, useEffect } from "react";
import { Card, Col, Row, Button, message, Pagination, Spin, Modal, Form, Input, DatePicker } from "antd";
import axios from "axios";
import "./index.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Meta } = Card;

const Product = () => {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isTourDetailModalVisible, setIsTourDetailModalVisible] = useState(false); // Thêm biến trạng thái cho modal chi tiết tour
  const [bookingData, setBookingData] = useState({
    fullname: '',
    phone: '',
    email: '',
    startDate: null,
    note: ''
  });
  const pageSize = 6; // 2 rows x 3 columns
  const apiTour = "http://localhost:8080/api/trips";
  const apiBooking = "http://localhost:8080/api/bookings"; // Đường dẫn API cho booking
  const navigate = useNavigate();

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiTour);
      // Lọc các tours có imageUrl
      const toursWithImage = response.data.filter(tour => tour.imageUrl);
      setTours(toursWithImage);
    } catch (error) {
      message.error("Unable to load the list of tours");
      console.error("Error loading tours:", error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleBooking = (tripId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
        message.warning("Vui lòng đăng nhập để đặt tour.");
        navigate("/login");
    } else {
        // Tìm tour tương ứng với tripId
        const tourToBook = tours.find(tour => tour.tripId === tripId);
        if (tourToBook) {
            setSelectedTour(tourToBook); // Cập nhật selectedTour
            setIsBookingModalVisible(true); // Hiện modal booking
            setIsTourDetailModalVisible(false); // Đảm bảo modal chi tiết tour không hiển thị
        } else {
            message.error("Tour không tìm thấy.");
        }
    }
  };

  const handleViewTour = async (tour) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiTour}/${tour.tripId}`); // Lấy thông tin chi tiết của tour
      setSelectedTour(response.data); // Cập nhật selectedTour với dữ liệu chi tiết
      setIsTourDetailModalVisible(true); // Hiện modal chi tiết tour
      setIsBookingModalVisible(false); // Đảm bảo modal booking không hiển thị
    } catch (error) {
      message.error("Unable to load tour details");
      console.error("Error loading tour details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!selectedTour) {
        message.error("No tour selected. Please select a tour before booking.");
        return;
    }

    if (!bookingData.startDate) {
        message.error("Please select a start date.");
        return;
    }

    console.log("Booking Data:", bookingData); // Kiểm tra dữ liệu booking

    const newBooking = {
      tripId: selectedTour.tripId,
      customerId: userInfo.customerId,
      bookingPaymentId: null,
      feedbackId: null,
      status: "Approved",
      startDate: bookingData.startDate.format("YYYY-MM-DD"),
      bookingDate: moment().format("YYYY-MM-DD"),
      fullname: bookingData.fullname,
      phone: bookingData.phone,
      email: bookingData.email,
      favoriteFarm: null,
      favoriteKoi: null,
      note: bookingData.note,
      isActive: null
    };

    console.log("Submitting booking:", newBooking);

    try {
      const response = await axios.post(apiBooking, newBooking);
      console.log("Booking created:", response.data);
      message.success("Booking created successfully!");
      setIsBookingModalVisible(false);
      setBookingData({
        fullname: '',
        phone: '',
        email: '',
        startDate: null,
        note: ''
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      message.error("Failed to create booking. Please try again.");
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prevData => ({
        ...prevData,
        [name]: value
    }));
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
    setIsTourDetailModalVisible(false); // Đóng modal chi tiết tour
  };

  const paginatedTours = tours.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="layout">
      <Header />
      <div className="product-container">
        <h1>Tour List</h1>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : paginatedTours.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {paginatedTours.map((tour) => (
                <Col xs={24} sm={12} md={8} key={tour.tripId}>
                  <Card
                    hoverable
                    cover={<img alt={tour.tripName} src={tour.imageUrl || "https://via.placeholder.com/300"} className="card-image" />}
                    className="tour-card"
                  >
                    <Meta 
                      title={tour.tripName} 
                      description={`Price: ${tour.priceTotal?.toLocaleString()} VND`} 
                    />
                    <Button 
                      type="primary" 
                      className="booking-button"
                      onClick={() => handleBooking(tour.tripId)}
                    >
                      Book Tour
                    </Button>
                    <Button 
                      type="default" 
                      className="view-button"
                      onClick={() => handleViewTour(tour)}
                    >
                      View
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              total={tours.length}
              pageSize={pageSize}
              onChange={handlePageChange}
              className="pagination"
            />
          </>
        ) : (
          <div className="no-data">No tours found.</div>
        )}
      </div>
      <Footer />

      {/* Modal hiển thị thông tin chi tiết của tour */}
      <Modal
        title={selectedTour ? selectedTour.tripName : ''}
        visible={isTourDetailModalVisible} // Sử dụng biến trạng thái cho modal chi tiết tour
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedTour && (
          <div>
            <p><strong>Price:</strong> {selectedTour.priceTotal?.toLocaleString()} VND</p>
            <p><strong>Description:</strong> {selectedTour.description || 'No description available.'}</p>
            <h3>Trip Details:</h3>
            {selectedTour.tripDetails.map(detail => (
              <div key={detail.tripDetailId}>
                <p><strong>Main Topic:</strong> {detail.mainTopic}</p>
                <p><strong>Sub Topic:</strong> {detail.subTopic}</p>
                <p><strong>Note Price:</strong> {detail.notePrice}</p>
                <p><strong>Day:</strong> {detail.day}</p>
              </div>
            ))}
            <h3>Koi Farms:</h3>
            {selectedTour.koiFarms.map(farm => (
              <div key={farm.farmId}>
                <p><strong>Farm Name:</strong> {farm.farmName}</p>
                <p><strong>Location:</strong> {farm.location}</p>
                <p><strong>Contact Info:</strong> {farm.contactInfo}</p>
                <img src={farm.imageUrl} alt={farm.farmName} style={{ width: '100px' }} />
                <h4>Koi Varieties:</h4>
                {farm.koiVarieties.map(variety => (
                  <div key={variety.varietyId}>
                    <p><strong>Variety Name:</strong> {variety.varietyName}</p>
                    <p><strong>Description:</strong> {variety.description}</p>
                    <p><strong>Price:</strong> {variety.koiPrice?.toLocaleString()} VND</p>
                    <img src={variety.imageUrl} alt={variety.varietyName} style={{ width: '100px' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Modal cho booking */}
      <Modal
        title="Create Booking"
        visible={isBookingModalVisible}
        onCancel={() => setIsBookingModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleBookingSubmit}>
          <Form.Item 
            label="Full Name" 
            name="fullname" 
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input name="fullname" value={bookingData.fullname} onChange={handleBookingChange} />
          </Form.Item>
          <Form.Item 
            label="Phone" 
            name="phone" 
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input name="phone" value={bookingData.phone} onChange={handleBookingChange} />
          </Form.Item>
          <Form.Item 
            label="Email" 
            name="email" 
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input name="email" value={bookingData.email} onChange={handleBookingChange} />
          </Form.Item>
          <Form.Item 
            label="Start Date" 
            name="startDate" 
            rules={[{ required: true, message: 'Please select a start date!' }]}
          >
            <DatePicker 
              value={bookingData.startDate ? moment(bookingData.startDate) : null} 
              onChange={(date) => setBookingData({ ...bookingData, startDate: date })} 
            />
          </Form.Item>
          <Form.Item label="Note">
            <Input.TextArea name="note" value={bookingData.note} onChange={handleBookingChange} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit Booking</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
