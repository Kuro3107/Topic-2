import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

const api = "https://6704fc27031fd46a830e2ee2.mockapi.io/BookingForm";

const koiOptions = [
  { value: "koi1", label: "Koi loại 1" },
  { value: "koi2", label: "Koi loại 2" },
  { value: "koi3", label: "Koi loại 3" },
  { value: "koi4", label: "Koi loại 4" },
  // Thêm nhiều lựa chọn khác nếu cần
];

const farmOptions = [
  { value: "farm1", label: "Trang trại 1" },
  { value: "farm2", label: "Trang trại 2" },
  { value: "farm3", label: "Trang trại 3" },
  { value: "farm4", label: "Trang trại 4" },
  // Thêm nhiều lựa chọn khác nếu cần
];

function BookingForm() {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    fullname: "",
    phone: "",
    email: "",
    district: "",
    favoriteKoi: [],
    favoritefarm: [],
    note: "",
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(api, formData);
      console.log("Response from server:", response.data);
      toast.success("Đặt chuyến thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
      toast.info(
        `Thông tin đặt chuyến: Loại cá yêu thích - ${formData.favoriteKoi.join(
          ", "
        )}, Trang trại yêu thích - ${formData.favoritefarm.join(", ")}`
      );
      setFormData({
        startDate: "",
        endDate: "",
        fullname: "",
        phone: "",
        email: "",
        district: "",
        favoriteKoi: [],
        favoritefarm: [],
        note: "",
      });
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      toast.error("Có lỗi xảy ra khi đặt chuyến. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="booking-form">
      <Header />
      <main className="form-background">
        <div className="form-container">
          <h1>Booking Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Họ và tên:</label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Số điện thoại:</label>
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
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  ></input>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Loại cá yêu thích:</label>
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
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Trang trại yêu thích:</label>
                  <Select
                    isMulti
                    name="favoritefarm"
                    options={farmOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(selectedOptions) =>
                      handleSelectChange(selectedOptions, {
                        name: "favoritefarm",
                      })
                    }
                    value={farmOptions.filter((option) =>
                      formData.favoritefarm.includes(option.value)
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label>Ngày bắt đầu:</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-column">
                <div className="form-group">
                  <label>Ngày kết thúc:</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-full-width">
              <div className="form-group">
                <label>Ghi chú:</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit">Gửi yêu cầu</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookingForm;
