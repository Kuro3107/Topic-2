import { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, Table, Button, theme } from 'antd';
import ManageForm from '../../pages/staff/manage-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('DashBoard', 'Board', <DesktopOutlined />),
  getItem('Bookings', 'Booking', <UserOutlined />, [
    getItem('Booking List', '3'),
    getItem('Booking Detail', '4'),
    getItem('Booking Management', '5'),
  ]),
];

const SalesDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [bookingData, setBookingData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'BookingID',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'Booking Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Trip Name',
      dataIndex: 'tripName',
      key: 'tripName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Booking Form',
      key: 'bookingForm',
      render: (record) => (
        <Button onClick={() => handleViewForm(record.bookingId)}>View Form</Button>
      ),
    },
    {
      title: 'Edit',
      key: 'edit',
      render: (record) => <Button onClick={() => handleEdit(record.bookingId)}>Edit</Button>,
    },
    {
      title: 'Quote',
      key: 'quote',
      render: (record) => (
        <Button onClick={() => handleQuote(record.bookingId)}>Quote</Button>
      ),
    },
  ];

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleViewForm = (bookingId) => {
    // Navigate to view booking form
    navigate(`/booking/${bookingId}`);
  };

  const handleEdit = (bookingId) => {
    // Navigate to edit booking form
    navigate(`/edit-booking/${bookingId}`);
  };

  const handleQuote = (bookingId) => {
    // Navigate to dashboard where form can be filled again
    navigate(`/dashboard/quote/${bookingId}`);
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get('https://api.example.com/bookings');
        setBookingData(response.data);
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookingData();
  }, []);

  const renderContent = () => {
    switch (selectedKey) {
      case '5': // Booking Management
        return (
          <Table columns={columns} dataSource={bookingData} rowKey="bookingId" />
        );
      case 'form':
        return <ManageForm />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onSelect={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Staff</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default SalesDashboard;
