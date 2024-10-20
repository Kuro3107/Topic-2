import { useState, useEffect } from "react";
import { Table, Button, message, Space, Modal } from "antd";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

function Consulting() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [tripDetails, setTripDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchFarms(); // Tải danh sách farms
    fetchKoiVarieties(); // Tải danh sách koi varieties
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/bookings");
      const filteredBookings = response.data.filter(
        (booking) =>
          booking.status === "purchased" || booking.status === "checkin"
      );
      setBookings(filteredBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to fetch bookings");
      setBookings([]); // Đặt bookings là mảng rỗng nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const response = await api.get("http://localhost:8080/api/farms");
      setFarms(response.data);
    } catch (error) {
      console.error("Error fetching farms:", error);
      message.error("Failed to fetch farms");
    }
  };

  const fetchKoiVarieties = async () => {
    try {
      const response = await api.get("http://localhost:8080/api/koi-varieties");
      setKoiVarieties(response.data);
    } catch (error) {
      console.error("Error fetching koi varieties:", error);
      message.error("Failed to fetch koi varieties");
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const currentBooking = bookings.find(
        (booking) => booking.bookingId === bookingId
      );
      if (!currentBooking) {
        throw new Error("Booking not found");
      }
      await api.put(`/bookings/${bookingId}`, { ...currentBooking, status: newStatus });
      message.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error("Failed to update booking status");
    }
  };

  const showBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    
    // Kiểm tra tripId và lấy thông tin trip nếu có
    if (booking.tripId) {
      try {
        const tripResponse = await api.get(`http://localhost:8080/api/trips/${booking.tripId}`);
        if (tripResponse.data) {
          setTripDetails(tripResponse.data);
        } else {
          message.error("No trip details found.");
        }
      } catch (error) {
        console.error("Error fetching trip details:", error);
        message.error("An error occurred while fetching trip details.");
      }
    } else {
      setTripDetails(null);
    }

    setIsModalVisible(true);
  };

  const createPurchaseOrder = async (bookingId) => {
    try {
      // Gửi yêu cầu tạo Purchase Order mới cho booking
      const response = await api.post(`http://localhost:8080/api/pos/${bookingId}`, {
        total_amount: 0, // Giá trị mặc định, có thể cập nhật sau
        koi_delivery_date: null, // Giá trị mặc định, có thể cập nhật sau
        status: "Not Yet", // Trạng thái mặc định
      });

      const newPoId = response.data.po_id; // Đảm bảo API trả về po_id

      // Cập nhật PO ID cho booking
      const currentBooking = bookings.find(
        (booking) => booking.bookingId === bookingId
      );
      if (!currentBooking) {
        throw new Error("Booking not found");
      }
      await api.put(`/bookings/${bookingId}`, { ...currentBooking, poId: newPoId });
      message.success("Purchase Order created successfully.");
      fetchBookings();
    } catch (error) {
      console.error("Error creating purchase order:", error);
      message.error("Failed to create Purchase Order.");
    }
  };

  const viewPurchaseOrder = async (booking) => {
    // Lấy thông tin PO từ booking
    if (booking.poId) {
      try {
        const response = await api.get(`http://localhost:8080/api/pos/${booking.poId}`);
        const poData = response.data;

        // Cập nhật các state với thông tin từ PO
        setSelectedBooking(booking); // Giữ lại thông tin booking nếu cần
        setTotalAmount(poData.totalAmount); 
        setDeliveryDate(poData.koiDeliveryDate || null); 
        setStatus(poData.status || "pending"); 
        setPoAddress(poData.address || ''); // Cập nhật địa chỉ PO
        setIsPoModalVisible(true);

        // Gọi hàm fetchPODetails để tải danh sách PODetails
        await fetchPODetails(booking.poId);
      } catch (error) {
        console.error("Error fetching purchase order:", error);
        message.error("Failed to fetch Purchase Order.");
      }
    } else {
      message.error("No Purchase Order found for this booking.");
    }
  };

  const updatePurchaseOrder = async (poId) => {
    try {
      await api.put(`/pos/${poId}`, {
        totalAmount: totalAmount,
        koiDeliveryDate: deliveryDate,
        status: status,
        address: poAddress, // Cập nhật địa chỉ PO
      });
      message.success("Purchase Order updated successfully.");
      fetchBookings(); // Cập nhật lại danh sách bookings
      setIsPoModalVisible(false); // Đóng modal
    } catch (error) {
      console.error("Error updating purchase order:", error);
      message.error("Failed to update Purchase Order.");
    }
  };

  const fetchPODetails = async (poId) => {
    try {
      const response = await api.get(`http://localhost:8080/api/podetails/po/${poId}`);
      const podetailsWithNames = response.data.map(detail => {
        const farm = farms.find(f => f.farmId === detail.farm.farmId);
        const variety = koiVarieties.find(v => v.varietyId === detail.variety.varietyId);
        return {
          ...detail,
          farmName: farm ? farm.farmName : 'Unknown',
          varietyName: variety ? variety.varietyName : 'Unknown',
        };
      });
      setPODetails(podetailsWithNames);
    } catch (error) {
      console.error("Error fetching PODetails:", error);
      message.error("Failed to fetch PODetails");
    }
  };

  const createPODetail = async () => {
    const poDetail = {
      variety: { varietyId: selectedVarietyId },
      farm: { farmId: selectedFarmId },
      deposit: deposit,
      totalKoiPrice: totalKoiPrice,
      remainingPrice: remainingPrice,
      quantity: quantity,
      day: day, // Hoặc có thể thay đổi theo yêu cầu
    };

    try {
      // Gửi yêu cầu tạo PODetail mới cho PO với poId
      const response = await api.post(`http://localhost:8080/api/podetails/po/${selectedBooking.poId}`, poDetail);
      message.success("PODetail created successfully.");
      fetchPODetails(selectedBooking.poId); // Cập nhật danh sách PODetails
      setIsAddPODetailVisible(false); // Đóng modal
    } catch (error) {
      console.error("Error creating PODetail:", error);
      message.error("Failed to create PODetail.");
    }
  };

  const deletePODetail = async (poDetailId) => {
    try {
      await api.delete(`http://localhost:8080/api/podetails/${poDetailId}`);
      message.success("PODetail deleted successfully.");
      fetchPODetails(selectedBooking.poId); // Cập nhật danh sách PODetails
    } catch (error) {
      console.error("Error deleting PODetail:", error);
      message.error("Failed to delete PODetail.");
    }
  };

  const editPODetail = (poDetail) => {
    setEditingPODetail(poDetail);
    setSelectedFarmId(poDetail.farm.farmId); // Cập nhật farm đã chọn
    setSelectedVarietyId(poDetail.variety.varietyId); // Cập nhật variety đã chọn
    setQuantity(poDetail.quantity); // Cập nhật số lượng
    setDeposit(poDetail.deposit); // Cập nhật deposit
    setTotalKoiPrice(poDetail.totalKoiPrice); // Cập nhật tổng giá koi
    setRemainingPrice(poDetail.remainingPrice); // Cập nhật giá còn lại
    setDay(poDetail.day); // Cập nhật số ngày
    setIsEditPODetailVisible(true); // Mở modal chỉnh sửa
  };

  const updatePODetail = async () => {
    const updatedPODetail = {
      variety: { varietyId: selectedVarietyId },
      farm: { farmId: selectedFarmId },
      deposit: deposit,
      totalKoiPrice: totalKoiPrice,
      remainingPrice: remainingPrice,
      quantity: quantity,
      day: day,
    };

    try {
      await api.put(`http://localhost:8080/api/podetails/${editingPODetail.poDetailId}`, updatedPODetail);
      message.success("PODetail updated successfully.");
      fetchPODetails(selectedBooking.poId); // Cập nhật danh sách PODetails
      setIsEditPODetailVisible(false); // Đóng modal
    } catch (error) {
      console.error("Error updating PODetail:", error);
      message.error("Failed to update PODetail.");
    }
  };

  const columns = [
    { title: "Booking ID", dataIndex: "bookingId", key: "bookingId" },
    { title: "Full Name", dataIndex: "fullname", key: "fullname" },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button onClick={() => showBookingDetails(record)}>View Details</Button>
          
          {record.status === "purchased" && (
            <Button onClick={() => handleStatusChange(record.bookingId, "checkin")}>
              Check In
            </Button>
          )}
  
          {record.status === "checkin" && (
            <Button
              onClick={() => handleStatusChange(record.bookingId, "checkout")}
            >
              Check Out
            </Button>
          )}
          {
            <Button
              onClick={() => handleStatusChange(record.bookingId, "cancel")}
            >
              Create Purchase Order
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>Consulting Staff Dashboard</h1>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="bookingId"
        loading={loading}
      />
      <Modal
        title="Booking Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedBooking && (
          <div>
            <p>
              <strong>Booking ID:</strong> {selectedBooking.bookingId}
            </p>
            <p>
              <strong>Customer Name:</strong> {selectedBooking.fullname}
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
              <strong>Favorite Farms:</strong>{" "}
              {selectedBooking.favoriteFarm || "N/A"}
            </p>
            <p>
              <strong>Favorite Koi:</strong>{" "}
              {selectedBooking.favoriteKoi || "N/A"}
            </p>
            <p>
              <strong>Note:</strong> {selectedBooking.note || "N/A"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Consulting;