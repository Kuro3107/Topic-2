import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "male",
    farm: "",
    fishType: "",
    checkInDate: "",
    checkOutDate: "",
    hotel: "",
    hotelPrice: "",
    notes: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái cho thông báo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    setIsSubmitted(true); // Cập nhật trạng thái khi gửi form
  };

  const handleCloseModal = () => {
    setIsSubmitted(false); // Đóng thông báo
  };

  return (
    <div className="booking-form">
      <Header />
      <main className="form-background">
        <div className="form-container">
          <h1>Booking Form</h1>
          <form onSubmit={handleSubmit}>
            {/* Name và Phone trên cùng 1 hàng */}
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Name (Tên):</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Số điện thoại: </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email và Gender trên cùng 1 hàng */}
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Gender (Giới tính):</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Farm và Fish Type trên cùng 1 hàng */}
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Farm (Trang trại):</label>
                  <input
                    type="text"
                    name="farm"
                    value={formData.farm}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Fish Type (Loại cá):</label>
                  <input
                    type="text"
                    name="fishType"
                    value={formData.fishType}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Check-in Date và Check-out Date trên cùng 1 hàng */}
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Check-in Date (Ngày đến):</label>
                  <input
                    type="date"
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Check-out Date (Ngày đi):</label>
                  <input
                    type="date"
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Hotel và Hotel Price trên cùng 1 hàng */}
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Hotel (Khách sạn):</label>
                  <input
                    type="text"
                    name="hotel"
                    value={formData.hotel}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Hotel Price (Giá tiền chỗ ở):</label>
                  <input
                    type="number"
                    name="hotelPrice"
                    value={formData.hotelPrice}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Ô Note chiếm hết chiều rộng của form */}
            <div className="form-full-width">
              <div className="form-group">
                <label>Notes (Ghi chú):</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit">Send Request</button>
          </form>
        </div>
      </main>
      <Footer />

      {/* Hiển thị bảng thông báo nếu form được gửi */}
      {isSubmitted && (
        <div className="modal">
          <div className="modal-content">
            <h2>Request Sent Successfully!</h2>
            <p>Your booking request has been sent. We will contact you shortly.</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingForm;