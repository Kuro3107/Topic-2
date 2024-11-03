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
      toast.success("Log out successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error when logging out:", error);
      toast.error("An error occurred while logging out. Please try again.");
    }
  };

  const handleBookTripClick = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to book a trip!");
      navigate("/login");
    } else {
      navigate("/bookingform");
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="header-link">
          <img src={logo} alt="logo" className="logo-image" />
        </Link>
        <span className="website-name">LOOKOI</span>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/" className="header-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/introduce" className="header-link">
              Farms & Koi
            </Link>
          </li>
          <li>
            <Link to="/product" className="header-link">
              Tours
            </Link>
          </li>
          <li>
            <Link className="header-link" onClick={handleBookTripClick}>
              Book for yourself
            </Link>
          </li>

          {isLoggedIn && (
            <li>
              <Link to="/profile" className="header-link">
                Profile
              </Link>
            </li>
          )}
          {isLoggedIn ? (
            <li>
              <button className="logout-button" onClick={handleLogout}>
                Log Out
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link to="/login" className="header-link">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register" className="header-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
