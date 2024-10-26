import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Home from '../pages/Home/index.jsx'; // Sử dụng trang Home hiện tại
import Dashboard from './pages/Dashboard'; // Sử dụng trang Dashboard hiện tại
import ManageFarm from '../pages/admin/manage-farm/index.jsx'; // Đảm bảo file này tồn tại
import LoginPage from '../pages/login/index.jsx'; // Nhập file đăng nhập
import { useAuth } from './context/AuthContext';

const App = () => {
    const { user } = useAuth(); // Lấy thông tin người dùng từ context

    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link>
                    {user && user.role_id === 1 && ( // Kiểm tra vai trò manager
                        <Link to="/dashboard">Dashboard</Link>
                    )}
                    <Link to="/login">Login</Link> {/* Thêm liên kết đến trang đăng nhập */}
                </nav>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/manage-farm" component={ManageFarm} />
                    <Route path="/login" component={LoginPage} /> {/* Đường dẫn đến trang đăng nhập */}
                    {/* Các route khác */}
                </Switch>
            </div>
        </Router>
    );
};

export default App;