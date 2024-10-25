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
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { Space } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

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

  useEffect(() => {
    fetchBookings();
    fetchKoiFarms(); // Lấy danh sách Koi Farms khi component mount
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
          booking.status === "pending" ||
          booking.status === "rejected" ||
          booking.status === "detailed" ||
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

  // Trong hàm xử lý khi nhấn nút "OK"
  const handleTripOk = () => {
    tripForm
      .validateFields()
      .then(async (values) => {
        const tripDetails = values.tripDetails || [];
        const koiFarms = values.koiFarms || [];

        const payload = {
          tripName: values.tripName,
          priceTotal: values.priceTotal,
          tripDetails: tripDetails,
          koiFarms: koiFarms,
          favoriteFarm: values.favoriteFarm
            ? Array.isArray(values.favoriteFarm)
              ? values.favoriteFarm
              : values.favoriteFarm.split(",").map((farm) => farm.trim())
            : [],
          favoriteKoi: values.favoriteKoi
            ? Array.isArray(values.favoriteKoi)
              ? values.favoriteKoi
              : values.favoriteKoi.split(",").map((koi) => koi.trim())
            : [],
        };

        console.log("Trip data to be sent:", JSON.stringify(payload)); // Ghi log dữ liệu gửi đi

        if (isEditingTrip) {
          // Cập nhật trip
          console.log("Updating trip with payload:", payload); // Ghi log trước khi gửi
          axios
            .put(
              `http://localhost:8080/api/trips/${viewingBooking.tripId}`,
              payload
            )
            .then((response) => {
              console.log("Trip updated response:", response.data);
              updateTripDetails(viewingBooking.tripId, tripDetails);

              // Xử lý farms đã thêm và đã xóa
              const originalFarms = viewingBooking.koiFarms || [];
              const farmsToAdd = koiFarms.filter(
                (farm) =>
                  !originalFarms.some((orig) => orig.farmId === farm.farmId)
              );
              const farmsToRemove = originalFarms.filter(
                (farm) => !koiFarms.some((kf) => kf.farmId === farm.farmId)
              );

              // Gọi hàm để thêm farms mới
              farmsToAdd.forEach((farm) => {
                axios
                  .post(
                    `http://localhost:8080/api/trips/${viewingBooking.tripId}/farms`,
                    { farmId: farm.farmId }
                  )
                  .then((response) => {
                    console.log("Farm added:", response.data);
                  })
                  .catch((error) => {
                    console.error("Error adding farm:", error);
                    message.error("Unable to add farm");
                  });
              });

              // Gọi hàm để xóa farms đã bị loại bỏ
              farmsToRemove.forEach((farm) => {
                axios
                  .delete(
                    `http://localhost:8080/api/trips/${viewingBooking.tripId}/farms/${farm.farmId}`
                  )
                  .then((response) => {
                    console.log("Farm removed:", response.data);
                  })
                  .catch((error) => {
                    console.error("Error removing farm:", error);
                    message.error("Unable to remove farm");
                  });
              });

              fetchBookings();
            })
            .catch((error) => {
              console.error(
                "Error updating trip:",
                error.response ? error.response.data : error.message
              );
              message.error("Unable to update trip");
            });
        } else {
          // Tạo trip mới
          axios
            .post(`http://localhost:8080/api/trips`, payload)
            .then((response) => {
              const createdTrip = response.data;
              axios
                .get(`${bookingApi}/${viewingBooking.bookingId}`)
                .then((bookingResponse) => {
                  const currentBooking = bookingResponse.data;
                  const updatedBooking = {
                    ...currentBooking,
                    tripId: createdTrip.tripId,
                  };
                  console.log(
                    "Updating booking with data:",
                    JSON.stringify(updatedBooking)
                  ); // Ghi log dữ liệu gửi đi
                  axios
                    .put(
                      `${bookingApi}/${viewingBooking.bookingId}`,
                      updatedBooking
                    )
                    .then(() => {
                      message.success("Booking updated with new trip ID");
                      fetchBookings();
                    })
                    .catch((error) => {
                      console.error(
                        "Error updating booking with trip ID:",
                        error.response ? error.response.data : error.message
                      );
                      message.error("Unable to update booking with trip ID");
                    });
                })
                .catch((error) => {
                  console.error(
                    "Error fetching current booking data:",
                    error.response ? error.response.data : error.message
                  );
                  message.error("Unable to fetch current booking data");
                });
              updateTripDetails(createdTrip.tripId, tripDetails);
              updateKoiFarms(createdTrip.tripId, koiFarms, []); // Ghi chú: Chỉ gửi farms mới
            })
            .catch((error) => {
              console.error(
                "Error creating trip:",
                error.response ? error.response.data : error.message
              );
              message.error("Unable to create trip");
            });
        }

        setIsTripModalVisible(false);
      })
      .catch((error) => {
        console.error("Validation error:", error);
      });
  };

  const updateTripDetails = (tripId, tripDetails) => {
    tripDetails.forEach((detail) => {
      if (detail.tripDetailId) {
        // Nếu có tripDetailId thì cập nhật
        console.log("Trip details before sending:", tripDetails);
        if (
          detail.mainTopic &&
          detail.subTopic &&
          detail.day &&
          detail.notePrice
        ) {
          axios
            .put(
              `http://localhost:8080/api/trips/${tripId}/trip-details/${detail.tripDetailId}`,
              {
                mainTopic: detail.mainTopic,
                subTopic: detail.subTopic,
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
          detail.subTopic &&
          detail.day &&
          detail.notePrice
        ) {
          axios
            .post(`http://localhost:8080/api/trips/${tripId}/trip-details`, {
              mainTopic: detail.mainTopic,
              subTopic: detail.subTopic,
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
    Modal.confirm({
      title: "Select a farm to add",
      content: (
        <Select
          placeholder="Select a farm"
          onChange={(value) => {
            const selectedFarm = koiFarms.find((farm) => farm.farmId === value);
            if (selectedFarm) {
              const currentFarms = tripForm.getFieldValue("koiFarms") || [];
              // Kiểm tra farm đã tồn tại trong trip chưa
              if (
                !currentFarms.some(
                  (farm) => farm.farmId === selectedFarm.farmId
                )
              ) {
                // Thực hiện gọi API để thêm farm vào trip
                console.log(
                  "Adding farm to trip:",
                  viewingBooking.tripId,
                  selectedFarm.farmId
                ); // Kiểm tra dữ liệu
                axios
                  .post(
                    `http://localhost:8080/api/trips/${viewingBooking.tripId}/farms`,
                    { farmId: selectedFarm.farmId }
                  )
                  .then(() => {
                    // Cập nhật lại danh sách farm trong tripForm
                    tripForm.setFieldsValue({
                      koiFarms: [...currentFarms, selectedFarm],
                    });
                    message.success("Farm added successfully");
                    fetchKoiFarms(viewingBooking.tripId); // ồng bộ danh sách farms với backend
                  })
                  .catch((error) => {
                    message.error("An error occurred while adding the farm");
                    console.error("Error adding farm:", error);
                  });
              } else {
                message.warning(
                  "This farm has already been added to the trip."
                );
              }
            }
          }}
        >
          {koiFarms
            .filter((farm) => {
              const currentFarms = tripForm.getFieldValue("koiFarms") || [];
              return !currentFarms.some(
                (addedFarm) => addedFarm.farmId === farm.farmId
              );
            })
            .map((farm) => (
              <Select.Option key={farm.farmId} value={farm.farmId}>
                {farm.farmName} - {farm.location}
              </Select.Option>
            ))}
        </Select>
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
        <Button onClick={() => showModal(record)}>Update Booking</Button>
      ),
    },
    {
      title: "Trip Details",
      key: "tripDetail",
      render: (_, record) => {
        if (record.tripId) {
          // Nu booking đã có tripId thì hiện nút "View & Edit Trip"
          return (
            <Button onClick={() => showTripModal(record)}>
              View & Edit Trip
            </Button>
          );
        }
        // Nếu chưa có tripId thì hiện nút "Create Trip"
        return (
          <Button onClick={() => showTripModal(record)}>Create Trip</Button>
        );
      },
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Assuming you store your token here
    // Redirect to the login page
    window.location.href = "/login"; // Navigate to the login page
  };

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="deli-header">
          <Button
            type="primary"
            icon={<LogoutOutlined />} // Icon logout
            onClick={handleLogout}
            style={{ float: "right" }} // Căn phải
          >
            Logout
          </Button>
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
                value={bookings.filter((b) => b.status === "rejected").length}
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
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="detailed">Detailed</Select.Option>
                <Select.Option value="rejected">Rejected</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker disabled />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker disabled />
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
        >
          <Form form={tripForm} layout="vertical">
            <Form.Item name="tripName" label="Trip Name">
              <Input placeholder="Enter trip name" />
            </Form.Item>

            {isEditingTrip && (
              <>
                <Form.Item name="priceTotal" label="Total Price">
                  <InputNumber
                    placeholder="Enter total price"
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                {/* Form.List cho Trip Details */}
                <Form.List name="tripDetails">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => {
                        const tripDetailId = tripForm.getFieldValue([
                          "tripDetails",
                          index,
                          "tripDetailId",
                        ]); // Lấy tripDetailId từ form
                        return (
                          <Space key={field.key} align="baseline">
                            <Form.Item
                              {...field}
                              name={[field.name, "mainTopic"]}
                              label="Main Topic"
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
                            <Form.Item
                              {...field}
                              name={[field.name, "day"]}
                              label="Day"
                            >
                              <InputNumber min={1} />
                            </Form.Item>
                            <Button
                              onClick={() => {
                                if (tripDetailId) {
                                  // Kiểm tra xem tripDetailId có tồn tại không
                                  removeTripDetail(
                                    viewingBooking.tripId,
                                    tripDetailId
                                  ); // Gọi hàm xóa trip detail
                                } else {
                                  message.error("Trip detail ID is undefined."); // Thông báo lỗi nếu ID không tồn tại
                                }
                                remove(field.name); // Xóa trip detail khỏi form
                              }}
                            >
                              Remove
                            </Button>
                          </Space>
                        );
                      })}
                      <Button onClick={() => add()}>Add Trip Detail</Button>
                    </>
                  )}
                </Form.List>

                {/* Hiển thị danh sách Koi Farms */}
                <Form.List name="koiFarms">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field) => {
                        const farmId = tripForm.getFieldValue([
                          "koiFarms",
                          field.name,
                          "farmId",
                        ]);
                        const farmName = tripForm.getFieldValue([
                          "koiFarms",
                          field.name,
                          "farmName",
                        ]);
                        const location = tripForm.getFieldValue([
                          "koiFarms",
                          field.name,
                          "location",
                        ]);

                        return (
                          <div key={field.key}>
                            <h4>{farmName}</h4>
                            <p>{location}</p>
                            <Button
                              onClick={() => {
                                // Gọi API xóa farm và xóa khỏi form
                                handleRemoveFarm(farmId); // Hàm này sẽ gọi API và xóa farm khỏi form
                                remove(field.name); // Xóa farm khỏi form sau khi API xóa thành công
                              }}
                            >
                              Remove Farm
                            </Button>
                          </div>
                        );
                      })}
                      <Button
                        type="dashed"
                        onClick={handleAddFarm}
                        style={{ width: "100%", marginTop: "16px" }}
                      >
                        Add Farm
                      </Button>
                    </>
                  )}
                </Form.List>
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
