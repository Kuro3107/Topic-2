import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HTML/Login.html'; // Assume you'll create this for styling

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('https://66dee860de4426916ee2e54c.mockapi.io/User');
      const users = response.data;
      const user = users.find(u => u.email === identifier || u.phone === identifier);
      if (user) {
        console.log('Login successful');
        navigate('/menu'); // Redirect to menu page after successful login
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <button onClick={() => navigate('/')} className="exit-button">
        Return to Home Page
      </button>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Phone Number"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => console.log('Forgot password')}>Forgot Password</button>
      <Link to="/register">
        <button>Create Account</button>
      </Link>
      <button onClick={() => console.log('Login with Google')}>Login with Google</button>
    </div>
  );
}

export default Login;
