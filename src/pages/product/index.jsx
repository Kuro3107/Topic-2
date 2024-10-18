import { useState, useEffect } from "react";
import { Card, Col, Row, Button, message, Pagination, Spin, Modal } from "antd";
import axios from "axios";
import "./index.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
const { Meta } = Card;

const Product = () => {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const pageSize = 6; // 2 rows x 3 columns
  const apiTour = "http://localhost:8080/api/trips";

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
    message.success(`Booked tour with ID: ${tripId}`);
  };

  const handleViewTour = async (tour) => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiTour}/${tour.tripId}`); // Lấy thông tin chi tiết của tour
      setSelectedTour(response.data); // Cập nhật selectedTour với dữ liệu chi tiết
    } catch (error) {
      message.error("Unable to load tour details");
      console.error("Error loading tour details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
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
        visible={!!selectedTour}
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
    </div>
  );
};

export default Product;
