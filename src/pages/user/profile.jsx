import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  Button,
  Spin,
  Card,
  Table,
  Modal,
  Upload,
  message,
  Popover,
} from "antd";
import PropTypes from "prop-types";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  EditOutlined,
  ShoppingOutlined,
  UploadOutlined,
  CameraOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import "./profile.css";
import api from "../../config/axios";
import { storage } from "../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Danh sách các ảnh nền mặc định từ internet
const defaultBackgrounds = [
  "https://images.unsplash.com/photo-1494319921810-2fab6cce50a5?q=80&w=2669&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1518171802599-4cd16785f93a?q=80&w=2450&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1504309092620-4d0ec726efa4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/463915475_1889758918177483_6652777735107939029_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHadwfu8UN55EWm56paxASxVEnY-eRM_k5USdj55Ez-TuZHK2ueOZRCqznZWXzjwsr0Tyyu7WksQWov3wXSYvPb&_nc_ohc=7PVzRf7kRo0Q7kNvgHC04W-&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=A3Gqn9CkIiCKAXWBBO83gSm&oh=00_AYDqPQ59s18jaKkcfUdeXvBM8C5SbcIRtj6vEG75gcz8Ng&oe=671B1570"
];

const defaultImageUrl = "/istockphoto-1495088043-612x612.jpg";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parsedUser, setParsedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const apiAccountBaseUrl = "http://localhost:8080/api/accounts/"; // Địa chỉ API
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [feedbackId, setFeedbackId] = useState(null); // Thêm state để lưu feedbackId
  const [isEditMode, setIsEditMode] = useState(false); // Thêm state để quản lý chế độ chỉnh sửa
  const [backgroundImage, setBackgroundImage] = useState(defaultBackgrounds[0]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const userInfo = localStorage.getItem("userInfo");

        if (userInfo) {
          const parsedUserData = JSON.parse(userInfo);
          setParsedUser(parsedUserData); // Cập nhật trạng thái parsedUser

          if (!parsedUserData.id) {
            toast.error("User ID does not exist.");
            return;
          }

          const apiAccount = `${apiAccountBaseUrl}${parsedUserData.id}`;
          console.log("Calling API with URL:", apiAccount);

          const response = await api.get(apiAccount);
          console.log("API Response:", response.data);

          if (response.data) {
            const customerData = response.data.customer; // Trích xuất thông tin khách hàng

            // Cập nhật user với thông tin từ API
            setUser({
              fullName: response.data.fullName || "Not Updated!",
              username: response.data.username || "N/A",
              email: response.data.email || "N/A",
              phone: response.data.phone || "N/A",
              status: response.data.status || "N/A",
              roleId: response.data.roleId || "N/A",
              imageUrl: response.data.imageUrl || defaultImageUrl, // Dùng hình ảnh mặc định nếu không có
            });

            const bookings = customerData.bookings || [];
            console.log("Fetched bookings:", bookings);
            setOrders(bookings);
          } else {
            toast.error("No bookings found for this user.");
          }
        } else {
          toast.warning("Please login to view personal information.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        toast.error("An error occurred while fetching user information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  console.log("Rendering Orders:", orders); // Log để kiểm tra orders

  useEffect(() => {
    console.log("Orders:", orders); // Kiểm tra giá trị orders sau khi cập nhật
  }, [orders]);

  useEffect(() => {
    console.log("Updated orders:", orders);
  }, [orders]);

  const handleEdit = () => {
    navigate("/edit-profile");
  };

  const handleCancelOrder = async (bookingId) => {
    try {
      await api.delete(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      });
      toast.success("Order was canceled successfully.");
      setOrders(orders.filter((order) => order.bookingId !== bookingId)); // Cập nhật lại danh sách orders
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("An error occurred while canceling the order.");
    }
  };

  const handleViewBooking = async (orderId) => {
    const bookingDetails = orders.find((order) => order.bookingId === orderId);
    setSelectedBooking(bookingDetails); // L��u thông tin booking vào state

    // Kiểm tra tripId và lấy thông tin trip nếu có
    if (bookingDetails.tripId) {
      try {
        const tripResponse = await api.get(
          `http://localhost:8080/api/trips/${bookingDetails.tripId}`
        );
        if (tripResponse.data) {
          setSelectedBooking((prev) => ({
            ...prev,
            tripDetails: tripResponse.data, // Thêm thông tin trip vào booking
          }));
        } else {
          toast.error("No trip details found.");
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        toast.error("An error occurred while fetching trip details.");
      }
    }

    // Lấy dữ liệu PO tương ứng với booking
    if (bookingDetails.poId) {
      try {
        const poResponse = await api.get(
          `http://localhost:8080/api/pos/${bookingDetails.poId}`
        );
        if (poResponse.data) {
          setSelectedBooking((prev) => ({
            ...prev,
            poDetails: poResponse.data, // Thêm thông tin PO vào booking
          }));
        } else {
          toast.error("No PO details found.");
        }
      } catch (error) {
        console.error("Error fetching PO details:", error);
        toast.error("An error occurred while fetching PO details.");
      }
    }

    setIsModalVisible(true); // Hiển thị modal
  };

  // Hàm để đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null); // Đặt lại state khi đóng modal
  };

  const roleMapping = {
    1: "Manager",
    2: "Sale Staff",
    3: "Consultant Staff",
    4: "Delivery Staff",
    5: "Customer",
  };

  const handleImageUpload = async (file) => {
    try {
      const storageRef = ref(storage, `avatars/${parsedUser.id}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Cập nhật URL ảnh trong cơ sở dữ liệu
      await api.put(
        `/accounts/${parsedUser.id}/image`,
        { imageUrl: downloadURL },
        { headers: { Authorization: `Bearer ${parsedUser.token}` } }
      );

      setUser((prevUser) => ({ ...prevUser, imageUrl: downloadURL }));
      message.success("Ảnh đại diện đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh:", error);
      message.error("Đã xảy ra lỗi khi cập nhật ảnh đại diện.");
    }
  };

  const handleImageChange = async (info) => {
    if (info.file.status === "done") {
      await handleImageUpload(info.file.originFileObj);
    }
  };

  const handlePayment = (order) => {
    navigate("/payment", { state: { order } });
  };

  // Hàm để mở modal tạo đánh giá
  const handleCreateReview = (bookingId) => {
    const booking = orders.find((order) => order.bookingId === bookingId);
    setSelectedBooking(booking);
    setRating(0); // Đặt lại rating
    setComments(""); // Đặt lại comments
    setFeedbackId(null); // Đặt lại feedbackId
    setIsFeedbackModalVisible(true);
    setIsEditMode(true); // Chế độ tạo mới
  };

  // Hàm để mở modal xem đánh giá
  const handleViewReview = async (bookingId) => {
    const booking = orders.find((order) => order.bookingId === bookingId);
    setSelectedBooking(booking);
    setFeedbackId(booking.feedbackId); // Lưu feedbackId

    if (booking.feedbackId) {
      try {
        const response = await api.get(`/feedbacks/${booking.feedbackId}`);
        const feedbackData = response.data;
        setRating(feedbackData.rating); // Lấy rating từ API
        setComments(feedbackData.comments); // Lấy comments từ API
      } catch (error) {
        console.error("Error fetching feedback details:", error);
        toast.error("An error occurred while fetching feedback details.");
      }
    }

    setIsFeedbackModalVisible(true);
    setIsEditMode(false); // Chế độ xem
  };

  // Hàm để chuyển sang chế độ chỉnh sửa
  const handleEditReview = () => {
    setIsEditMode(true);
  };

  // Hàm để đóng modal đánh giá
  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalVisible(false);
    setRating(0);
    setComments("");
  };

  // Hàm để gửi đánh giá
  const handleSubmitFeedback = async () => {
    const feedbackData = {
      rating,
      comments,
    };

    try {
      let response;
      if (feedbackId) {
        // Cập nhật đánh giá nếu feedbackId đã tồn tại
        response = await api.put(`/feedbacks/${feedbackId}`, feedbackData);
      } else {
        // Tạo mới đánh giá
        response = await api.post(`/feedbacks`, feedbackData);
      }
      const newFeedbackId = response.data.feedbackId;

      // Gửi yêu cầu chỉ cập nhật feedbackId và status cho booking hiện tại
      await api.patch(`/bookings/${selectedBooking.bookingId}`, {
        feedbackId: newFeedbackId,
        status: "kết thúc", // Cập nhật status thành "kết thúc"
      });

      // Cập nhật lại state để hiển thị feedback đã được gửi
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.bookingId === selectedBooking.bookingId
            ? {
                ...order,
                feedbackId: newFeedbackId,
                rating,
                comments,
                status: "kết thúc",
              }
            : order
        )
      );

      toast.success("Feedback submitted successfully!");
      handleCloseFeedbackModal();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred while submitting feedback.");
    }
  };

  const handleBackgroundUpload = async (file) => {
    try {
      const storageRef = ref(storage, `backgrounds/${parsedUser.id}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Cập nhật URL ảnh trong cơ sở dữ liệu
      await api.put(
        `/accounts/${parsedUser.id}/background`,
        { backgroundImage: downloadURL },
        { headers: { Authorization: `Bearer ${parsedUser.token}` } }
      );

      setBackgroundImage(downloadURL);
      message.success("Ảnh nền đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi tải lên ảnh nền:", error);
      message.error("Đã xảy ra lỗi khi cập nhật ảnh nền.");
    }
  };

  const handleBackgroundChange = (newBackground) => {
    setBackgroundImage(newBackground);
    // Ở đây bạn có thể thêm logic để lưu lựa chọn của người dùng vào local storage hoặc database nếu cần
  };

  const backgroundPopoverContent = (
    <div className="background-options">
      {defaultBackgrounds.map((bg, index) => (
        <img
          key={index}
          src={bg}
          alt={`Background ${index + 1}`}
          onClick={() => handleBackgroundChange(bg)}
          className="background-option"
        />
      ))}
    </div>
  );

  const avatarPopoverContent = (
    <div>
      <Upload
        name="avatar"
        showUploadList={false}
        beforeUpload={(file) => {
          handleImageUpload(file);
          return false;
        }}
      >
        <Button icon={<CameraOutlined />}>Thay đổi ảnh đại diện</Button>
      </Upload>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading information...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <p>Unable to load user information. Please log in again.</p>
        <Button onClick={() => navigate("/login")} type="primary">
          Log in
        </Button>
      </div>
    );
  }

  // Table columns
  const columns = [
    {
      title: "No",
      dataIndex: "bookingId",
      key: "bookingId",
      render: (_, __, index) => index + 1, // Hiển thị số thứ tự
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"), // Định dạng ngy, kiểm tra null
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <Button
              onClick={() => handleViewBooking(record.bookingId)}
              icon={<ShoppingOutlined />}
              style={{ marginRight: 8 }}
            >
              Xem lại
            </Button>
            {record.status && record.status.toLowerCase() === "approved" && (
              <Button
                onClick={() => handlePayment(record)}
                type="primary"
                style={{ marginRight: 8 }}
              >
                Thanh toán
              </Button>
            )}
            {record.feedbackId ? (
              <Button
                onClick={() => handleViewReview(record.bookingId)}
                type="default"
                style={{ fontWeight: "bold" }}
              >
                Xem đánh giá
              </Button>
            ) : record.status &&
              (record.status.toLowerCase() === "checkin" ||
                record.status.toLowerCase() === "checkout") ? (
              <Button
                onClick={() => handleCreateReview(record.bookingId)}
                type="default"
                style={{ fontWeight: "bold" }}
              >
                Đánh giá
              </Button>
            ) : (
              <Button
                onClick={() => handleCancelOrder(record.bookingId)}
                danger
              >
                Hủy
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div className="profile-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <Header />
      <main className="profile-content">
        <Card
          title={
            <div className="card-header">
              <h1>
                <UserOutlined /> Thông tin tài khoản
              </h1>
            </div>
          }
          extra={
            <div>
              <Button
                className="edit-button"
                onClick={handleEdit}
                type="primary"
                icon={<EditOutlined />}
                style={{ marginRight: '10px' }}
              >
                Chỉnh sửa thông tin
              </Button>
              <Popover
                content={backgroundPopoverContent}
                title="Chọn ảnh nền"
                trigger="click"
                placement="bottom"
              >
                <Button icon={<PictureOutlined />}>
                  Thay đổi ảnh nền
                </Button>
              </Popover>
            </div>
          }
        >
          <div className="profile-info">
            <Popover
              content={avatarPopoverContent}
              title="Cập nhật ảnh đại diện"
              trigger="click"
              placement="bottom"
            >
              <div className="avatar-container">
                <img
                  src={user.imageUrl || defaultImageUrl}
                  alt="Profile"
                  className="avatar-image"
                />
                <Button icon={<CameraOutlined />} className="avatar-edit" />
              </div>
            </Popover>
            <InfoItem
              icon={<UserOutlined />}
              label="fullName"
              value={user.fullName || "Not Updated!"}
            />
            <InfoItem
              icon={<UserOutlined />}
              label="Username"
              value={user.username || "N/A"}
            />
            <InfoItem
              icon={<MailOutlined />}
              label="Email"
              value={user.email || "N/A"}
            />
            <InfoItem
              icon={<PhoneOutlined />}
              label="Phone"
              value={user.phone || "N/A"}
            />
            <InfoItem
              icon={<LockOutlined />}
              label="Status"
              value={user.status || "N/A"}
            />
            <InfoItem
              icon={<UserOutlined />}
              label="Role"
              value={user.roleId ? roleMapping[user.roleId] : "N/A"}
            />
          </div>
        </Card>

        <Card
          title={
            <h2>
              <ShoppingOutlined /> Your Order
            </h2>
          }
        >
          <div>
            {loading ? (
              <Spin />
            ) : (
              <Table
                columns={columns}
                dataSource={orders} // Đảm bảo s dụng orders ở ây
                rowKey="bookingId"
              />
            )}
          </div>
        </Card>
        <Modal
          title="Booking Details"
          visible={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Đóng
            </Button>,
          ]}
        >
          {selectedBooking && (
            <div>
              <p>
                <strong>Booking ID:</strong> {selectedBooking.bookingId}
              </p>
              <p>
                <strong>Booking Date:</strong>{" "}
                {new Date(selectedBooking.bookingDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Full Name:</strong> {selectedBooking.fullname}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedBooking.phone}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedBooking.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(selectedBooking.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
              <p>
                <strong>Favorite Farms:</strong> {selectedBooking.favoriteFarm}
              </p>
              <p>
                <strong>Favorite Koi:</strong> {selectedBooking.favoriteKoi}
              </p>
              <p>
                <strong>Note:</strong> {selectedBooking.note}
              </p>
              {selectedBooking.poDetails && (
                <div>
                  <h3>PO Details</h3>
                  <p>
                    <strong>PO ID:</strong> {selectedBooking.poDetails.poId}
                  </p>
                  <p>
                    <strong>Total Amount:</strong>{" "}
                    {selectedBooking.poDetails.totalAmount}
                  </p>
                  <p>
                    <strong>Koi Delivery Date:</strong>{" "}
                    {new Date(
                      selectedBooking.poDetails.koiDeliveryDate
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedBooking.poDetails.status}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedBooking.poDetails.address}
                  </p>
                </div>
              )}
              {selectedBooking.tripDetails && (
                <div>
                  <h3>Trip Details</h3>
                  <p>
                    <strong>Trip ID:</strong>{" "}
                    {selectedBooking.tripDetails.tripId}
                  </p>
                  <p>
                    <strong>Trip Name:</strong>{" "}
                    {selectedBooking.tripDetails.tripName}
                  </p>
                  <p>
                    <strong>Total Price:</strong> $
                    {selectedBooking.tripDetails.priceTotal}
                  </p>
                  <img
                    src={selectedBooking.tripDetails.imageUrl}
                    alt="Trip"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <h4>Trip Itinerary:</h4>
                  {selectedBooking.tripDetails.tripDetails.map((detail) => (
                    <div key={detail.tripDetailId}>
                      <p>
                        <strong>Day {detail.day}:</strong> {detail.mainTopic} -{" "}
                        {detail.subTopic} (Price: ${detail.notePrice})
                      </p>
                    </div>
                  ))}
                  <h4>Koi Farms:</h4>
                  {selectedBooking.tripDetails.koiFarms.map((farm) => (
                    <div key={farm.farmId}>
                      <h5>
                        {farm.farmName} ({farm.location})
                      </h5>
                      <p>Contact: {farm.contactInfo}</p>
                      <img
                        src={farm.imageUrl}
                        alt={farm.farmName}
                        style={{ width: "100%", height: "auto" }}
                      />
                      {/* Xóa phần hiển thị koi varieties */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>

        <Modal
          title={isEditMode ? "Sửa đánh giá" : "Xem đánh giá"}
          visible={isFeedbackModalVisible}
          onCancel={handleCloseFeedbackModal}
          footer={[
            <Button key="cancel" onClick={handleCloseFeedbackModal}>
              Hủy
            </Button>,
            isEditMode ? (
              <Button
                key="submit"
                type="primary"
                onClick={handleSubmitFeedback}
              >
                Gửi đánh giá
              </Button>
            ) : (
              <Button key="edit" type="default" onClick={handleEditReview}>
                Sửa đánh giá
              </Button>
            ),
          ]}
        >
          <div>
            <label>
              <strong>Rating:</strong>
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                disabled={!isEditMode} // Chỉ cho phép chỉnh sửa khi ở chế độ chỉnh sửa
              />
            </label>
            <br />
            <label>
              <strong>Comments:</strong>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  color: "black",
                  backgroundColor: "white",
                }}
                disabled={!isEditMode} // Chỉ cho phép chỉnh sửa khi ở chế độ chỉnh sửa
              />
            </label>
          </div>
        </Modal>
      </main>
      <Footer />
    </div>
  );
}

const InfoItem = ({ icon, label, value }) => (
  <div className="info-item">
    <label>
      {icon} {label}:
    </label>
    <span>{value}</span>
  </div>
);

InfoItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default Profile;
