import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  message,
  Select,
  Radio,
} from "antd";
import dayjs from "dayjs";
import axios from "axios";

function ManageBooking() {
  const [bookings, setBookings] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBooking, setEditingBooking] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // Mặc định hiển thị tất cả

  const api = "http://localhost:8080/api/bookings"; // Update API URL

  useEffect(() => {
    fetchBookings();
    fetchConsultants();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(api); // Fetch booking data from API
      setBookings(response.data); // Set bookings without the isActive logic
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Unable to fetch booking list");
    }
  };

  const fetchConsultants = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/accounts');
      const consultants = response.data.filter(account => account.roleId === 3);
      setConsultants(consultants); // Store consultants for use in the dropdown
    } catch (error) {
      console.error("Error fetching consultants:", error);
      message.error("Unable to fetch consultant list");
    }
  };

  // Cập nhật giá trị cho modal
const showModal = (booking = null) => {
  if (booking.status === "Finished") {
      message.warning("Không thể chỉnh sửa booking đã không còn hoạt động");
      return;
  }
  setEditingBooking(booking);
  if (booking) {
      form.setFieldsValue({
          ...booking,
          startDate: dayjs(booking.startDate),
          endDate: dayjs(booking.endDate),
          consultant: booking.consultant || null, // Cập nhật giá trị consultant
      });
  } else {
      form.resetFields();
  }
  setIsModalVisible(true);
};

const handleOk = () => {
  form.validateFields().then((values) => {
      const bookingData = {
          status: values.status,
          consultant: values.consultant || null,
      };

      if (editingBooking && editingBooking.bookingId) {
          const updatedData = { 
              ...editingBooking, 
              ...bookingData,
              consultant: values.consultant === undefined ? null : values.consultant
          };
          updateBooking(editingBooking.bookingId, updatedData);
      } else {
          message.error("Không có ID đặt chỗ để cập nhật.");
      }
      setIsModalVisible(false);
  }).catch((error) => {
      console.error("Validation failed:", error);
  });
};

  const updateBooking = async (BookingID, bookingData) => {
    try {
      await axios.put(`${api}/${BookingID}`, bookingData);
      message.success("Booking updated successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking:", error);
      message.error("Unable to update booking");
    }
  };

  const deleteBooking = async (BookingID) => {
    try {
      await axios.delete(`${api}/${BookingID}`);
      message.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      message.error("Unable to delete booking");
    }
  };

  const getAvailableConsultants = () => {
    const assignedConsultants = bookings
      .filter(booking => booking.consultant && booking.bookingId !== (editingBooking ? editingBooking.bookingId : null))
      .map(booking => booking.consultant);

    return consultants.filter(consultant => !assignedConsultants.includes(consultant.username));
  };

  const getFilteredBookings = () => {
    if (statusFilter === 'all') {
      return bookings;
    }
    return bookings.filter(booking => 
      booking.status?.toLowerCase() === statusFilter.toLowerCase()
    );
  };

  const columns = [
    { title: "ID", dataIndex: "bookingId", key: "bookingId" },
    { title: "Tên khách hàng", dataIndex: "fullname", key: "fullname" },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : null,
    },
    { title: "Koi yêu thích", dataIndex: "favoriteKoi", key: "favoriteKoi" },
    {
      title: "Trang trại yêu thích",
      dataIndex: "favoriteFarm",
      key: "favoriteFarm",
    },
    {
      title: "Consultant Staff",
      dataIndex: "consultant",
      key: "consultant",
      render: (consultant) => consultant || 'Chưa chỉ định', // Display if no consultant assigned
    },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>
            Sửa
          </Button>
          <Button
            onClick={() => deleteBooking(record.bookingId)}
            danger
          >
            Xóa
          </Button>
          <Button onClick={() => viewTripDetails(record.bookingId)}>
            View Trip Detail
          </Button>
        </>
      ),
    },
  ];

  const viewTripDetails = async (bookingId) => {
    try {
        const responseTrips = await axios.get(`http://localhost:8080/api/trips`); // Gọi API để lấy tất cả các chuyến đi
        const responseFarms = await axios.get(`http://localhost:8080/api/farms`); // Gọi API để lấy tất cả các trang trại

        // Lấy trip_id từ booking tương ứng
        const booking = bookings.find(b => b.bookingId === bookingId);
        if (!booking) {
            message.warning("Không tìm thấy đặt chỗ.");
            return;
        }

        // Lọc chuyến đi theo trip_id từ booking
        const trips = responseTrips.data.filter(trip => trip.tripId === booking.tripId);
        
        // Hiển thị thông tin chuyến đi
        if (trips.length > 0) {
            Modal.info({
                title: 'Chi tiết chuyến đi',
                content: (
                    <div>
                        {trips.map(trip => (
                            <div key={trip.tripId}>
                                <p>Trip ID: {trip.tripId}</p>
                                <p>Tên chuyến đi: {trip.tripName}</p>
                                <p>Tổng giá: {trip.priceTotal} VNĐ</p>
                                {trip.imageUrl && ( // Kiểm tra nếu có imageUrl
                                    <img src={trip.imageUrl} alt={trip.tripName} style={{ width: '100%', height: 'auto' }} />
                                )}
                                <h4>Chi tiết chuyến đi:</h4>
                                {trip.tripDetails.map(detail => (
                                    <div key={detail.tripDetailId}>
                                        <p>Ngày: {detail.day}</p>
                                        <p>Chủ đề chính: {detail.mainTopic}</p>
                                        <p>Chủ đề phụ: {detail.subTopic || 'Không có'}</p>
                                        <p>Giá ghi chú: {detail.notePrice} VNĐ</p>
                                    </div>
                                ))}
                                <h4>Trang trại Koi:</h4>
                                {trip.koiFarms.map(farm => (
                                    <div key={farm.farmId}>
                                      <img src={farm.imageUrl} alt="Hình ảnh trang trại" width="200" height="150" />
                                        <p>Tên trang trại: {farm.farmName}</p>
                                        <p>Địa điểm: {farm.location}</p>
                                        <p>Thông tin liên hệ: {farm.contactInfo}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ),
                onOk() {},
            });
        } else {
            message.warning("There are no trips available for this booking.");
        }
    } catch (error) {
        console.error("Error retrieving trip information:", error);
        message.error("Unable to get trip information");
    }
};

  const BOOKING_STATUSES = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'approved', label: 'Approved' },
    { value: 'purchased', label: 'Purchased' },
    { value: 'checkin', label: 'Checkin' },
    { value: 'checkout', label: 'Checkout' },
    { value: 'finished', label: 'Finished' }
  ];

  return (
    <div>
      <h1>Manage Booking</h1>
      
      {/* Thay đổi bộ lọc thành Radio.Group */}
      <div style={{ marginBottom: 16 }}>
        <Radio.Group 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          buttonStyle="solid"
        >
          {BOOKING_STATUSES.map(status => (
            <Radio.Button 
              key={status.value} 
              value={status.value}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              {status.label}
              <span style={{ marginLeft: 4 }}>
                ({status.value === 'all' 
                  ? bookings.length 
                  : bookings.filter(b => 
                      b.status?.toLowerCase() === status.value
                    ).length})
              </span>
            </Radio.Button>
          ))}
        </Radio.Group>

        {/* Hiển thị tổng số booking đã lọc */}
        <div style={{ marginTop: 8 }}>
          <span>
            Showing: {getFilteredBookings().length} bookings
          </span>
        </div>
      </div>

      {/* Cập nhật Table với status mới */}
      <Table 
        columns={columns} 
        dataSource={getFilteredBookings()} 
        rowKey="bookingId"
        rowClassName={(record) => {
          switch(record.status?.toLowerCase()) {
            case 'pending':
              return 'row-pending';
            case 'detailed':
              return 'row-detailed';
            case 'rejected':
              return 'row-rejected';
            case 'approved':
              return 'row-approved';
            case 'purchased':
              return 'row-purchased';
            case 'checkin':
              return 'row-checkin';
            case 'checkout':
              return 'row-checkout';
            case 'finished':
              return 'row-finished';
            default:
              return '';
          }
        }}
      />

      <Modal
        title={editingBooking ? "Edit Booking" : "Add New Booking"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullname"
            label="Tên"
            rules={[{ required: true }]}
          >
            <Input disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              {/* <Select.Option value="pending">Pending</Select.Option> */}
              <Select.Option value="Detailed">Detailed</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
              {/* <Select.Option value="purchased">Purchased</Select.Option>
              <Select.Option value="checkin">Checkin</Select.Option>
              <Select.Option value="checkout">Checkout</Select.Option>
              <Select.Option value="finished">Finished</Select.Option> */}
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{ required: true }]}
          >
            <DatePicker disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{ required: true }]}
          >
            <DatePicker disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item name="favoriteKoi" label="Koi yêu thích">
            <Input disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item name="favoriteFarm" label="Trang trại yêu thích">
            <Input disabled={editingBooking !== null} />
          </Form.Item>
          <Form.Item
            name="consultant"
            label="Consultant Staff"
          >
            <Select 
              allowClear
              disabled={editingBooking === null || (editingBooking && editingBooking.status !== "Purchased")}
            >
              {getAvailableConsultants().map(consultant => (
                <Select.Option key={consultant.accountId} value={consultant.username}>
                  {consultant.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input disabled={editingBooking !== null} />
          </Form.Item>
        </Form>
      </Modal>

      {/* CSS styles */}
      <style>
        {`
          .row-pending {
            background-color: #fff7e6;
          }
          .row-detailed {
            background-color: #e6f7ff;
          }
          .row-rejected {
            background-color: #fff1f0;
          }
          .row-approved {
            background-color: #f6ffed;
          }
          .row-purchased {
            background-color: #f9f0ff;
          }
          .row-checkin {
            background-color: #e6fffb;
          }
          .row-checkout {
            background-color: #fcffe6;
          }
          .row-finished {
            background-color: #f0f2f5;
          }
          
          /* Hover effect */
          .row-pending:hover,
          .row-detailed:hover,
          .row-rejected:hover,
          .row-approved:hover,
          .row-purchased:hover,
          .row-checkin:hover,
          .row-checkout:hover,
          .row-finished:hover {
            opacity: 0.8;
          }

          /* Custom styles cho Radio.Button */
          .ant-radio-group {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .ant-radio-button-wrapper {
            min-width: 100px;
            text-align: center;
          }

          .ant-radio-button-wrapper-checked {
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
}

export default ManageBooking;
