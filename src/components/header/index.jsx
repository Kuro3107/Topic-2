import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Logo</Link>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/">Trang chủ</Link>
          </li>
          <li>
            <Link to="/login">Sản phẩm</Link>
          </li>
          <li>
            <Link to="/login">Giới thiệu</Link>
          </li>
          <li>
            <Link to="/login">Liên hệ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
