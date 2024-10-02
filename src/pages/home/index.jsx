import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductList from "../../components/ProductList";

import "./index.css";

function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <main>
        <h1>"Hành Trình Cá Koi Nhật Bản - Lựa Chọn & Đặt Ngay"</h1>
        {/* < Information/> */}
        <h1>Danh sách trang trại nổi tiếng</h1>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
