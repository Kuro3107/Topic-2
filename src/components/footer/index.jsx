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
            We are a company specializing in providing high-quality products and services.
          </p>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p><MailOutlined /> Email: info@example.com</p>
          <p><PhoneOutlined /> Phone: 123-456-7890</p>
          <p><HomeOutlined /> Address: 123 ABC Street, XYZ City</p>
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