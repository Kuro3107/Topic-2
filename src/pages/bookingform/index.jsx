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
    startDate: "", // Ensure field name matches with DTO
    endDate: "", // Ensure field name matches with DTO
    fullname: "", // Ensure field name matches with DTO
    phone: "", // Ensure field name matches with DTO
    email: "", // Ensure field name matches with DTO
    favoriteKoi: [], // Ensure field name matches with DTO
    favoriteFarm: [], // Ensure field name matches with DTO
    note: "", // Ensure field name matches with DTO
    status: "pending", // Ensure field name matches with DTO
  });

  const [koiOptions, setKoiOptions] = useState([]);
  const [farmOptions, setFarmOptions] = useState([]);
  const [filteredFarmOptions, setFilteredFarmOptions] = useState([]); // State for filtered farms

  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/koi-varieties"
        );
        const options = response.data.map((koi) => ({
          value: koi.varietyId,
          label: `${koi.varietyName || "Undefined name"} - ${
            koi.koiPrice ? `${koi.koiPrice}` : "Undefined price"
          }`,
        }));
        setKoiOptions(options);
      } catch (error) {
        console.error("Error loading koi data:", error);
        toast.error("Unable to load koi data.");
      }
    };

    const fetchFarmOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/farms");
        const options = response.data.map((farm) => ({
          value: farm.farmId,
          label: `${farm.farmName || "Undefined name"} - ${
            farm.location || "Undefined location"
          }`,
          koiVarieties: farm.koiVarieties, // Store information about koi varieties in the farm
        }));
        setFarmOptions(options);
        setFilteredFarmOptions(options); // Initialize filtered farm list
      } catch (error) {
        console.error("Error loading farm data:", error);
        toast.error("Unable to load farm data.");
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

    // If user selects koi, filter farms
    if (actionMeta.name === "favoriteKoi") {
      const selectedKoiIds = selectedOptions.map((option) => option.value);
      const filteredFarms = farmOptions.filter((farm) =>
        farm.koiVarieties.some((koi) => selectedKoiIds.includes(koi.varietyId))
      );
      setFilteredFarmOptions(filteredFarms); // Update filtered farm list
    }

    // If no koi selected, reset farm
    if (actionMeta.name === "favoriteFarm" && formData.favoriteKoi.length === 0) {
      setFormData((prevData) => ({
        ...prevData,
        favoriteFarm: [], // Reset farm if no koi selected
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending request..."); // Add log for checking
    if (!formData.fullname || !formData.phone || !formData.email) {
      toast.error("Please fill in all required information.");
      return;
    }
    try {
      // Get user information from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const customerId = userInfo?.customerId; // Get customerId from user info
      console.log("Customer ID:", customerId); // Add log to check customerId

      // Check if customerId is undefined
      if (!customerId) {
        console.error(
          "Customer ID is undefined. Please check the userInfo in localStorage."
        );
        toast.error("Customer information not found.");
        return;
      }

      // Convert favoriteKoi and favoriteFarm from IDs to names
      const favoriteKoiNames = formData.favoriteKoi
        .map((id) => {
          const koi = koiOptions.find((option) => option.value === id);
          return koi ? koi.label.split(" - ")[0] : null; // Get koi name
        })
        .filter((name) => name)
        .join(", "); // Convert to string

      const favoriteFarmNames = formData.favoriteFarm
        .map((id) => {
          const farm = filteredFarmOptions.find(
            (option) => option.value === id
          );
          return farm ? farm.label.split(" - ")[0] : null; // Get farm name
        })
        .filter((name) => name)
        .join(", "); // Convert to string

      const dataToSend = {
        ...formData,
        customerId: customerId, // Add customerId to data
        favoriteKoi: favoriteKoiNames, // Send koi names string
        favoriteFarm: favoriteFarmNames, // Send farm names string
      };

      console.log("Data to send:", dataToSend); // Print data to be sent

      const response = await axios.post(api, dataToSend);
      if (response.status === 201) {
        toast.success("Booking successful! We will contact you soon.");

        // Return to home page after 1 second
        setTimeout(() => {
          navigate("/"); // Navigate to home page
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
        "Error sending data:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        "An error occurred during the booking process. Please try again later."
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
                        options={formData.favoriteKoi.length > 0 ? filteredFarmOptions : []} // Only show farms if koi is selected
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