import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductList from "../../components/ProductList";

import "./index.css";
import Banner from "../../components/banner";

function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <main>
      <Banner/>
       
        <h1>Danh sách trang trại nổi tiếng</h1>
        <ProductList />
       
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
