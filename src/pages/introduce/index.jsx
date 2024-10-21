import React from "react";
import { Typography, Row, Col, Card } from "antd";
import {
  GlobalOutlined,
  HeartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./index.css";

const { Title, Paragraph } = Typography;

function Introduce() {
  return (
    <div className="introduce-page">
      <Header />
      <div className="introduce-container">
        <div className="hero-section">
          <Title level={1}>Discover the Beauty of Japanese Koi Farms</Title>
          <Paragraph>
            Embark on a journey through Japan's most exquisite Koi farms
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} className="content-section">
          <Col xs={24} md={8}>
            <Card
              hoverable
              cover={
                <img
                  alt="Koi pond"
                  src="https://images.unsplash.com/photo-1540996772485-94e7e92bc1f0?q=80&w=2554&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              }
              className="info-card"
            >
              <GlobalOutlined className="card-icon" />
              <Title level={3}>World-Renowned Koi</Title>
              <Paragraph>
                Experience the living art of Nishikigoi, bred by master breeders
                with centuries of tradition.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              hoverable
              cover={
                <img
                  alt="Japanese garden"
                  src="https://images.unsplash.com/photo-1717406960071-ca8a082dd60d?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              }
              className="info-card"
            >
              <HeartOutlined className="card-icon" />
              <Title level={3}>Serene Environments</Title>
              <Paragraph>
                Immerse yourself in the tranquil beauty of traditional Japanese
                gardens and koi ponds.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card
              hoverable
              cover={
                <img
                  alt="Koi breeder"
                  src="https://images.unsplash.com/photo-1531165271550-26da99489d4a?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                />
              }
              className="info-card"
            >
              <EnvironmentOutlined className="card-icon" />
              <Title level={3}>Expert Guided Tours</Title>
              <Paragraph>
                Learn from experienced breeders and gain insights into the art
                of Koi cultivation.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        <div className="description-section">
          <Title level={2}>A Journey Through Japan's Finest Koi Farms</Title>
          <Paragraph>
            Embark on an unforgettable adventure through Japan's most
            prestigious Koi farms. Our curated tours offer a unique opportunity
            to witness the artistry and dedication behind breeding world-class
            Nishikigoi. From the serene ponds of Niigata to the historic farms
            of Hiroshima, each visit promises a deep dive into the rich culture
            and tradition of Koi breeding.
          </Paragraph>
          <Paragraph>
            You'll have the chance to:
            <ul>
              <li>
                Observe master breeders at work, selecting and caring for
                prize-winning Koi
              </li>
              <li>
                Learn about the different varieties of Koi and their distinct
                characteristics
              </li>
              <li>
                Enjoy the peaceful ambiance of beautifully landscaped Japanese
                gardens
              </li>
              <li>
                Participate in feeding sessions and get up close with these
                living jewels
              </li>
              <li>
                Discover the intricate process of Koi breeding, from spawning to
                selection
              </li>
            </ul>
          </Paragraph>
          <Paragraph>
            Whether you're a Koi enthusiast or simply appreciate the beauty of
            nature, our farm tours offer an immersive experience into the
            fascinating world of Japanese Koi. Join us on this extraordinary
            journey and create memories that will last a lifetime.
          </Paragraph>
        </div>

        <div className="system-introduction">
          <Title level={2}>Introducing Our Koi Order Management System</Title>
          <Paragraph>
            Our Koi Order Management System is a comprehensive solution designed for businesses and enthusiasts looking to streamline the process of purchasing Koi fish directly from Japan's renowned Koi farms. Tailored for companies that specialize in organizing trips to Japanese farms, our system offers real-time management of orders, customers, and product status, making the entire purchasing experience smoother and more efficient.
          </Paragraph>
          <Title level={3}>Key Features:</Title>
          <ul>
            <li><strong>Real-Time Order Management:</strong> Track orders from placement to delivery, ensuring that every Koi purchase is managed with precision and transparency.</li>
            <li><strong>Customer Service Flow Management:</strong> Facilitates a seamless experience from trip booking to purchasing Koi fish, including itinerary management, quotation approvals, and trip details.</li>
            <li><strong>Detailed Trip Customization:</strong> Each trip can include multiple detailed activities, allowing customization based on clients' preferences with features like main topic, price notes, and duration.</li>
            <li><strong>Comprehensive Purchase Details:</strong> Manage each order with specifics such as Koi ID, farm ID, deposit, remaining price, and quantity, making it easier to keep track of payments and inventory.</li>
            <li><strong>User-Friendly Interface:</strong> Our system is designed for ease of use, with a user-friendly interface that simplifies navigation for both business staff and customers.</li>
          </ul>
          <Title level={3}>Benefits:</Title>
          <ul>
            <li><strong>Efficiency & Transparency:</strong> Our system automates the order and trip management process, reducing manual errors and providing clients with up-to-date information about their Koi purchases.</li>
            <li><strong>Enhanced Customer Experience:</strong> By offering real-time updates and personalized trip details, we ensure that customers enjoy a tailored and stress-free journey to Japan's best Koi farms.</li>
            <li><strong>Improved Decision-Making:</strong> With data-driven insights and reporting capabilities, businesses can make informed decisions to improve customer satisfaction and optimize operational processes.</li>
            <li><strong>Scalability:</strong> Whether you're managing a few clients or expanding to accommodate more, our system can adapt to the growing needs of your business.</li>
          </ul>
          <Paragraph>
            With our Koi Order Management System, we bring you a powerful tool to manage your Koi purchases and trips with ease, ensuring your clients have a delightful and memorable experience in selecting the perfect Koi from Japan's finest farms.
          </Paragraph>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Introduce;
