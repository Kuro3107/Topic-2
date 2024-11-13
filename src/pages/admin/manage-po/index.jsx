import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  message,
  Popconfirm,
  Card,
  Typography,
  Space,
  Tabs,
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
      message.error('Cannot load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (poId) => {
    try {
      await axios.delete(`http://localhost:8080/api/pos/${poId}`);
      message.success('Delete PO successfully');
      fetchData();
    } catch (error) {
      message.error('Cannot delete PO: ' + error.message);
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
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount ? `${Number(amount).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
    },
    {
      title: 'Koi Delivery Date',
      dataIndex: 'koiDeliveryDate',
      key: 'koiDeliveryDate',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status || 'N/A',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this PO?"
            onConfirm={() => handleDelete(record.poId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
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
        title: 'Koi Type',
        dataIndex: ['variety', 'varietyName'],
        key: 'varietyName',
      },
      {
        title: 'Farm',
        dataIndex: ['farm', 'farmName'],
        key: 'farmName',
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Deposit',
        dataIndex: 'deposit',
        key: 'deposit',
        render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
      },
      {
        title: 'Total Koi Price',
        dataIndex: 'totalKoiPrice',
        key: 'totalKoiPrice',
        render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
      },
      {
        title: 'Remaining Price',
        dataIndex: 'remainingPrice',
        key: 'remainingPrice',
        render: (price) => price ? `${Number(price).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ',
      },
      {
        title: 'Trip Day',
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

  const filterPOsByStatus = (status) => {
    return pos.filter(po => 
      po.status?.toLowerCase() === status.toLowerCase()
    );
  };

  const tabItems = [
    {
      key: 'all',
      label: 'All',
      children: (
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
            showTotal: (total) => `Total ${total} PO`,
          }}
        />
      ),
    },
    {
      key: 'delivering',
      label: 'Delivering',
      children: (
        <Table
          columns={columns}
          dataSource={filterPOsByStatus('delivering')}
          rowKey="poId"
          loading={loading}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} PO delivering`,
          }}
        />
      ),
    },
    {
      key: 'delivered',
      label: 'Delivered',
      children: (
        <Table
          columns={columns}
          dataSource={filterPOsByStatus('delivered')}
          rowKey="poId"
          loading={loading}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} PO delivered`,
          }}
        />
      ),
    },
    {
      key: 'deny',
      label: 'Denied',
      children: (
        <Table
          columns={columns}
          dataSource={filterPOsByStatus('deny')}
          rowKey="poId"
          loading={loading}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Total ${total} PO denied`,
          }}
        />
      ),
    },
  ];

  return (
    <Card>
      <Title level={2}>Manage Purchase Orders</Title>
      <Tabs
        defaultActiveKey="all"
        items={tabItems}
        type="card"
      />
    </Card>
  );
};

export default ManagePO;
