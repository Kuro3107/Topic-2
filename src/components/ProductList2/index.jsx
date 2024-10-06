import { Col, Row } from "antd";
import "../ProductList2/index.css";
import bgImage1 from "../../assets/img/kohaku.png";
import bgImage2 from "../../assets/img/utsuri.png";

function ProductList2() {
  return (
    <div className="block informationBlock">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div className="holder">
            <div className="image-container">
              <img src={bgImage1} alt="Kohaku Koi" className="fish-image" />
            </div>
            <div className="text-container">
              <h3>KOHAKU KOI FISH</h3>
              <p>
                Kohaku Koi nổi bật với nền trắng tinh khiết và những đốm đỏ sắc
                nét, tượng trưng cho sự thanh lịch và thuần khiết.
              </p>
            </div>
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }}>
          <div className="holder">
            <div className="image-container">
              <img src={bgImage2} alt="Kohaku Koi" className="fish-image" />
            </div>
            <div className="text-container">
              <h3>UTSURI KOI FISH</h3>
              <p>
                Utsuri Koi với nền đen mạnh mẽ kết hợp cùng các mảng màu trắng,
                đỏ, vàng, thể hiện sự tương phản và cá tính nổi bật.
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ProductList2;
