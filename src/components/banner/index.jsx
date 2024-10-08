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

      // Hiển thị thông báo xác nhận dưới dạng toast
      toast.success("Đặt chuyến thành công! Chúng tôi sẽ liên hệ với bạn sớm.");

      // Hiển thị thông tin đặt chuyến dưới dạng toast
      toast.info(
        `Thông tin đặt chuyến: Giống cá - ${Booking.fishType}, Trang trại - ${Booking.farm}`
      );
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đặt chuyến. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Khám phá thế giới Koi</h1>
        <p>Trải nghiệm vẻ đẹp và sự thanh bình của cá Koi</p>
        <Button className="banner-button" onClick={showModal}>
          Đặt chuyến ngay
        </Button>
      </div>

      <Modal
        title="Đặt chuyến đi"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fishType"
            label="Giống cá"
            rules={[{ required: true, message: "Vui lòng nhập giống cá!" }]}
          >
            <Input placeholder="Nhập giống cá" />
          </Form.Item>
          <Form.Item
            name="farm"
            label="Trang trại"
            rules={[
              { required: true, message: "Vui lòng nhập tên trang trại!" },
            ]}
          >
            <Input placeholder="Nhập tên trang trại" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Xác nhận đặt chuyến
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Banner;
