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
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("/accounts");
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
      form.setFieldsValue(account);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingAccount) {
          await axios.put(`/accounts/${editingAccount.id}`, values);
          message.success("Account updated successfully");
        } else {
          await axios.post("/accounts", values);
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
      await axios.delete(`/accounts/${id}`);
      message.success("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      message.error("Failed to delete account");
    }
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
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
    activeTab === "all"
      ? accounts
      : accounts.filter((account) => account.role === activeTab);

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All Accounts" key="all" />

        <TabPane tab="Sales Staff" key="sales" />
        <TabPane tab="Consulting Staff" key="consulting" />
        <TabPane tab="Customers" key="customer" />
      </Tabs>

      <Button onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Create New Account
      </Button>

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
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: !editingAccount }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select>
              <Option value="sales">Sales</Option>
              <Option value="consulting">Consulting</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageAccounts;
