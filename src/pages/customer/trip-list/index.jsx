import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, message } from "antd";
import axios from "axios";

const { Meta } = Card;

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const apiTour = "http://localhost:8080/api/tours";

  const fetchTrips = async () => {
    try {
      const response = await axios.get(apiTour);
      setTrips(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách chuyến đi");
      console.error("Lỗi khi tải chuyến đi:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleBooking = (tripId) => {
    // Xử lý logic đặt chuyến đi ở đây
    message.success(`Đã đặt chuyến đi với ID: ${tripId}`);
    // Trong thực tế, bạn sẽ gửi request đến server để xử lý việc đặt chuyến đi
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách chuyến đi</h1>
      <Row gutter={[16, 16]}>
        {trips.map((trip) => (
          <Col xs={24} sm={12} md={8} lg={6} key={trip.tripId}>
            <Card
              hoverable
              cover={<img alt={trip.tripName} src={trip.imageUrl || "https://via.placeholder.com/300"} />}
            >
              <Meta title={trip.tripName} description={`Giá: ${trip.priceTotal?.toLocaleString()} VND`} />
              <Button 
                type="primary" 
                style={{ marginTop: "10px" }}
                onClick={() => handleBooking(trip.tripId)}
              >
                Đặt chuyến đi
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TripList;
