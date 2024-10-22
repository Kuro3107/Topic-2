import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, message, Tabs } from "antd";
import axios from "axios";

const { Option } = Select;
const { TabPane } = Tabs;

const ManageAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingAccount, setEditingAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("sales"); // Đặt mặc định là "sales"

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
        password: '', // Không hiển thị password khi chỉnh sửa
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
        // Thêm trường fullName và phone vào values
        const accountData = {
          username: values.username,
          password: values.password,
          phone: values.phone,
          email: values.email,
          roleId: values.roleId,
          fullName: values.fullName,
        };

        if (editingAccount) {
          // Sử dụng editingAccount.accountId thay vì editingAccount.id
          await axios.put(`http://localhost:8080/api/accounts/${editingAccount.accountId}`, accountData);
          message.success("Account updated successfully");
        } else {
          await axios.post("http://localhost:8080/api/accounts", accountData);
          message.success("Account created successfully");
        }
        setIsModalVisible(false);
        fetchAccounts();
      } catch (error) {
        console.error("Error saving account:", error);
        message.error("Failed to save account");
      }
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/accounts/${id}`);
      message.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      message.error("Failed to delete account");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "accountId", key: "accountId" }, // Thêm cột ID
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
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const filteredAccounts =
    activeTab === "sales"
      ? accounts.filter((account) => account.roleId === 2)
      : activeTab === "consulting"
      ? accounts.filter((account) => account.roleId === 3)
      : activeTab === "delivery"
      ? accounts.filter((account) => account.roleId === 4)
      : accounts.filter((account) => account.roleId === 5); // "Customers"

  return (
    <div>
      <h1>Manage Accounts</h1>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Sales Staff" key="sales" />
        <TabPane tab="Consulting Staff" key="consulting" />
        <TabPane tab="Delivery Staff" key="delivery" />
        <TabPane tab="Customers" key="customer" />
      </Tabs>

      {activeTab !== "customer" && (
        <Button onClick={() => showModal()} style={{ marginBottom: 16 }}>
          Create New Account
        </Button>
      )}

      <Table columns={columns} dataSource={filteredAccounts} rowKey="id" />

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
          {/* Bỏ trường Password */}
          {/* <Form.Item
            name="password"
            label="Password"
            rules={[{ required: false }]} // Không bắt buộc
          >
            <Input.Password />
          </Form.Item> */}
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: false }]} // Không bắt buộc
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: false, type: "email" }]} // Không bắt buộc
          >
            <Input />
          </Form.Item>
          <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
            <Select>
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
