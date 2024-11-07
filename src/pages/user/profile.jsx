/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../components/header/index";
import Footer from "../../components/footer/index";
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
  DeleteOutlined,
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
  "https://scontent-hkg1-2.xx.fbcdn.net/v/t39.30808-6/463915475_1889758918177483_6652777735107939029_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHadwfu8UN55EWm56paxASxVEnY-eRM_k5USdj55Ez-TuZHK2ueOZRCqznZWXzjwsr0Tyyu7WksQWov3wXSYvPb&_nc_ohc=7PVzRf7kRo0Q7kNvgHC04W-&_nc_zt=23&_nc_ht=scontent-hkg1-2.xx&_nc_gid=A3Gqn9CkIiCKAXWBBO83gSm&oh=00_AYDqPQ59s18jaKkcfUdeXvBM8C5SbcIRtj6vEG75gcz8Ng&oe=671B1570",
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
  const [isRefundModalVisible, setIsRefundModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState(false);

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
              email: response.data.email || "Not Updated!",
              phone: response.data.phone || "Not Updated!",
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
        // Xóa dòng này để không hiển thị thông báo lỗi
        // toast.error("An error occurred while fetching user information.");
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

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const Message = query.get('message');
    if (Message === 'success') {
        message.success('Payment successful!');
    } else if (Message === 'failure' || Message === "retry") {
        message.error('Payment failed. Please try again.');
    }

}, []);

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
    setSelectedBooking(bookingDetails); // Lu thông tin booking vào state

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
      message.success("Avatar has been updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      message.error("An error occurred while updating the avatar.");
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
    setRating(0);
    setComments("");
    setFeedbackId(null);
    setIsEditMode(true);
    setIsFeedbackModalVisible(true);
  };

  // Hàm để mở modal xem đánh giá
  const handleViewReview = async (bookingId) => {
    const booking = orders.find((order) => order.bookingId === bookingId);
    setSelectedBooking(booking);
    setFeedbackId(booking.feedbackId);
    setIsEditMode(false); // Luôn bắt đầu ở chế độ xem

    if (booking.feedbackId) {
      try {
        const response = await api.get(`/feedbacks/${booking.feedbackId}`);
        const feedbackData = response.data;
        setRating(feedbackData.rating);
        setComments(feedbackData.comments);
      } catch (error) {
        console.error("Error fetching feedback details:", error);
        toast.error("An error occurred while fetching feedback details.");
      }
    }

    setIsFeedbackModalVisible(true);
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
    if (!rating || rating < 1 || rating > 5) {
      toast.error("Please provide a valid rating between 1 and 5");
      return;
    }

    if (!comments.trim()) {
      toast.error("Please provide some comments");
      return;
    }

    const feedbackData = {
      rating,
      comments,
    };

    try {
      let response;
      if (feedbackId) {
        // Cập nhật feedback hiện có
        response = await api.put(`/feedbacks/${feedbackId}`, feedbackData);
        toast.success("Feedback updated successfully!");
      } else {
        // Tạo feedback mới
        response = await api.post(`/feedbacks`, feedbackData);
        const newFeedbackId = response.data.feedbackId;
        
        // Cập nhật booking với feedbackId mới
        await api.patch(`/bookings/${selectedBooking.bookingId}`, {
          feedbackId: newFeedbackId,
          status: "Finished",
          consultant: null
        });
        
        toast.success("Feedback submitted successfully!");
      }

      // Cập nhật state orders
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.bookingId === selectedBooking.bookingId
            ? {
                ...order,
                feedbackId: feedbackId || response.data.feedbackId,
                status: "Finished",
                consultant: null
              }
            : order
        )
      );

      setIsEditMode(false); // Chuyển về chế độ xem
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
      message.success("Avatar has been updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      message.error("An error occurred while updating the avatar.");
    }
  };

  const handleBackgroundChange = (newBackground) => {
    setBackgroundImage(newBackground);
    // Ở đây bạn có thể thêm logic để lưu lựa chọn của người dùng vào local storage hoặc database nếu cần
  };

  // Di chuyển handleDeleteAvatar lên trước avatarPopoverContent
  const handleDeleteAvatar = async () => {
    try {
      // Gọi API để cập nhật imageUrl thành null hoặc defaultImageUrl
      await api.put(
        `/accounts/${parsedUser.id}/image`,
        { imageUrl: defaultImageUrl },
        { headers: { Authorization: `Bearer ${parsedUser.token}` } }
      );

      // Cập nhật state local
      setUser(prevUser => ({ ...prevUser, imageUrl: defaultImageUrl }));
      message.success('Avatar đã được xóa thành công!');
    } catch (error) {
      console.error("Error deleting avatar:", error);
      message.error('Đã xảy ra lỗi khi xóa avatar.');
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '150px' }}>
      <Upload
        name="avatar"
        showUploadList={false}
        beforeUpload={(file) => {
          handleImageUpload(file);
          return false;
        }}
      >
        <Button 
          icon={<CameraOutlined />} 
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          Change Avatar
        </Button>
      </Upload>
      <Button 
        icon={<DeleteOutlined />} 
        danger
        onClick={handleDeleteAvatar}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        Delete Avatar
      </Button>
    </div>
  );

  const showRefundModal = () => {
    setIsRefundModalVisible(true);
  };

  const handleCloseRefundModal = () => {
    setIsRefundModalVisible(false);
  };

  const showDeleteConfirm = (bookingId) => {
    setBookingToDelete(bookingId);
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/bookings/${bookingToDelete}`, {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      });
      toast.success("Order was canceled successfully.");
      setOrders(orders.filter((order) => order.bookingId !== bookingToDelete));
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("An error occurred while canceling the order.");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setBookingToDelete(null);
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete(`/accounts/${parsedUser.id}`);
      message.success('Tài khoản đã được xóa thành công');
      // Xóa thông tin người dùng khỏi localStorage
      localStorage.removeItem('userInfo');
      // Chuyển hướng về trang chủ
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      message.error('Có lỗi xảy ra khi xóa tài khoản');
    }
  };

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
      title: "Feedback",
      key: "Feedback",
      render: (_, record) => {
        return (
          <>
            <Button
              onClick={() => handleViewBooking(record.bookingId)}
              icon={<ShoppingOutlined />}
              style={{ marginRight: 8 }}
            >
              View
            </Button>
            {record.status && record.status.toLowerCase() === "approved" && (
              <Button
                onClick={() => handlePayment(record)}
                type="primary"
                style={{ marginRight: 8 }}
              >
                Pay
              </Button>
            )}
            {record.feedbackId ? (
              <Button
                onClick={() => handleViewReview(record.bookingId)}
                type="default"
                style={{ fontWeight: "bold" }}
              >
                View Feedback
              </Button>
            ) : record.status &&
              (record.status.toLowerCase() === "" ||
                record.status.toLowerCase() === "checkout") ? (
              <Button
                onClick={() => handleCreateReview(record.bookingId)}
                type="default"
                style={{ fontWeight: "bold" }}
              >
                Finish Tour & Send Feedback
              </Button>
            ) : record.status && (record.status.toLowerCase() === "purchased" || record.status.toLowerCase() === "checkin") ? (
              <Button
                onClick={showRefundModal}
                type="primary"
                danger
              >
                Cancel & Refund
              </Button>
            ) : (
              <Button
                onClick={() => showDeleteConfirm(record.bookingId)}
                danger
              >
                Cancel
              </Button>
            )}
          </>
        );
      },
    },
  ];

  return (
    <div
      className="profile-page"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header />
      <main className="profile-content">
        <Card
          title={
            <div className="card-header">
              <h1>
                <UserOutlined /> Account Information
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
                style={{ marginRight: "10px" }}
              >
                Edit Information
              </Button>
              <Popover
                content={backgroundPopoverContent}
                title="Chọn ảnh nền"
                trigger="click"
                placement="bottom"
              >
                <Button icon={<PictureOutlined />} style={{ marginRight: "10px" }}>
                  Change Background
                </Button>
              </Popover>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={() => setIsDeleteAccountModalVisible(true)}
              >
                Delete Account
              </Button>
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
            <div style={{ marginBottom: '10px' }}>
              <strong>Full Name:</strong> {user.fullName || 'Not Updated!'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Username:</strong> {user.username || 'N/A'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Email:</strong> {user.email || 'Not Updated!'}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Phone:</strong> {user.phone || 'Not Updated!'}
            </div>
            {user.roleId !== 5 && (
              <div style={{ marginBottom: '10px' }}>
                <strong>Role:</strong> {roleMapping[user.roleId] || 'Unknown'}
              </div>
            )}
          </div>
        </Card>

        {/* Chỉ hiển thị phần "Your Order" nếu roleId là 5 */}
        {user.roleId === 5 && (
          <Card
            title={
              <h1>
                <ShoppingOutlined /> Your Order
              </h1>
            }
          >
            <div>
              {loading ? (
                <Spin />
              ) : (
                <Table 
                  columns={columns}
                  dataSource={orders} // Đảm bảo sử dụng orders ở đây
                  rowKey="bookingId"
                />
              )}
            </div>
          </Card>
        )}
        <Modal
          title="Booking Details"
          visible={isModalVisible}
          onCancel={handleCloseModal}
          className="booking-modal"
          footer={[
            <Button key="close" onClick={handleCloseModal}>
              Close
            </Button>,
          ]}
        >
          {selectedBooking && (
            <div>
              <section className="booking-details-section">
                <h3>Booking Information</h3>
                <div className="booking-info-grid">
                  <div className="booking-info-item">
                    <strong>Booking ID:</strong>
                    <span>{selectedBooking.bookingId}</span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Booking Date:</strong>
                    <span>
                      {new Date(
                        selectedBooking.bookingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Full Name:</strong>
                    <span>{selectedBooking.fullname}</span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Email:</strong>
                    <span>{selectedBooking.email}</span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Phone:</strong>
                    <span>{selectedBooking.phone}</span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Status:</strong>
                    <span>{selectedBooking.status}</span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Start Date:</strong>
                    <span>
                      {new Date(selectedBooking.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="booking-info-item">
                    <strong>End Date:</strong>
                    <span>
                      {selectedBooking.endDate
                        ? new Date(selectedBooking.endDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="booking-info-grid">
                  <div className="booking-info-item">
                    <strong>Favorite Farms:</strong>
                    <span>{selectedBooking.favoriteFarm}</span>
                  </div>
                  <div className="booking-info-item">
                    <strong>Favorite Koi:</strong>
                    <span>{selectedBooking.favoriteKoi}</span>
                  </div>
                </div>

                <div className="booking-info-item">
                  <strong>Note:</strong>
                  <span>{selectedBooking.note}</span>
                </div>
              </section>

              {selectedBooking.poDetails && (
                <section className="booking-details-section">
                  <h3>PO Details</h3>
                  <div className="booking-info-grid">
                    <div className="booking-info-item">
                      <strong>PO ID:</strong>
                      <span>{selectedBooking.poDetails.poId}</span>
                    </div>
                    <div className="booking-info-item">
                      <strong>Total Amount:</strong>
                      <span>{selectedBooking.poDetails.totalAmount}</span>
                    </div>
                    <div className="booking-info-item">
                      <strong>Koi Delivery Date:</strong>
                      <span>
                        {new Date(
                          selectedBooking.poDetails.koiDeliveryDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="booking-info-item">
                      <strong>Status:</strong>
                      <span>{selectedBooking.poDetails.status}</span>
                    </div>
                    <div className="booking-info-item">
                      <strong>Address:</strong>
                      <span>{selectedBooking.poDetails.address}</span>
                    </div>
                  </div>
                </section>
              )}

              {selectedBooking.tripDetails && (
                <section className="booking-details-section">
                  <h3>Trip Details</h3>
                  <div className="booking-info-grid">
                    <div className="booking-info-item">
                      <strong>Trip ID:</strong>
                      <span>{selectedBooking.tripDetails.tripId}</span>
                    </div>
                    <div className="booking-info-item">
                      <strong>Trip Name:</strong>
                      <span>{selectedBooking.tripDetails.tripName}</span>
                    </div>
                    <div className="booking-info-item">
                      <strong>Total Price:</strong>
                      <span>${selectedBooking.tripDetails.priceTotal}</span>
                    </div>
                  </div>

                  {selectedBooking.tripDetails.imageUrl && ( // Kiểm tra xem có hình ảnh không
                    <img
                      src={selectedBooking.tripDetails.imageUrl}
                      alt="Trip"
                      className="trip-image"
                    />
                  )}

                  <div className="trip-itinerary">
                    <h4>Trip Itinerary:</h4>
                    {selectedBooking.tripDetails.tripDetails.map((detail) => (
                      <div key={detail.tripDetailId} className="itinerary-day">
                        <strong>Day {detail.day}:</strong> {detail.mainTopic} -{" "}
                        {detail.subTopic} (Price: ${detail.notePrice})
                      </div>
                    ))}
                  </div>

                  <div className="farm-section">
                    <h4>Koi Farms:</h4>
                    {selectedBooking.tripDetails.koiFarms.map((farm) => (
                      <div key={farm.farmId} className="farm-section">
                        <div className="farm-header">
                          <h5>{farm.farmName}</h5>
                          <span>({farm.location})</span>
                        </div>
                        <p>Contact: {farm.contactInfo}</p>
                        <img
                          src={farm.imageUrl}
                          alt={farm.farmName}
                          className="farm-image"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </Modal>

        <Modal
          title={feedbackId ? (isEditMode ? "Edit Feedback" : "View Feedback") : "Create Feedback"}
          visible={isFeedbackModalVisible}
          onCancel={handleCloseFeedbackModal}
          footer={[
            <Button key="cancel" onClick={handleCloseFeedbackModal}>
              Close
            </Button>,
            isEditMode && (
              <Button 
                key="submit" 
                type="primary" 
                onClick={handleSubmitFeedback}
                style={{ 
                  backgroundColor: feedbackId ? '#1890ff' : '#52c41a',
                  borderColor: feedbackId ? '#1890ff' : '#52c41a'
                }}
              >
                {feedbackId ? "Update Feedback" : "Finish Tour & Send Feedback"}
              </Button>
            ),
            !isEditMode && selectedBooking?.status === "Finished" && (
              <Button key="edit" type="primary" onClick={handleEditReview}>
                Edit Feedback
              </Button>
            )
          ]}
        >
          <div>
            <div className="feedback-item">
              <strong>Rating:</strong>
              {isEditMode ? (
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{
                    marginLeft: '10px',
                    padding: '5px',
                    width: '60px'
                  }}
                />
              ) : (
                <span style={{ marginLeft: '10px' }}>{rating} / 5</span>
              )}
            </div>
            <div className="feedback-item" style={{ marginTop: '15px' }}>
              <strong>Comments:</strong>
              {isEditMode ? (
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    marginTop: '5px',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #d9d9d9'
                  }}
                />
              ) : (
                <p style={{ 
                  marginTop: '5px',
                  padding: '8px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  minHeight: '80px'
                }}>
                  {comments}
                </p>
              )}
            </div>
          </div>
        </Modal>

        <Modal
          title="Hủy chuyến"
          visible={isRefundModalVisible}
          onCancel={handleCloseRefundModal}
          footer={[
            <Button key="close" onClick={handleCloseRefundModal}>
              Close
            </Button>
          ]}
        >
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Để hủy chuyến đi đã thanh toán, vui lòng liên hệ chúng tôi để được hỗ trợ và hướng dẫn hoàn tiền.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            <strong>Phone:</strong> 0387729579
          </p>
          <p style={{ fontSize: '16px' }}>
            <strong>Email:</strong> quankun2303@gmail.com
          </p>
        </Modal>

        <Modal
          title="Xác nhận hủy đặt tour"
          visible={isDeleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={handleCancelDelete}
          okText="Xác nhận"
          cancelText="Hủy"
        >
          <p>Bạn có chắc chắn muốn hủy đặt tour này không?</p>
          <p>Hành động này không thể hoàn tác.</p>
        </Modal>

        <Modal
          title="Xác nhận xóa tài khoản"
          visible={isDeleteAccountModalVisible}
          onOk={handleDeleteAccount}
          onCancel={() => setIsDeleteAccountModalVisible(false)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <p>Bạn có chắc chắn muốn xóa tài khoản này không?</p>
          <p>Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.</p>
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
