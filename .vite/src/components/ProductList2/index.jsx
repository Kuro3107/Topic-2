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
                Kohaku Koi stands out with its pure white background and sharp
                red spots, symbolizing elegance and purity.
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
                Utsuri Koi with a strong black background combined with white,
                red, yellow patches, showing contrast and outstanding
                personality.
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ProductList2;
