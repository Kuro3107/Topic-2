import React from "react";
import "./footer.css";
import { FacebookFilled, HomeOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, TwitterCircleFilled } from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
          We are a company specializing in providing trips to Japan, consulting and supporting customers in purchasing koi fish, as well as taking care of transporting koi fish for customers.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p><MailOutlined /> Email: phqtuan2000@gmail.com</p>
          <p><PhoneOutlined /> Phone: 094-424-6472</p>
          <p><HomeOutlined /> Address: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000, Việt Nam</p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#"><FacebookFilled /> Facebook</a>
            <a href="#"><TwitterCircleFilled /> Twitter</a>
            <a href="#"><InstagramOutlined /> Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 LOOKOI. TRUST ALWAYS COMES FIRST.</p>
      </div>
    </footer>
  );
};

export default Footer;