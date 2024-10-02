import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import logo from "../../assets/img/logo.jpg";
const Header = () => {
  const isLoggedIn = localStorage.getItem("userInfo") !== null;

  return (
    <header className="header">
      <div className="logo-container" to="">
        <Link to="/">
          <img src={logo} alt="logo" className="logo-image" />
        </Link>
        <span className="website-name">LOOKOI</span>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/san-pham">Đặt chuyến</Link>
          </li>
          <li>
            <Link to="/gioi-thieu">Giới thiệu</Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to="/profile">Thông tin cá nhân</Link>
            </li>
          )}
          {isLoggedIn ? (
            <li>
              <Link to="/logout">Đăng xuất</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
