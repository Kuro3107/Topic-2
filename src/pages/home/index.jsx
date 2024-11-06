import React from "react";
import { Typography, Row, Col, Card, Button } from "antd";
import {
  GlobalOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  StarFilled,
} from "@ant-design/icons";
import Header from "../../components/header/index";
import Footer from "../../components/footer/index";
import "./index.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Rate } from "antd";

const { Title, Paragraph } = Typography;

const censorName = (fullName) => {
  if (!fullName) return '';
  const names = fullName.split(' ');
  const lastName = names[names.length - 1];
  const censoredPart = '*'.repeat(fullName.length - lastName.length);
  return censoredPart + lastName;
};

function HomePage() {

  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("userInfo") !== null;
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const feedbackResponse = await axios.get('http://localhost:8080/api/feedbacks');
        const bookingResponse = await axios.get('http://localhost:8080/api/bookings');
        
        // Kết hợp dữ liệu booking và feedback
        const combinedData = bookingResponse.data.map(booking => {
          const feedback = feedbackResponse.data.find(f => f.feedbackId === booking.feedbackId);
          if (feedback && feedback.rating >= 5) {
            return {
              bookingId: booking.bookingId,
              fullName: booking.fullname,
              rating: feedback.rating,
              comment: feedback.comments || 'No comment provided'
            };
          }
          return null;
        }).filter(item => item !== null);
        
        // Lấy ngẫu nhiên 5 feedback
        const shuffled = combinedData.sort(() => 0.5 - Math.random());
        setFeedbacks(shuffled.slice(0, 5));
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleBookTripClick = () => {
    if (!isLoggedIn) {
      toast.error("You must be logged in to book a trip!");
      navigate("/login");
    } else {
      navigate("/bookingform");
    }
  };

  const handleBookTripClick2 = () => {
      navigate("/product");
  };

  const partnerImages = [
    { src: '/logo-vietnam-airlines-2.png', alt: 'Partner 1' },
    { src: '/Logo-VietjetAir.jpg', alt: 'Partner 2' },
    { src: '/japan-airlines5379.jpg', alt: 'Partner 3' },
    { src: '/All-Nippon-Airways-logo.jpg', alt: 'Partner 4' },
    { src: '/JW-Marriottpng.png', alt: 'Partner 5' },
    { src: '/property_logo_99037720_1614133500.jpg', alt: 'Partner 6' },
    { src: '/1500x2250+Artboard+Shinrin+Hotel+3_4-01.png', alt: 'Partner 7' },
    { src: '/93d92dbf1c42071888488f759314d2c5.jpg', alt: 'Partner 8' },
    { src: '/japanexpress.png', alt: 'Partner 9' },
    { src: '/spx.jpg', alt: 'Partner 10' },
    { src: '/ghtk.jpg', alt: 'Partner 11' },
    { src: '/607cdb2f875a62174a2ac9e3_After_GHN.png', alt: 'Partner 12' }
    // Add more images as needed
  ];

  return (
    <div className="introduce-page">
      <Header />
      <div className="introduce-container">
        <div className="hero-section">
          <Title level={1}>Discover the Beauty of Japanese Koi Farms</Title>
          <Button className="banner-button" onClick={handleBookTripClick}>
            Create Your Tour Now
          </Button>
          <Button className="banner-button" onClick={handleBookTripClick2}>
            Discover Our Tours
          </Button>
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
            Our Koi Order Management System is a comprehensive solution designed
            for businesses and enthusiasts looking to streamline the process of
            purchasing Koi fish directly from Japan's renowned Koi farms.
            Tailored for companies that specialize in organizing trips to
            Japanese farms, our system offers real-time management of orders,
            customers, and product status, making the entire purchasing
            experience smoother and more efficient.
          </Paragraph>
          <Title level={3}>Key Features:</Title>
          <ul>
            <li>
              <strong>Real-Time Order Management:</strong> Track orders from
              placement to delivery, ensuring that every Koi purchase is managed
              with precision and transparency.
            </li>
            <li>
              <strong>Customer Service Flow Management:</strong> Facilitates a
              seamless experience from trip booking to purchasing Koi fish,
              including itinerary management, quotation approvals, and trip
              details.
            </li>
            <li>
              <strong>Detailed Trip Customization:</strong> Each trip can
              include multiple detailed activities, allowing customization based
              on clients' preferences with features like main topic, price
              notes, and duration.
            </li>
            <li>
              <strong>Comprehensive Purchase Details:</strong> Manage each order
              with specifics such as Koi ID, farm ID, deposit, remaining price,
              and quantity, making it easier to keep track of payments and
              inventory.
            </li>
            <li>
              <strong>User-Friendly Interface:</strong> Our system is designed
              for ease of use, with a user-friendly interface that simplifies
              navigation for both business staff and customers.
            </li>
          </ul>
          <Title level={3}>Benefits:</Title>
          <ul>
            <li>
              <strong>Efficiency & Transparency:</strong> Our system automates
              the order and trip management process, reducing manual errors and
              providing clients with up-to-date information about their Koi
              purchases.
            </li>
            <li>
              <strong>Enhanced Customer Experience:</strong> By offering
              real-time updates and personalized trip details, we ensure that
              customers enjoy a tailored and stress-free journey to Japan's best
              Koi farms.
            </li>
            <li>
              <strong>Improved Decision-Making:</strong> With data-driven
              insights and reporting capabilities, businesses can make informed
              decisions to improve customer satisfaction and optimize
              operational processes.
            </li>
            <li>
              <strong>Scalability:</strong> Whether you're managing a few
              clients or expanding to accommodate more, our system can adapt to
              the growing needs of your business.
            </li>
          </ul>
          <Paragraph>
            With our Koi Order Management System, we bring you a powerful tool
            to manage your Koi purchases and trips with ease, ensuring your
            clients have a delightful and memorable experience in selecting the
            perfect Koi from Japan's finest farms.
          </Paragraph>
        </div>

        <div className="system-introduction">
          <Title level={2}>Our Customers&apos; Feedback</Title>
          <Row gutter={[24, 24]} justify="center">
            {feedbacks.map((feedback, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <div className="feedback-item">
                  <Title level={4}>{censorName(feedback.fullName || '')}</Title>
                  <Rate 
                    disabled 
                    value={feedback.rating} 
                    style={{ fontSize: 20 }}
                  />
                  <Paragraph className="feedback-text">
                    {feedback.comment}
                  </Paragraph>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="system-introduction">
          <Title level={2}>Our Partners</Title>
          <Row gutter={[16, 16]} justify="center">
            {partnerImages.map((partner, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <div
                  style={{
                    padding: '1px',
                    border: '1px solid #f0f0f0',
                    borderRadius: '1px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    style={{
                      width: '150px', // Set fixed width
                      height: '150px', // Set fixed height
                      objectFit: 'contain', // Keep aspect ratio
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
