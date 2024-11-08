import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PropTypes from "prop-types"; // Thêm prop-types để xử lý lỗi validation

function Diagram() {
  const [chartData, setChartData] = useState([]);
  const apiBooking = "http://localhost:8080/api/bookings";
  const apiTrip = "http://localhost:8080/api/trips";

  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    try {
      const responseBookings = await axios.get(apiBooking);
      const responseTrips = await axios.get(apiTrip);

      // Debug: Kiểm tra dữ liệu trả về
      console.log("Bookings:", responseBookings.data);
      console.log("Trips:", responseTrips.data);

      const tripsMap = responseTrips.data.reduce((acc, trip) => {
        acc[trip.tripId] = trip;
        return acc;
      }, {});

      const monthlyData = responseBookings.data.reduce((acc, booking) => {
        const date = new Date(booking.bookingDate);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = {
            revenue: 0,
            approvedOrders: 0,
            rejectedOrders: 0,
            deliveredOrders: 0,
          }; // Bỏ pendingOrders vì không cần thiết
        }

        // Phân loại đơn hàng theo trạng thái
        switch (booking.status) {
          case "Approved":
            acc[monthYear].approvedOrders += 1;
            break;
          case "Rejected":
            acc[monthYear].rejectedOrders += 1;
            break;
          case "Finished": // Thay ổi từ delivered thành checkout
            acc[monthYear].deliveredOrders += 1;
            // Tính doanh thu
            const trip = tripsMap[booking.tripId];
            if (trip && trip.priceTotal) {
              acc[monthYear].revenue += trip.priceTotal;
            }
            break;
          // Bỏ default case để không tính pending nữa
        }

        return acc;
      }, {});

      const formattedData = Object.entries(monthlyData)
        .map(([name, data]) => ({
          name,
          ...data,
        }))
        .sort((a, b) => {
          const [monthA, yearA] = a.name.split("/");
          const [monthB, yearB] = b.name.split("/");
          return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });

      // Debug: Kiểm tra dữ liệu cuối cùng
      console.log("Formatted Data:", formattedData);

      setChartData(formattedData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${
                entry.name === "Revenue"
                  ? formatCurrency(entry.value)
                  : `${entry.value} orders`
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
    label: PropTypes.string,
  };

  return (
    <div className="diagram-container">
      <h2 className="dashboard-title">Revenue and Orders Statistics</h2>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Revenue from Completed Trips</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Orders Statistics by Status</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} barSize={45} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                allowDecimals={false} // Không cho phép số thập phân
                tickCount={5} // Số lượng mốc trên trục Y
                domain={[0, "auto"]} // Giá trị tối thiểu là 0
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="deliveredOrders"
                fill="#38acff"
                name="Delivered"
                maxBarSize={45}
              />
              <Bar
                dataKey="approvedOrders"
                fill="#10fe08"
                name="Approved"
                maxBarSize={45}
              />
              <Bar
                dataKey="rejectedOrders"
                fill="#ff0000"
                name="Rejected"
                maxBarSize={45}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Diagram;
