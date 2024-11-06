import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  message,
  Popconfirm,
  Card,
  Typography,
  Space,
} from 'antd';
import axios from 'axios';

const { Title } = Typography;

const ManagePO = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [posResponse, bookingsResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/pos'),
        axios.get('http://localhost:8080/api/bookings')
      ]);

      const bookingsMap = new Map(
        bookingsResponse.data.map(booking => [booking.poId, booking])
      );

      const posWithBookings = posResponse.data.map(po => ({
        ...po,
        bookingId: bookingsMap.get(po.poId)?.bookingId || 'Booking deleted'
      }));

      setPos(posWithBookings);
    } catch (error) {
      message.error('Không thể tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (poId) => {
    try {
      await axios.delete(`http://localhost:8080/api/pos/${poId}`);
      message.success('Xóa PO thành công');
      fetchData();
    } catch (error) {
      message.error('Không thể xóa PO: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'PO ID',
      dataIndex: 'poId',
      key: 'poId',
    },
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount ? `${Number(amount).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
    },
    {
      title: 'Ngày giao Koi',
      dataIndex: 'koiDeliveryDate',
      key: 'koiDeliveryDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status || 'N/A',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xóa PO này?"
            onConfirm={() => handleDelete(record.poId)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const detailColumns = [
      {
        title: 'PO DetailID',
        dataIndex: 'poDetailId',
        key: 'poDetailId',
      },
      {
        title: 'Loại Koi',
        dataIndex: ['variety', 'varietyName'],
        key: 'varietyName',
      },
      {
        title: 'Trang trại',
        dataIndex: ['farm', 'farmName'],
        key: 'farmName',
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Đặt cọc',
        dataIndex: 'deposit',
        key: 'deposit',
        render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
      },
      {
        title: 'Tổng giá Koi',
        dataIndex: 'totalKoiPrice',
        key: 'totalKoiPrice',
        render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
      },
      {
        title: 'Giá còn lại',
        dataIndex: 'remainingPrice',
        key: 'remainingPrice',
        render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
      },
      {
        title: 'Ngày của chuyến đi',
        dataIndex: 'day',
        key: 'day',
      }
    ];

    return (
      <Table
        columns={detailColumns}
        dataSource={record.poDetails || []}
        pagination={false}
        rowKey="poDetailId"
      />
    );
  };

  return (
    <Card>
      <Title level={2}>Quản lý Purchase Orders</Title>
      <Table
        columns={columns}
        dataSource={pos}
        rowKey="poId"
        loading={loading}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total) => `Tổng số ${total} PO`,
        }}
      />
    </Card>
  );
};

export default ManagePO;
