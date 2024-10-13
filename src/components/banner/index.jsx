import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import "./index.css";
import axios from "axios";
import { toast } from "react-toastify";
const api = "https://66dee860de4426916ee2e54c.mockapi.io/Booking";

const Banner = () => {
  const [Booking, setBooking] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onFinish = async (Booking) => {
    try {
      const response = await axios.post(api, Booking);
      setIsModalVisible(false);
      form.resetFields();

      // Display confirmation message as a toast
      toast.success("Booking successful! We will contact you soon.");

      // Display booking information as a toast
      toast.info(
        `Booking information: Fish Type - ${Booking.fishType}, Farm - ${Booking.farm}`
      );
    } catch (error) {
      toast.error("An error occurred while booking. Please try again later.");
    }
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Explore the World of Koi</h1>
        <p>Experience the beauty and tranquility of Koi fish</p>
        <Button className="banner-button" onClick={showModal}>
          Book Now
        </Button>
      </div>

      <Modal
        title="Book a Trip"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fishType"
            label="Fish Type"
            rules={[{ required: true, message: "Please enter the fish type!" }]}
          >
            <Input placeholder="Enter fish type" />
          </Form.Item>
          <Form.Item
            name="farm"
            label="Farm"
            rules={[{ required: true, message: "Please enter the farm name!" }]}
          >
            <Input placeholder="Enter farm name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Confirm Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Banner;