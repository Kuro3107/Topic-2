import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";
import { useNavigate } from "react-router-dom";

const api = "https://6704fc27031fd46a830e2ee2.mockapi.io/BookingForm";

const koiOptions = [
  { value: "koi1", label: "Koi type 1" },
  { value: "koi2", label: "Koi type 2" },
  { value: "koi3", label: "Koi type 3" },
  { value: "koi4", label: "Koi type 4" },
  // Thêm nhiều lựa chọn khác nếu cần
];

const farmOptions = [
  { value: "farm1", label: "Farm 1" },
  { value: "farm2", label: "Farm 2" },
  { value: "farm3", label: "Farm 3" },
  { value: "farm4", label: "Farm 4" },
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

  const navigate = useNavigate();

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
      toast.success("Trip booked successfully! We will contact you soon.");
      toast.info(
        `Booking information: Favorite fish - ${formData.favoriteKoi.join(
          ", "
        )}, Favorite farm - ${formData.favoritefarm.join(", ")}`
      );

      navigate("/your-orders");

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
      console.error("Error sending data:", error);
      toast.error("An error occurred while booking your trip. Please try again later.");
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
                  <label>Full Name:</label>
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
                  <label>Phone Number:</label>
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
                  <label>Address:</label>
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
                  <label>Favorite fish:</label>
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
                  <label>Favorite farm:</label>
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
                  <label>Start Date:</label>
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
                  <label>End Date:</label>
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
                <label>Note:</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <button type="submit">Send Request</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BookingForm;
