import React from "react";
import { Button } from "antd";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Banner = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("userInfo") !== null;

  const handleBookTripClick = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to book a trip!");
      navigate("/login");
    } else {
      navigate("/bookingform");
    }
  };

  const handleBookTripClick2 = () => {
    navigate("/product");
};

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Explore the World of Koi</h1>
        <p>Experience the beauty and tranquility of Koi fish</p>
        <Button 
          className="banner-button" 
          onClick={handleBookTripClick}
        >
          Create Your Tour Now
        </Button>
        <Button 
          className="banner-button" 
          onClick={handleBookTripClick2}
        >
          Discover Our Tours
        </Button>
      </div>
    </div>
  );
};

export default Banner;
