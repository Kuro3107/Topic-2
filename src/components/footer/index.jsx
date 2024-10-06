import React from "react";
import "./footer.css";
import { FacebookFilled, HomeOutlined, InstagramOutlined, MailOutlined, PhoneOutlined, TwitterCircleFilled } from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Về chúng tôi</h3>
          <p>
            Chúng tôi là công ty chuyên cung cấp các sản phẩm và dịch vụ chất
            lượng cao.
          </p>
        </div>
        <div className="footer-section">
          <h3>Liên hệ</h3>
          <p><MailOutlined /> Email: info@example.com</p>
          <p><PhoneOutlined /> Điện thoại: 123-456-7890</p>
          <p><HomeOutlined /> Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
        </div>
        <div className="footer-section">
          <h3>Theo dõi chúng tôi</h3>
          <div className="social-links">
            <a href="#"><FacebookFilled /> Facebook</a>
            <a href="#"><TwitterCircleFilled /> Twitter</a>
            <a href="#"><InstagramOutlined /> Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 LOOKOI. UY TÍN LUÔN ĐẶT LÊN HÀNG ĐẦU.</p>
      </div>
    </footer>
  );
};

export default Footer;
