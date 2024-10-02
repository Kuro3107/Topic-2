import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductList from "../../components/ProductList";

import "../home/index.css";

function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <main>
        <h1>Danh sách Farm</h1>
        <ProductList />
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
