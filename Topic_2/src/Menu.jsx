import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="menu">
      <h1>Welcome to Koi Tour Adventures</h1>
      <nav>
        <ul>
          <li><Link to="/tours">Available Tours</Link></li>
          <li><Link to="/bookings">My Bookings</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/" onClick={() => { /* Add logout logic here */ }}>Logout</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Menu;
