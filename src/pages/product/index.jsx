import { useState, useEffect } from "react";
import { Card, Col, Row, Button, message, Pagination, Spin } from "antd";
import axios from "axios";
import "./index.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
const { Meta } = Card;

const Product = () => {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 6; // 2 rows x 3 columns
  const apiTour = "http://localhost:8080/api/tours";

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiTour);
      setTours(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách tour");
      console.error("Lỗi khi tải tour:", error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleBooking = (tripId) => {
    message.success(`Đã đặt tour với ID: ${tripId}`);
  };

  const paginatedTours = tours.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="layout">
      <Header />
      <div className="product-container">
        <h1>Danh sách Tour</h1>
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
                      description={`Giá: ${tour.priceTotal?.toLocaleString()} VND`} 
                    />
                    <Button 
                      type="primary" 
                      className="booking-button"
                      onClick={() => handleBooking(tour.tripId)}
                    >
                      Đặt tour
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
          <div className="no-data">Không có tour nào được tìm thấy.</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Product;
