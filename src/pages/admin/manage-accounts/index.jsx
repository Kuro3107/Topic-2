import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tabs } from "antd";
import axios from "axios";

const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAccount, setEditingAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("manager"); // Thay đổi giá trị mặc định thành "manager"
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/accounts");
      setAccounts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      message.error("Failed to fetch accounts");
      setAccounts([]);
    }
  };

  const showModal = (account = null) => {
    setEditingAccount(account);
    if (account) {
      // Đảm bảo rằng tất cả các trường được thiết lập đúng
      form.setFieldsValue({
        username: account.username,
        password: "", // Không hiển thị password khi chỉnh sửa
        phone: account.phone,
        email: account.email,
        roleId: account.roleId,
        fullName: account.fullName,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        // Kiểm tra username tồn tại khi tạo mới tài khoản
        if (!editingAccount) {
          const usernameExists = accounts.some(
            (account) => account.username === values.username
          );
          if (usernameExists) {
            message.error("Username already exists. Please choose a different one.");
            return;
          }
        }

        // Kiểm tra email tồn tại
        if (values.email) {
          const emailExists = accounts.some(
            (account) => 
              account.email === values.email && 
              (!editingAccount || account.accountId !== editingAccount.accountId)
          );
          
          if (emailExists) {
            message.error("This email is already registered. Please use a different one.");
            return;
          }
        }

        // Tạo object accountData cơ bản không có password
        const accountData = {
          username: values.username,
          phone: values.phone,
          email: values.email,
          roleId: values.roleId,
          fullName: values.fullName,
        };

        // Chỉ thêm password vào accountData nếu có nhập password mới
        if (values.password) {
          accountData.password = values.password;
        }

        if (editingAccount) {
          await axios.put(
            `http://localhost:8080/api/accounts/${editingAccount.accountId}`,
            accountData
          );
          message.success("Account updated successfully");
        } else {
          // Đối với tài khoản mới, bắt buộc phải có password
          if (!values.password) {
            message.error("Password is required when creating a new account");
            return;
          }
          await axios.post("http://localhost:8080/api/accounts", accountData);
          message.success("New account created successfully");
        }
        setIsModalVisible(false);
        fetchAccounts();
      } catch (error) {
        console.error("Error saving account:", error);
        message.error("An error occurred while saving the account");
      }
    });
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this account?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      async onOk() {
        try {
          await axios.delete(`http://localhost:8080/api/accounts/${id}`);
          message.success("Account deleted successfully");
          fetchAccounts();
        } catch (error) {
          console.error("Error deleting account:", error);
          message.error("Unable to delete account");
        }
      },
    });
  };

  const columns = [
    { title: "ID", dataIndex: "accountId", key: "accountId" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      dataIndex: "roleId",
      key: "role",
      render: (roleId) => {
        switch (roleId) {
          case 1:
            return "Manager";
          case 2:
            return "Sales";
          case 3:
            return "Consultant";
          case 4:
            return "Delivery";
          case 5:
            return "Customer";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span>
          <Button onClick={() => showModal(record)}>Edit</Button>
          <Button
            onClick={() => handleDelete(record.accountId)}
            danger
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredAccounts = accounts
    .filter((account) => {
      // Lọc theo role trước
      if (activeTab === "manager" && account.roleId !== 1) return false;
      if (activeTab === "sales" && account.roleId !== 2) return false;
      if (activeTab === "consulting" && account.roleId !== 3) return false;
      if (activeTab === "delivery" && account.roleId !== 4) return false;
      if (activeTab === "customer" && account.roleId !== 5) return false;

      // Nếu có searchText thì tìm kiếm trong tất cả các trường
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        return (
          account.accountId?.toString().includes(searchLower) ||
          account.username?.toLowerCase().includes(searchLower) ||
          account.fullName?.toLowerCase().includes(searchLower) ||
          account.phone?.toLowerCase().includes(searchLower) ||
          account.email?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });

  return (
    <div className="account-management-container">
      <h1>Manage Accounts</h1>
      <Button
        onClick={() => showModal()}
        className="create-button"
        type="primary"
      >
        Create New Account
      </Button>
      <div className="content-wrapper">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Manager" key="manager" />
          <TabPane tab="Sales Staff" key="sales" />
          <TabPane tab="Consulting Staff" key="consulting" />
          <TabPane tab="Delivery Staff" key="delivery" />
          <TabPane tab="Customers" key="customer" />
        </Tabs>

        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search by ID, name, email, phone..."
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>

        <Table columns={columns} dataSource={filteredAccounts} rowKey="accountId" />
      </div>

      <Modal
        title={editingAccount ? "Edit Account" : "Create New Account"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]} // Username vẫn bắt buộc
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { 
                required: !editingAccount, // Chỉ bắt buộc khi tạo mới
                message: 'Please enter password when creating a new account'
              }
            ]}
          >
            <Input.Password placeholder={editingAccount ? "Leave blank if you don't want to change the password" : "Enter password"} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: false },
              {
                pattern: /^0\d{9}$/,
                message: "Phone number must be 10 digits and start with 0"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: false },
              {
                pattern: /^[a-zA-Z0-9._-]+@gmail\.com$/,
                message: "Please enter a valid Gmail address"
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
            <Select>
            <Option value={1}>1 (Manager)</Option>
              <Option value={2}>2 (Sales)</Option>
              <Option value={3}>3 (Consulting)</Option>
              <Option value={4}>4 (Delivery)</Option>
              <Option value={5}>5 (Customer)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: false }]} // Không bắt buộc
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAccounts;
