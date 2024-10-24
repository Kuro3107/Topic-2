import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";
import { useNavigate } from "react-router-dom";

const api = "http://localhost:8080/api/bookings";

function BookingForm() {
  const [formData, setFormData] = useState({
    startDate: "", // Đảm bảo rằng tên trường khớp với DTO
    endDate: "", // Đảm bảo rằng tên trường khớp với DTO
    fullname: "", // Đảm bảo rằng tên trường khớp với DTO
    phone: "", // Đảm bảo rằng tên trường khớp với DTO
    email: "", // Đảm bảo rằng tên trường khớp với DTO
    favoriteKoi: [], // Đảm bảo rằng tên trường khớp với DTO
    favoriteFarm: [], // Đảm bảo rằng tên trường khớp với DTO
    note: "", // Đảm bảo rằng tên trường khớp với DTO
    status: "pending", // Đảm bảo rằng tên trường khớp với DTO
  });

  const [koiOptions, setKoiOptions] = useState([]);
  const [farmOptions, setFarmOptions] = useState([]);
  const [filteredFarmOptions, setFilteredFarmOptions] = useState([]); // State cho farm đã lọc

  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/koi-varieties"
        );
        const options = response.data.map((koi) => ({
          value: koi.varietyId,
          label: `${koi.varietyName || "Tên không xác định"} - ${
            koi.koiPrice ? `${koi.koiPrice} VNĐ` : "Giá không xác định"
          }`,
        }));
        setKoiOptions(options);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu cá koi:", error);
        toast.error("Không thể tải dữ liệu cá koi.");
      }
    };

    const fetchFarmOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/farms");
        const options = response.data.map((farm) => ({
          value: farm.farmId,
          label: `${farm.farmName || "Tên không xác định"} - ${
            farm.location || "Địa điểm không xác định"
          }`,
          koiVarieties: farm.koiVarieties, // Lưu trữ thông tin về các loại cá trong farm
        }));
        setFarmOptions(options);
        setFilteredFarmOptions(options); // Khởi tạo danh sách farm đã lọc
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu farm:", error);
        toast.error("Không thể tải dữ liệu farm.");
      }
    };

    fetchKoiOptions();
    fetchFarmOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOptions, actionMeta) => {
    setFormData((prevData) => ({
      ...prevData,
      [actionMeta.name]: selectedOptions.map((option) => option.value),
    }));

    // Nếu người dùng chọn cá koi, lọc farm
    if (actionMeta.name === "favoriteKoi") {
      const selectedKoiIds = selectedOptions.map((option) => option.value);
      const filteredFarms = farmOptions.filter((farm) =>
        farm.koiVarieties.some((koi) => selectedKoiIds.includes(koi.varietyId))
      );
      setFilteredFarmOptions(filteredFarms); // Cập nhật danh sách farm đã lọc
    }

    // Nếu không có koi được chọn, reset farm
    if (actionMeta.name === "favoriteFarm" && formData.favoriteKoi.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        favoriteFarm: [], // Reset farm nếu không có koi
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Gửi yêu cầu..."); // Thêm log để kiểm tra
    if (!formData.fullname || !formData.phone || !formData.email) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    try {
      // Lấy thông tin người dùng từ localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const customerId = userInfo?.customerId; // Lấy customerId từ thông tin người dùng
      console.log("Customer ID:", customerId); // Thêm log để kiểm tra customerId

      // Kiểm tra xem customerId có phải là undefined không
      if (!customerId) {
        console.error(
          "Customer ID is undefined. Please check the userInfo in localStorage."
        );
        toast.error("Không tìm thấy thông tin khách hàng.");
        return;
      }

      // Chuyển đổi favoriteKoi và favoriteFarm từ ID sang tên
      const favoriteKoiNames = formData.favoriteKoi
        .map((id) => {
          const koi = koiOptions.find((option) => option.value === id);
          return koi ? koi.label.split(" - ")[0] : null; // Lấy tên cá koi
        })
        .filter((name) => name)
        .join(", "); // Chuyển đổi thành chuỗi

      const favoriteFarmNames = formData.favoriteFarm
        .map((id) => {
          const farm = filteredFarmOptions.find(
            (option) => option.value === id
          );
          return farm ? farm.label.split(" - ")[0] : null; // Lấy tên farm
        })
        .filter((name) => name)
        .join(", "); // Chuyển đổi thành chuỗi

      const dataToSend = {
        ...formData,
        customerId: customerId, // Thêm customerId vào dữ liệu gửi đi
        favoriteKoi: favoriteKoiNames, // Gửi chuỗi tên cá koi
        favoriteFarm: favoriteFarmNames, // Gửi chuỗi tên farm
      };

      console.log("Dữ liệu gửi đi:", dataToSend); // In ra dữ liệu gửi đi

      const response = await axios.post(api, dataToSend);
      if (response.status === 201) {
        toast.success("Đặt chỗ thành công! Chúng tôi sẽ liên hệ với bạn sớm.");

        // Quay về trang home sau 1 giây
        setTimeout(() => {
          navigate("/"); // Điều hướng về trang home
        }, 1000);

        setFormData({
          startDate: "",
          endDate: "",
          fullname: "",
          phone: "",
          email: "",
          favoriteKoi: [],
          favoriteFarm: [],
          note: "",
          status: "pending",
        });
      }
    } catch (error) {
      console.error(
        "Lỗi khi gửi dữ liệu:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "Đã xảy ra lỗi trong quá trình đặt chỗ. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen">
        <div className="booking-card">
          <div className="card-header">
            <h2 className="card-title">Book Your Koi Experience</h2>
            <p className="card-description">
              Fill in the details below to schedule your visit to our koi farms
            </p>
          </div>

          <div className="card-content">
            <form className="form-container" onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="section-title">Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullname"
                      className="form-input"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Preferences Section */}
              <div className="form-section">
                <h3 className="section-title">Your Preferences</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Choose Your Favorite Koi First</label>
                    <div className="select-container">
                      <Select
                        isMulti
                        name="favoriteKoi"
                        options={koiOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, {
                            name: "favoriteKoi",
                          })
                        }
                        value={koiOptions.filter((option) =>
                          formData.favoriteKoi.includes(option.value)
                        )}
                        placeholder="Select koi varieties"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Farms</label>
                    <div className="select-container">
                      <Select
                        isMulti
                        name="favoriteFarm"
                        options={formData.favoriteKoi.length > 0 ? filteredFarmOptions : []} // Chỉ hiển thị farm nếu có koi được chọn
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOptions) =>
                          handleSelectChange(selectedOptions, {
                            name: "favoriteFarm",
                          })
                        }
                        value={filteredFarmOptions.filter((option) =>
                          formData.favoriteFarm.includes(option.value)
                        )}
                        placeholder="Select farms"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Dates Section */}
              <div className="form-section">
                <h3 className="section-title">Visit Dates</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <div className="calendar-wrapper">
                      <input
                        type="date"
                        name="startDate"
                        className="form-input"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <div className="calendar-wrapper">
                      <input
                        type="date"
                        name="endDate"
                        className="form-input"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes Section */}
              <div className="form-section">
                <h3 className="section-title">Additional Notes</h3>
                <div className="form-group">
                  <textarea
                    name="note"
                    className="form-textarea"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Any special requests or additional information..."
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingForm;
