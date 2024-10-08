import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./header.css";
import logo from "../../assets/img/logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("userInfo") !== null;

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      navigate("/");
      toast.success("Đăng xuất thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.");
    }
  };

  return (
    <header className="header">
      <div className="logo-container" to="">
        <Link to="/" className="header-link">
          <img src={logo} alt="logo" className="logo-image" />
        </Link>
        <span className="website-name">LOOKOI</span>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/gioi-thieu" className="header-link">
              Giới thiệu
            </Link>
          </li>
          <li>
            <Link to="/" className="header-link">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/san-pham" className="header-link">
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/dat-chuyen" className="header-link">
              Đặt chuyến
            </Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to="/profile" className="header-link">
                Thông tin cá nhân
              </Link>
            </li>
          )}
          {isLoggedIn ? (
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="header-link">
                Đăng nhập
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
