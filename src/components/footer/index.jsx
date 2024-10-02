import React from "react";
import "./footer.css";

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
          <p>Email: info@example.com</p>
          <p>Điện thoại: 123-456-7890</p>
          <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ</p>
        </div>
        <div className="footer-section">
          <h3>Theo dõi chúng tôi</h3>
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 Tên Công Ty. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;
