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
    setEditingBooking(booking);
    if (booking) {
      form.setFieldsValue({
        ...booking,
        startDate: dayjs(booking.startDate),
        endDate: dayjs(booking.endDate),
        consultant: booking.consultant || null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingBooking && editingBooking.bookingId) {
        const bookingData = {
          status: values.status,
          consultant: values.consultant || null,
        };

        const updatedData = { 
          ...editingBooking, 
          ...bookingData,
          consultant: values.consultant === undefined ? null : values.consultant
        };
        updateBooking(editingBooking.bookingId, updatedData);
      } else {
        message.error("There is no booking ID to update.");
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
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this booking?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await axios.delete(`${api}/${BookingID}`);
          message.success("Booking deleted successfully");
          fetchBookings();
        } catch (error) {
          console.error("Error deleting booking:", error);
          message.error("Unable to delete booking");
        }
      },
    });
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
    { title: "Customer Name", dataIndex: "fullname", key: "fullname" },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
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
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY") : null,
    },
    { title: "Favorite Koi", dataIndex: "favoriteKoi", key: "favoriteKoi" },
    {
      title: "Favorite Farm",
      dataIndex: "favoriteFarm",
      key: "favoriteFarm",
    },
    {
      title: "Consultant Staff",
      dataIndex: "consultant",
      key: "consultant",
      render: (consultant) => consultant || 'Not assigned', // Display if no consultant assigned
    },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)}>
            Edit
          </Button>
          <Button
            onClick={() => deleteBooking(record.bookingId)}
            danger
          >
            Delete
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
        const responseTrips = await axios.get(`http://localhost:8080/api/trips`);
        const responseFarms = await axios.get(`http://localhost:8080/api/farms`);

        const booking = bookings.find(b => b.bookingId === bookingId);
        if (!booking) {
            message.warning("Booking not found.");
            return;
        }

        const trips = responseTrips.data.filter(trip => trip.tripId === booking.tripId);
        
        if (trips.length > 0) {
            Modal.info({
                title: 'Trip Details',
                width: 800,
                className: 'trip-details-modal',
                content: (
                    <div className="trip-details-container">
                        {trips.map(trip => (
                            <div key={trip.tripId} className="trip-section">
                                <div className="trip-header">
                                    <h2>{trip.tripName}</h2>
                                    <div className="trip-meta">
                                        <div className="trip-info-item">
                                            <span className="label">Trip ID:</span>
                                            <span className="value">#{trip.tripId}</span>
                                        </div>
                                        <div className="trip-info-item">
                                            <span className="label">Total Price:</span>
                                            <span className="value">{trip.priceTotal.toLocaleString()} VNĐ</span>
                                        </div>
                                        <div className="trip-info-item">
                                            <span className="label">Sale Name:</span>
                                            <span className="value">{trip.saleName}</span>
                                        </div>
                                    </div>
                                </div>

                                {trip.imageUrl && (
                                    <div className="trip-image">
                                        <img src={trip.imageUrl} alt={trip.tripName} />
                                    </div>
                                )}

                                <div className="trip-details-section">
                                    <h3>Trip Schedule</h3>
                                    <div className="trip-details-grid">
                                        {trip.tripDetails.map(detail => (
                                            <div key={detail.tripDetailId} className="detail-card">
                                                <div className="detail-day">Day {detail.day}</div>
                                                <div className="detail-content">
                                                    <h4>{detail.mainTopic}</h4>
                                                    {detail.subTopic && <p>{detail.subTopic}</p>}
                                                    <div className="detail-price">
                                                          {detail.notePrice.toLocaleString()} VNĐ     
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="farms-section">
                                    <h3>Koi Farms</h3>
                                    <div className="farms-grid">
                                        {trip.koiFarms.map(farm => (
                                            <div key={farm.farmId} className="farm-card">
                                                <div className="farm-image">
                                                    <img src={farm.imageUrl} alt={farm.farmName} />
                                                </div>
                                                <div className="farm-info">
                                                    <h4>{farm.farmName}</h4>
                                                    <p><i className="fas fa-map-marker-alt"></i> {farm.location}</p>
                                                    <p><i className="fas fa-phone"></i> {farm.contactInfo}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
            label="Name"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true }]}
          >
            <Select disabled={editingBooking && editingBooking.status !== "Detailed"}>
              <Select.Option value="Detailed">Detailed</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
              <Select.Option value="Approved">Approved</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
          >
            <DatePicker disabled />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
          >
            <DatePicker disabled />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item name="favoriteKoi" label="Favorite Koi">
            <Input disabled />
          </Form.Item>
          <Form.Item name="favoriteFarm" label="Favorite Farm">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="consultant"
            label="Consultant Staff"
          >
            <Select 
              allowClear
              disabled={editingBooking && editingBooking.status !== "Detailed"}
            >
              {getAvailableConsultants().map(consultant => (
                <Select.Option key={consultant.accountId} value={consultant.username}>
                  {consultant.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Note">
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

          /* Trip Details Modal Styles */
          .trip-details-modal .ant-modal-content {
            border-radius: 8px;
            overflow: hidden;
          }

          .trip-details-modal .ant-modal-body {
            padding: 0;
          }

          .trip-details-container {
            max-height: 70vh;
            overflow-y: auto;
            padding: 24px;
          }

          .trip-section {
            background: #fff;
          }

          .trip-header {
            margin-bottom: 24px;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 16px;
          }

          .trip-header h2 {
            margin: 0;
            color: #1a1a1a;
            font-size: 24px;
          }

          .trip-meta {
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .trip-info-item {
            display: flex;
            align-items: center;
            padding: 8px 16px;
            background-color: #f8f9fa;
            border-radius: 6px;
          }

          .trip-info-item .label {
            font-size: 16px;
            color: #666;
            min-width: 120px;
          }

          .trip-info-item .value {
            font-size: 18px;
            font-weight: 600;
            color: #1890ff;
          }

          .trip-image {
            margin-bottom: 24px;
            border-radius: 8px;
            overflow: hidden;
          }

          .trip-image img {
            width: 100%;
            height: 300px;
            object-fit: cover;
          }

          .trip-details-section {
            margin-bottom: 32px;
          }

          .trip-details-section h3 {
            color: #1a1a1a;
            margin-bottom: 16px;
          }

          .trip-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 16px;
          }

          .detail-card {
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .detail-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .detail-day {
            background: #1890ff;
            color: white;
            padding: 8px 16px;
            font-weight: bold;
          }

          .detail-content {
            padding: 16px;
          }

          .detail-content h4 {
            margin: 0 0 8px 0;
            color: #1a1a1a;
          }

          .detail-price {
            margin-top: 8px;
            color: #52c41a;
            font-weight: bold;
          }

          .farms-section {
            margin-top: 32px;
          }

          .farms-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 24px;
          }

          .farm-card {
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .farm-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .farm-image {
            height: 200px;
            overflow: hidden;
          }

          .farm-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .farm-info {
            padding: 16px;
          }

          .farm-info h4 {
            margin: 0 0 8px 0;
            color: #1a1a1a;
          }

          .farm-info p {
            margin: 4px 0;
            color: #666;
          }

          .farm-info i {
            margin-right: 8px;
            color: #1890ff;
          }
        `}
      </style>
    </div>
  );
}

export default ManageBooking;
