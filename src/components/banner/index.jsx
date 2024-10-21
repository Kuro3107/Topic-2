import React from "react";
import { Button } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Explore the World of Koi</h1>
        <p>Experience the beauty and tranquility of Koi fish</p>
        <Button 
          className="banner-button" 
          onClick={() => navigate("/bookingform")}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default Banner;
