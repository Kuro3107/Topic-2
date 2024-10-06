import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductList from "../../components/ProductList";

import "./index.css";
import Banner from "../../components/banner";
import ProductList2 from "../../components/ProductList2";
// import Advertise from "../../components/advertise";

function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <main>
        <Banner />

        <h1>Danh sách trang trại nổi tiếng</h1>
        <ProductList />
        <div>
          <h1>Các loại koi phổ biến</h1>
          <ProductList2 />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
