import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductList from "../../components/ProductList";

import "./index.css";
import Banner from "../../components/banner";

function HomePage() {
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4; // Số lượng giống cá Koi hiển thị mỗi trang

  const fetchKoiVarieties = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/koi-varieties");
      if (!response.ok) {
        throw new Error("Unable to get Koi varieties data");
      }
      const data = await response.json();
      // Trộn dữ liệu ngẫu nhiên
      const shuffledData = data.sort(() => 0.5 - Math.random());
      setKoiVarieties(shuffledData);
    } catch (error) {
      console.error("Không thể lấy dữ liệu giống cá Koi", error);
    }
  };

  useEffect(() => {
    fetchKoiVarieties();
  }, []);

  const totalPages = Math.ceil(koiVarieties.length / itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentKois = koiVarieties.slice(currentIndex * itemsPerPage, (currentIndex + 1) * itemsPerPage);

  return (
    <div className="home-page">
      <Header />

      <main>
        <Banner />

        <h1>Danh sách trang trại nổi tiếng</h1>
        <ProductList />
        <div>
          <h1>Popular koi varieties</h1>
          <div className="koi-container">
            <button onClick={handlePrev} disabled={currentIndex === 0}>&lt;</button>
            <div className="koi-grid">
              {currentKois.map((koi) => (
                <div key={koi.varietyId} className="koi-card">
                  <img
                    src={koi.imageUrl}
                    alt={koi.varietyName}
                    className="koi-avatar"
                  />
                  <p>Loại: {koi.varietyName}</p>
                  <p>Giá: {koi.koiPrice} VNĐ</p>
                  <p>Mô tả: {koi.description}</p>
                </div>
              ))}
            </div>
            <button onClick={handleNext} disabled={currentIndex === totalPages - 1}>&gt;</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
