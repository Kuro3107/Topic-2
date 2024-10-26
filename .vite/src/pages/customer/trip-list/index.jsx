import React, { useState, useEffect } from "react";
import { Card, Col, Row, Button, message } from "antd";
import axios from "axios";

const { Meta } = Card;

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const apiTour = "http://localhost:8080/api/trips";

  const fetchTrips = async () => {
    try {
      const response = await axios.get(apiTour);
      setTrips(response.data);
    } catch (error) {
      message.error("Unable to load the list of trips");
      console.error("Error loading trips:", error);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleBooking = (tripId) => {
    // Handle booking logic here
    message.success(`Booked trip with ID: ${tripId}`);
    // In practice, you would send a request to the server to process the booking
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Trip List</h1>
      <Row gutter={[16, 16]}>
        {trips.map((trip) => (
          <Col xs={24} sm={12} md={8} lg={6} key={trip.tripId}>
            <Card
              hoverable
              cover={<img alt={trip.tripName} src={trip.imageUrl || "https://via.placeholder.com/300"} />}
            >
              <Meta title={trip.tripName} description={`Price: ${trip.priceTotal?.toLocaleString()}`} />
              <Button 
                type="primary" 
                style={{ marginTop: "10px" }}
                onClick={() => handleBooking(trip.tripId)}
              >
                Book Trip
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TripList;