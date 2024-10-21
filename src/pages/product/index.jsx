import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  message,
  Pagination,
  Spin,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import axios from "axios";
import "./index.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const { Meta } = Card;
const { Option } = Select;

const Product = () => {
  const [tours, setTours] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isTourDetailModalVisible, setIsTourDetailModalVisible] =
    useState(false); // Thêm biến trạng thái cho modal chi tiết tour
  const [bookingData, setBookingData] = useState({
    fullname: "",
    phone: "",
    email: "",
    startDate: null,
    note: "",
  });
  const [filters, setFilters] = useState({
    searchType: "", // 'farm' hoặc 'variety'
    searchValue: "",
    minPrice: null,
    maxPrice: null,
    days: null,
  });
  const [uniqueFarms, setUniqueFarms] = useState([]);
  const [uniqueVarieties, setUniqueVarieties] = useState([]);
  const pageSize = 6; // 2 rows x 3 columns
  const apiTour = "http://localhost:8080/api/trips";
  const apiBooking = "http://localhost:8080/api/bookings"; // Đường dẫn API cho booking
  const navigate = useNavigate();

  // Thêm hàm để lấy danh sách trang trại và giống cá duy nhất từ tours hiện tại
  const getUniqueFarmsAndVarieties = (tours) => {
    const farmsMap = new Map();
    const varietiesMap = new Map();

    tours.forEach((tour) => {
      tour.koiFarms.forEach((farm) => {
        if (!farmsMap.has(farm.farmId)) {
          farmsMap.set(farm.farmId, {
            farmId: farm.farmId,
            farmName: farm.farmName,
          });
        }
        farm.koiVarieties.forEach((variety) => {
          if (!varietiesMap.has(variety.varietyId)) {
            varietiesMap.set(variety.varietyId, {
              varietyId: variety.varietyId,
              varietyName: variety.varietyName,
            });
          }
        });
      });
    });

    return {
      farms: Array.from(farmsMap.values()),
      varieties: Array.from(varietiesMap.values()),
    };
  };

  // Cập nhật hàm fetchTours
  const fetchTours = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(apiTour);
      const allTours = response.data.filter((tour) => tour.imageUrl);

      // Lấy danh sách trang trại và giống cá duy nhất từ tất cả các tours
      const { farms, varieties } = getUniqueFarmsAndVarieties(allTours);
      setUniqueFarms(farms);
      setUniqueVarieties(varieties);

      // Lọc tours dựa trên các bộ lọc
      const filteredTours = allTours.filter((tour) => {
        let matchesSearch = true;
        let matchesPrice = true;

        // Lọc theo trang trại hoặc giống cá
        if (filters.searchType === "farm" && filters.searchValue) {
          matchesSearch = tour.koiFarms.some(
            (farm) => farm.farmName === filters.searchValue
          );
        } else if (filters.searchType === "variety" && filters.searchValue) {
          matchesSearch = tour.koiFarms.some((farm) =>
            farm.koiVarieties.some(
              (variety) => variety.varietyName === filters.searchValue
            )
          );
        }

        // Lọc theo giá sử dụng priceTotal
        if (filters.minPrice) {
          matchesPrice = matchesPrice && tour.priceTotal >= filters.minPrice;
        }
        if (filters.maxPrice) {
          matchesPrice = matchesPrice && tour.priceTotal <= filters.maxPrice;
        }

        // Lọc theo số ngày (nếu cần)
        // if (filters.days) {
        //   matchesPrice = matchesPrice && tour.tripDetails.length === filters.days;
        // }

        return matchesSearch && matchesPrice;
      });

      setTours(filteredTours);
    } catch (error) {
      message.error("Không thể tải danh sách các chuyến đi");
      console.error("Lỗi khi tải các chuyến đi:", error);
      setTours([]);
      setUniqueFarms([]);
      setUniqueVarieties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, apiTour]);

  // Cập nhật useEffect
  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const handleBooking = (tripId) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      message.warning("Vui lòng đăng nhập để đặt tour.");
      navigate("/login");
    } else {
      // Chuyển hướng đến trang BookingForm với tripId
      navigate(`/booking-form/${tripId}`);
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
      isActive: null,
    };

    console.log("Submitting booking:", newBooking);

    try {
      const response = await axios.post(apiBooking, newBooking);
      console.log("Booking created:", response.data);
      message.success("Booking created successfully!");
      setIsBookingModalVisible(false);
      setBookingData({
        fullname: "",
        phone: "",
        email: "",
        startDate: null,
        note: "",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      message.error("Failed to create booking. Please try again.");
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseModal = () => {
    setSelectedTour(null);
    setIsTourDetailModalVisible(false); // Đóng modal chi tiết tour
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Không cần gọi fetchTours ��� đây vì useEffect sẽ tự động gọi khi currentPage thay đổi
  };

  // Cập nhật hàm handleFilterChange
  const handleFilterChange = (name, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };

      // Reset searchValue nếu searchType thay đổi
      if (name === "searchType") {
        newFilters.searchValue = "";
      }

      return newFilters;
    });

    // Reset trang về 1 khi áp dụng bộ lọc mới
    setCurrentPage(1);

    // Gọi fetchTours ngay lập tức
    fetchTours();
  };

  // Cập nhật hàm renderFilters
  const renderFilters = () => (
    <div className="search-section">
      <h2 className="search-title">Search Tour</h2>
      <div className="filters">
        <Select
          style={{ width: 200, marginRight: 8 }}
          placeholder="Chọn loại tìm kiếm"
          onChange={(value) => handleFilterChange("searchType", value)}
          value={filters.searchType}
        >
          <Option value="farm">Trang trại</Option>
          <Option value="variety">Giống cá</Option>
        </Select>
        {filters.searchType && (
          <Select
            style={{ width: 200, marginRight: 8 }}
            placeholder={
              filters.searchType === "farm"
                ? "Chọn trang trại"
                : "Chọn giống cá"
            }
            onChange={(value) => handleFilterChange("searchValue", value)}
            value={filters.searchValue}
          >
            {filters.searchType === "farm"
              ? uniqueFarms.map((farm) => (
                  <Option key={`farm-${farm.farmId}`} value={farm.farmName}>
                    {farm.farmName}
                  </Option>
                ))
              : uniqueVarieties.map((variety) => (
                  <Option
                    key={`variety-${variety.varietyId}`}
                    value={variety.varietyName}
                  >
                    {variety.varietyName}
                  </Option>
                ))}
          </Select>
        )}
        <InputNumber
          style={{ width: 120, marginRight: 8 }}
          placeholder="Giá tối thiểu"
          onChange={(value) => handleFilterChange("minPrice", value)}
          value={filters.minPrice}
        />
        <InputNumber
          style={{ width: 120, marginRight: 8 }}
          placeholder="Giá tối đa"
          onChange={(value) => handleFilterChange("maxPrice", value)}
          value={filters.maxPrice}
        />
      </div>
    </div>
  );

  return (
    <div className="layout">
      <Header />

      <div className="product-container">
        {renderFilters()}
        <h1>Tour List</h1>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : tours.length > 0 ? (
          <>
            <Row gutter={[24, 24]}>
              {tours
                .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                .map((tour) => (
                  <Col xs={24} sm={12} md={8} key={tour.tripId}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={tour.tripName}
                          src={
                            tour.imageUrl || "https://via.placeholder.com/300"
                          }
                          className="card-image"
                        />
                      }
                      className="tour-card"
                    >
                      <div className="card-content">
                        <Meta title={tour.tripName} />
                        <div className="tour-price">
                          Price: {tour.priceTotal?.toLocaleString()} $
                        </div>
                        <div className="tour-description">
                          {tour.description?.slice(0, 100)}...
                        </div>
                        <div className="button-group">
                          <Button
                            type="primary"
                            className="booking-button"
                            onClick={() => handleBooking(tour.tripId)}
                          >
                            Book Now
                          </Button>
                          <Button
                            type="default"
                            className="view-button"
                            onClick={() => handleViewTour(tour)}
                          >
                            View
                          </Button>
                        </div>
                      </div>
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
        title={selectedTour ? selectedTour.tripName : ""}
        visible={isTourDetailModalVisible} // Sử dụng biến trạng thái cho modal chi tiết tour
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedTour && (
          <div>
            <p>
              <strong>Price:</strong>{" "}
              {selectedTour.priceTotal?.toLocaleString()} VND
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedTour.description || "No description available."}
            </p>
            <h3>Trip Details:</h3>
            {selectedTour.tripDetails.map((detail) => (
              <div key={detail.tripDetailId}>
                <p>
                  <strong>Main Topic:</strong> {detail.mainTopic}
                </p>
                <p>
                  <strong>Sub Topic:</strong> {detail.subTopic}
                </p>
                <p>
                  <strong>Note Price:</strong> {detail.notePrice}
                </p>
                <p>
                  <strong>Day:</strong> {detail.day}
                </p>
              </div>
            ))}
            <h3>Koi Farms:</h3>
            {selectedTour.koiFarms.map((farm) => (
              <div key={farm.farmId}>
                <p>
                  <strong>Farm Name:</strong> {farm.farmName}
                </p>
                <p>
                  <strong>Location:</strong> {farm.location}
                </p>
                <p>
                  <strong>Contact Info:</strong> {farm.contactInfo}
                </p>
                <img
                  src={farm.imageUrl}
                  alt={farm.farmName}
                  style={{ width: "100px" }}
                />
                <h4>Koi Varieties:</h4>
                {farm.koiVarieties.map((variety) => (
                  <div key={variety.varietyId}>
                    <p>
                      <strong>Variety Name:</strong> {variety.varietyName}
                    </p>
                    <p>
                      <strong>Description:</strong> {variety.description}
                    </p>
                    <p>
                      <strong>Price:</strong>{" "}
                      {variety.koiPrice?.toLocaleString()} VND
                    </p>
                    <img
                      src={variety.imageUrl}
                      alt={variety.varietyName}
                      style={{ width: "100px" }}
                    />
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
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input
              name="fullname"
              value={bookingData.fullname}
              onChange={handleBookingChange}
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input
              name="phone"
              value={bookingData.phone}
              onChange={handleBookingChange}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              name="email"
              value={bookingData.email}
              onChange={handleBookingChange}
            />
          </Form.Item>
          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Please select a start date!" }]}
          >
            <DatePicker
              value={
                bookingData.startDate ? moment(bookingData.startDate) : null
              }
              onChange={(date) =>
                setBookingData({ ...bookingData, startDate: date })
              }
            />
          </Form.Item>
          <Form.Item label="Note">
            <Input.TextArea
              name="note"
              value={bookingData.note}
              onChange={handleBookingChange}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
