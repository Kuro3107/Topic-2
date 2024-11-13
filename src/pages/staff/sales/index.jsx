import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  InputNumber,
  Layout,
  Menu,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  CheckOutlined,
  LogoutOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { Space } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './index.css';


function SalesDashboard() {
  const [bookings, setBookings] = useState([]);
  const [koiFarms, setKoiFarms] = useState([]); // State để lưu danh sách Koi Farms
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTripModalVisible, setIsTripModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [tripForm] = Form.useForm();

  const [viewingBooking, setViewingBooking] = useState(null);

  const bookingApi = "http://localhost:8080/api/bookings";
  const farmApi = "http://localhost:8080/api/farms"; // API cho Koi Farms
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("userInfo") !== null;

  const username = localStorage.getItem("username"); // Lấy username từ localStorage

  useEffect(() => {
    fetchBookings();
    fetchKoiFarms();
  }, []);

  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const handleViewEditTrip = (trip) => {
    setTripForm(trip); // Đặt thông tin trip vào form
    setIsEditingTrip(true); // Đặt chế độ edit
    setIsTripModalVisible(true); // Mở modal
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(bookingApi);
      const filteredBookings = response.data.filter(
        (booking) =>
          booking.status === "Pending" ||
          booking.status === "Rejected" ||
          booking.status === "Detailed" ||
          booking.status === "updated" // Thêm trạng thái mới nếu cần
      );
      setBookings(filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Unable to fetch bookings");
    }
  };

  const fetchKoiFarms = async () => {
    try {
      const response = await axios.get(farmApi);
      setKoiFarms(response.data); // Lưu danh sách Koi Farms vào state
    } catch (error) {
      console.error("Error fetching Koi Farms:", error);
      message.error("Unable to fetch Koi Farms");
    }
  };

  const showModal = (booking) => {
    setViewingBooking(booking); // Đảm bảo rằng booking được truyền đúng
    form.setFieldsValue({
      customerId: booking.customerId,
      tripId: booking.tripId, // Thm tripId
      fullname: booking.fullname,
      phone: booking.phone,
      email: booking.email,
      favoriteKoi: booking.favoriteKoi || [], // Khởi tạo là mảng nếu không có giá trị
      favoriteFarm: booking.favoriteFarm || [], // Khởi tạo là mảng nếu không có giá trị
      note: booking.note,
      status: booking.status,
      startDate: dayjs(booking.startDate),
      endDate: dayjs(booking.endDate),
      bookingDate: dayjs(booking.bookingDate),
    });
    setIsModalVisible(true);
  };

  const showTripModal = (booking) => {
    setViewingBooking(booking);

    if (booking.tripId) {
      // Booking đã có tripId, gọi API để lấy chi tiết trip
      axios
        .get(`http://localhost:8080/api/trips/${booking.tripId}`)
        .then((response) => {
          const tripData = response.data;

          // Đặt giá trị vào form để chỉnh sửa trip
          tripForm.setFieldsValue({
            tripName: tripData.tripName,
            priceTotal: tripData.priceTotal,
            tripDetails: tripData.tripDetails.map((detail) => ({
              ...detail,
              tripDetailId: detail.tripDetailId,
            })),
            koiFarms: tripData.koiFarms || [], // Đảm bảo rằng koiFarms đưc khởi tạo
          });

          setIsEditingTrip(true); // Đặt cờ cho chế độ chỉnh sa
        })
        .catch((error) => {
          console.error("Error fetching trip details:", error);
          message.error("Unable to fetch trip details");
        });
    } else {
      // Chưa có tripId, chun bị tạo trip mới
      setIsEditingTrip(false);
      tripForm.resetFields(); // Xóa sạch form để tạo mới
      tripForm.setFieldsValue({ tripName: "" }); // Chỉ hiển thị trường tripName
    }

    setIsTripModalVisible(true); // Hiển thị modal
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const bookingData = {
          ...values,
          startDate: values.startDate.format(),
          endDate: values.endDate.format(),
          tripDetails: values.tripDetails || [],
          koiFarms: values.koiFarms || [],
        };

        console.log("Booking data to be sent:", JSON.stringify(bookingData)); // Ghi log dữ liệu gửi đi
        updateBooking(viewingBooking.bookingId, bookingData);
        setIsModalVisible(false);
      })
      .catch((error) => {
        // Bỏ qua thông báo lỗi nếu không cần thiết
        console.error("Validation error:", error);
      });
  };

  // Thay thế hàm handleTripOk hiện tại bằng đoạn code sau
  const handleTripOk = () => {
    tripForm
      .validateFields()
      .then(async (values) => {
        const tripDetails = values.tripDetails || [];
        const koiFarms = values.koiFarms || [];

        // Lấy userInfo từ localStorage và parse nó
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const saleName = userInfo ? userInfo.username : null;

        if (!saleName) {
          message.error("Could not get sale staff username. Please login again.");
          return;
        }

        const payload = {
          tripName: values.tripName,
          priceTotal: values.priceTotal || 0,
          tripDetails: tripDetails,
          koiFarms: koiFarms,
          saleName: saleName // Sử dụng username từ userInfo
        };

        console.log("Trip data to be sent:", JSON.stringify(payload));

        if (isEditingTrip) {
          // Cập nhật trip
          try {
            const response = await axios.put(
              `http://localhost:8080/api/trips/${viewingBooking.tripId}`,
              payload
            );
            console.log("Trip updated successfully:", response.data);
            message.success("Trip updated successfully");
            
            // Cập nhật trip details và koi farms
            updateTripDetails(viewingBooking.tripId, tripDetails);
            
            // Xử lý farms đã thêm và đã xóa
            const originalFarms = viewingBooking.koiFarms || [];
            const farmsToAdd = koiFarms.filter(
              (farm) => !originalFarms.some((orig) => orig.farmId === farm.farmId)
            );
            const farmsToRemove = originalFarms.filter(
              (farm) => !koiFarms.some((kf) => kf.farmId === farm.farmId)
            );

            // Cập nhật farms
            await Promise.all([
              ...farmsToAdd.map(farm => 
                axios.post(`http://localhost:8080/api/trips/${viewingBooking.tripId}/farms`, { farmId: farm.farmId })
              ),
              ...farmsToRemove.map(farm =>
                axios.delete(`http://localhost:8080/api/trips/${viewingBooking.tripId}/farms/${farm.farmId}`)
              )
            ]);

            fetchBookings();
          } catch (error) {
            console.error("Error updating trip:", error);
            // message.error("Failed to update trip");
          }
        } else {
          // Tạo trip mới
          try {
            const tripResponse = await axios.post(`http://localhost:8080/api/trips`, payload);
            const createdTrip = tripResponse.data;
            
            // Cập nhật booking với tripId mới
            const bookingResponse = await axios.get(`${bookingApi}/${viewingBooking.bookingId}`);
            const currentBooking = bookingResponse.data;
            
            await axios.put(`${bookingApi}/${viewingBooking.bookingId}`, {
              ...currentBooking,
              tripId: createdTrip.tripId
            });

            message.success("Trip created successfully");
            fetchBookings();
          } catch (error) {
            console.error("Error creating trip:", error);
            message.error("Failed to create trip");
          }
        }

        setIsTripModalVisible(false);
      })
      .catch((error) => {
        console.error("Validation error:", error);
        message.error("Please check your input");
      });
  };

  const updateTripDetails = (tripId, tripDetails) => {
    tripDetails.forEach((detail) => {
      if (detail.tripDetailId) {
        // Nếu có tripDetailId thì cập nhật
        console.log("Trip details before sending:", tripDetails);
        if (
          detail.mainTopic &&
          // detail.subTopic &&
          detail.day &&
          detail.notePrice
        ) {
          axios
            .put(
              `http://localhost:8080/api/trips/${tripId}/trip-details/${detail.tripDetailId}`,
              {
                mainTopic: detail.mainTopic,
                subTopic: detail.subTopic || null,
                notePrice: detail.notePrice,
                day: detail.day,
                tripId: tripId, // Đảm bảo tripId được truyền đúng nếu cần
                tripDetailId: detail.tripDetailId,
              }
            )
            .then((response) => {
              console.log("Trip detail updated:", response.data);
            })
            .catch((error) => {
              console.error("Error updating trip detail:", error);
              message.error("Unable to update trip detail");
            });
        } else {
          console.error("Invalid trip detail data");
          message.error("Invalid trip detail data");
        }
      } else {
        // Nếu không có tripDetailId thì tạo mới
        console.log("Trip details before sending:", tripDetails);
        if (
          detail.mainTopic &&
          // detail.subTopic &&
          detail.day &&
          detail.notePrice
        ) {
          axios
            .post(`http://localhost:8080/api/trips/${tripId}/trip-details`, {
              mainTopic: detail.mainTopic,
              subTopic: detail.subTopic || null,
              notePrice: detail.notePrice,
              day: detail.day,
              tripId: tripId, // TripID cần được gửi để liên kết với trip này
            })
            .then((response) => {
              console.log("New trip detail added:", response.data);
              message.success("Trip detail added successfully");
            })
            .catch((error) => {
              console.error("Error adding new trip detail:", error);
              message.error("Unable to add new trip detail");
            });
        } else {
          console.error("Invalid trip detail data for new detail");
          message.error("Invalid trip detail data for new detail");
        }
      }
    });
  };

  const updateKoiFarms = (tripId, farmsToAdd, farmsToRemove) => {
    // Thêm các farms mới
    farmsToAdd.forEach((farm) => {
      axios
        .post(`http://localhost:8080/api/trips/${tripId}/farms`, {
          farmId: farm.farmId,
        })
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            console.log("Koi farm added:", response.data);
            message.success("Koi farm added successfully");
          } else {
            message.error("Unable to add koi farm");
          }
        })
        .catch((error) => {
          console.error("Error adding koi farm:", error);
          message.error("Unable to add koi farm");
        });
    });

    // Xóa các farms đã bị loại bỏ
    farmsToRemove.forEach((farm) => {
      axios
        .delete(
          `http://localhost:8080/api/trips/${tripId}/farms/${farm.farmId}`
        )
        .then((response) => {
          if (response.status === 200 || response.status === 204) {
            console.log("Koi farm removed:", response.data);
            message.success("Koi farm removed successfully");
          } else {
            message.error("Unable to remove koi farm");
          }
        })
        .catch((error) => {
          console.error("Error removing koi farm:", error);
          message.error("Unable to remove koi farm");
        });
    });
  };

  const handleAddFarm = () => {
    const favoriteKoi = viewingBooking.favoriteKoi || [];
    const favoriteKoiArray = Array.isArray(favoriteKoi) 
      ? favoriteKoi 
      : favoriteKoi.split(',').map(k => k.trim());

    const relevantFarms = koiFarms.filter(farm => {
      return farm.koiVarieties.some(kv => 
        favoriteKoiArray.includes(kv.varietyName) || 
        favoriteKoiArray.includes(kv.varietyId.toString())
      );
    });

    Modal.confirm({
      title: "Select a farm to add",
      width: 800,
      content: (
        <div>
          <p style={{ marginBottom: '10px' }}>
            Customer&apos;s favorite koi varieties: {favoriteKoiArray.join(', ')}
          </p>
          <p style={{ marginBottom: '10px' }}>
            Customer&apos;s favorite farms: {Array.isArray(viewingBooking.favoriteFarm) 
              ? viewingBooking.favoriteFarm.join(', ') 
              : viewingBooking.favoriteFarm}
          </p>
          <Select
            placeholder="Select a farm"
            style={{ width: '100%', minHeight: '40px' }}
            onChange={(value) => {
              const selectedFarm = koiFarms.find((farm) => farm.farmId === value);
              if (selectedFarm) {
                const currentFarms = tripForm.getFieldValue("koiFarms") || [];
                if (!currentFarms.some((farm) => farm.farmId === selectedFarm.farmId)) {
                  console.log("Adding farm to trip:", viewingBooking.tripId, selectedFarm.farmId);
                  axios.post(
                    `http://localhost:8080/api/trips/${viewingBooking.tripId}/farms`,
                    { farmId: selectedFarm.farmId }
                  )
                  .then(() => {
                    tripForm.setFieldsValue({
                      koiFarms: [...currentFarms, selectedFarm],
                    });
                    message.success("Farm added successfully");
                    fetchKoiFarms(viewingBooking.tripId);
                  })
                  .catch((error) => {
                    message.error("An error occurred while adding the farm");
                    console.error("Error adding farm:", error);
                  });
                } else {
                  message.warning("This farm has already been added to the trip.");
                }
              }
            }}
          >
            {relevantFarms
              .filter((farm) => {
                const currentFarms = tripForm.getFieldValue("koiFarms") || [];
                return !currentFarms.some(
                  (addedFarm) => addedFarm.farmId === farm.farmId
                );
              })
              .map((farm) => {
                const matchingKoiVarieties = farm.koiVarieties
                  .filter(kv => 
                    favoriteKoiArray.includes(kv.varietyName) || 
                    favoriteKoiArray.includes(kv.varietyId.toString())
                  )
                  .map(kv => kv.varietyName);
                
                return (
                  <Select.Option key={farm.farmId} value={farm.farmId}>
                    <div>
                      <strong>{farm.farmName}</strong> - {farm.location}
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <div>Contact: {farm.contactInfo}</div>
                        <div>Matching Koi varieties: {matchingKoiVarieties.join(', ')}</div>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
          </Select>
        </div>
      ),
      onOk() {
        console.log("Farm added");
      },
    });
  };

  // Thêm hàm để xóa farm
  const handleRemoveFarm = (farmId) => {
    axios
      .delete(
        `http://localhost:8080/api/trips/${viewingBooking.tripId}/farms/${farmId}`
      )
      .then((response) => {
        console.log("Koi farm removed:", response.data);
        message.success("Koi farm removed successfully");
      })
      .catch((error) => {
        console.error("Error removing koi farm:", error);
        message.error("Unable to remove koi farm");
      });
  };

  const updateBooking = async (BookingID, bookingData) => {
    try {
      console.log("Updating booking with ID:", BookingID);
      console.log("Booking data to update:", bookingData); // Kiểm tra dữ liệu gi đi

      await axios.put(`${bookingApi}/${BookingID}`, bookingData);
      message.success("Booking updated successfully");
      fetchBookings(); // Refresh bookings sau khi cập nhật
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Unable to update booking");
    }
  };

  const removeTripDetail = (tripId, tripDetailId) => {
    console.log(
      `Removing trip detail at: http://localhost:8080/api/trips/${tripId}/trip-details/${tripDetailId}`
    );
    axios
      .delete(
        `http://localhost:8080/api/trips/${tripId}/trip-details/${tripDetailId}`
      )
      .then((response) => {
        console.log("Trip detail removed:", response.data);
        message.success("Trip detail removed successfully");
        fetchBookings(); // Cập nhật lại danh sách bookings sau khi xóa
      })
      .catch((error) => {
        console.error("Error removing trip detail:", error);
        message.error("Unable to remove trip detail");
      });
  };

  const columns = [
    { title: "ID", dataIndex: "bookingId", key: "bookingId" },
    { title: "Name", dataIndex: "fullname", key: "fullname" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>Update Booking</Button>
          {/* <Button onClick={() => showBookingDetails(record)}>View Booking</Button> */}
        </>
      ),
    },
    {
      title: "Trip Details",
      key: "tripDetail",
      render: (_, record) => {
        if (record.tripId) {
          return (
            <Button onClick={() => showTripModal(record)}>
              View & Edit Trip
            </Button>
          );
        }
        return (
          <Button onClick={() => showTripModal(record)}>Create Trip</Button>
        );
      },
    },
  ];

  // Hàm để xử lý đăng xuất
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

  const showBookingDetails = (booking) => {
    console.log("Booking details:", booking);
    const favoriteKoi = Array.isArray(booking.favoriteKoi) ? booking.favoriteKoi : booking.favoriteKoi ? booking.favoriteKoi.split(",") : [];
    const favoriteFarm = Array.isArray(booking.favoriteFarm) ? booking.favoriteFarm : booking.favoriteFarm ? booking.favoriteFarm.split(",") : [];
    Modal.info({
      title: "Booking Details",
      content: (
        <div>
          <p><strong>ID:</strong> {booking.bookingId || "N/A"}</p>
          <p><strong>Name:</strong> {booking.fullname || "N/A"}</p>
          <p><strong>Phone:</strong> {booking.phone || "N/A"}</p>
          <p><strong>Email:</strong> {booking.email || "N/A"}</p>
          <p><strong>Status:</strong> {booking.status || "N/A"}</p>
          <p><strong>Start Date:</strong> {dayjs(booking.startDate).format("DD/MM/YYYY") || "N/A"}</p>
          <p><strong>End Date:</strong> {dayjs(booking.endDate).format("DD/MM/YYYY") || "N/A"}</p>
          <p><strong>Note:</strong> {booking.note || "N/A"}</p>
          <p><strong>Favorite Koi:</strong> {favoriteKoi.length > 0 ? favoriteKoi.join(", ") : "N/A"}</p>
          <p><strong>Favorite Farm:</strong> {favoriteFarm.length > 0 ? favoriteFarm.join(", ") : "N/A"}</p>
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <Layout>
      <Layout>
        <Header className="deli-header">
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Link to="/">
              <Button type="primary">
                Home
              </Button>
            </Link>
            <Link to="/profile">
              <Button type="primary">
                Profile
              </Button>
            </Link>
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </Header>
        <h1>Sales Staff Dashboard</h1>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Bookings"
                value={bookings.length}
                prefix={<ShoppingCartOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Pending Bookings"
                value={bookings.filter((b) => b.status === "pending").length}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Rejected Bookings"
                value={bookings.filter((b) => b.status === "Rejected").length}
                prefix={<CheckOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Table columns={columns} dataSource={bookings} rowKey="bookingId" />

        {/* Modal Cp Nhật Booking */}
        <Modal
          title="Update Booking"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="tripId" label="Trip ID">
              <Input disabled />
            </Form.Item>
            <Form.Item name="fullname" label="Customer Name">
              <Input disabled />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input disabled />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>
            <Form.Item name="favoriteKoi" label="Favorite Koi">
              <Select mode="multiple" disabled>
                {Array.isArray(form.getFieldValue("favoriteKoi"))
                  ? form.getFieldValue("favoriteKoi").map((koi) => (
                      <Select.Option key={koi} value={koi}>
                        {koi}
                      </Select.Option>
                    ))
                  : null}
              </Select>
            </Form.Item>
            <Form.Item name="favoriteFarm" label="Favorite Farm">
              <Select mode="multiple" disabled>
                {Array.isArray(form.getFieldValue("favoriteFarm"))
                  ? form.getFieldValue("favoriteFarm").map((farm) => (
                      <Select.Option key={farm} value={farm}>
                        {farm}
                      </Select.Option>
                    ))
                  : null}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Detailed">Detailed</Select.Option>
                {/* <Select.Option value="rejected">Rejected</Select.Option> */}
              </Select>
            </Form.Item>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker disabled />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker 
                disabledDate={(current) => {
                  const startDate = form.getFieldValue('startDate');
                  return startDate && current && current.isBefore(startDate, 'day');
                }}
              />
            </Form.Item>
            <Form.Item name="note" label="Note">
              <Input.TextArea disabled />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={isEditingTrip ? "Edit Trip" : "Create Trip"}
          open={isTripModalVisible}
          onOk={handleTripOk}
          onCancel={() => setIsTripModalVisible(false)}
          width={800}
          className="trip-modal"
        >
          <Form form={tripForm} layout="vertical">
            <Form.Item 
              name="tripName" 
              label="Trip Name"
              rules={[{ required: true, message: 'Please enter trip name' }]}
            >
              <Input placeholder="Enter trip name" size="large" />
            </Form.Item>

            {isEditingTrip && (
              <>
                <Form.Item 
                  name="priceTotal" 
                  label="Total Price"
                  rules={[
                    { required: true, message: 'Please enter total price' },
                    { 
                      type: 'number',
                      min: 1,
                      message: 'Price must be greater than 0'
                    }
                  ]}
                >
                  <InputNumber
                    className="price-input"
                    placeholder="Enter total price"
                    min={1}
                    size="large"
                    style={{ width: '100%' }}
                  />
                </Form.Item>

                <div className="farm-section">
                  <div className="section-header">
                    <ShoppingCartOutlined />
                    <span>Koi Farms</span>
                  </div>
                  <Form.List name="koiFarms">
                    {(fields, { remove }) => (
                      <>
                        {fields.map((field) => {
                          const farmId = tripForm.getFieldValue(["koiFarms", field.name, "farmId"]);
                          const farmName = tripForm.getFieldValue(["koiFarms", field.name, "farmName"]);
                          const location = tripForm.getFieldValue(["koiFarms", field.name, "location"]);
                          const imageUrl = tripForm.getFieldValue(["koiFarms", field.name, "imageUrl"]);

                          return (
                            <div key={field.key} className="farm-card">
                              <div className="farm-info">
                                <h4>{farmName}</h4>
                                <p><img src={imageUrl} alt="Koi Farm" /></p>
                                <p>{location}</p>
                              </div>
                              <Button
                                className="remove-button"
                                onClick={() => {
                                  handleRemoveFarm(farmId);
                                  remove(field.name);
                                }}
                                icon={<DeleteOutlined />}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                        <Button
                          type="dashed"
                          onClick={handleAddFarm}
                          className="add-button"
                          icon={<PlusOutlined />}
                        >
                          Add Farm
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>

                <div className="trip-details-section">
                  <div className="section-header">
                    <CalendarOutlined />
                    <span>Trip Details</span>
                  </div>
                  <Form.List name="tripDetails">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map((field, index) => {
                          const tripDetailId = tripForm.getFieldValue([
                            "tripDetails",
                            index,
                            "tripDetailId",
                          ]);
                          return (
                            <div key={field.key} className="trip-detail-row">
                              <Space align="baseline" style={{ width: '100%' }}>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "day"]}
                                  label="Day"
                                  rules={[{ required: true, message: 'Required' }]}
                                >
                                  <InputNumber min={1} />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "mainTopic"]}
                                  label="Main Topic"
                                  rules={[{ required: true, message: 'Required' }]}
                                >
                                  <Input placeholder="Enter main topic" />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "subTopic"]}
                                  label="Sub Topic"
                                >
                                  <Input placeholder="Enter sub topic" />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "notePrice"]}
                                  label="Price Note"
                                >
                                  <Input placeholder="Enter price note" />
                                </Form.Item>
                                <Button
                                  className="remove-button"
                                  onClick={() => {
                                    if (tripDetailId) {
                                      removeTripDetail(viewingBooking.tripId, tripDetailId);
                                    }
                                    remove(field.name);
                                  }}
                                  icon={<DeleteOutlined />}
                                >
                                  Remove
                                </Button>
                              </Space>
                            </div>
                          );
                        })}
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          className="add-button"
                          icon={<PlusOutlined />}
                        >
                          Add Trip Detail
                        </Button>
                      </>
                    )}
                  </Form.List>
                </div>
              </>
            )}
          </Form>
        </Modal>
        <Footer style={{ textAlign: "center" }}>
          © 2024 LOOKOI. TRUST ALWAYS COMES FIRST.
        </Footer>
      </Layout>
    </Layout>
  );
}

export default SalesDashboard;
