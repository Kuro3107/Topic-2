import { useState, useEffect } from "react";
import Header from "../../components/header/index";
import Footer from "../../components/footer/index";
import ProductList from "../../components/ProductList";

import "./index.css";
import Banner from "../../components/banner";

function Introduce() {
  const [koiVarieties, setKoiVarieties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const koisPerPage = 6; // Số lượng Koi hiển thị mỗi trang

  const fetchKoiVarieties = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/koi-varieties");
      if (!response.ok) {
        throw new Error("Unable to get Koi varieties data");
      }
      const data = await response.json();
      setKoiVarieties(data);
    } catch (error) {
      console.error("Cannot get Koi fish data", error);
    }
  };

  useEffect(() => {
    fetchKoiVarieties();
  }, []);

  // Tính toán Koi cho trang hiện tại
  const indexOfLastKoi = currentPage * koisPerPage;
  const indexOfFirstKoi = indexOfLastKoi - koisPerPage;
  const currentKois = koiVarieties.slice(indexOfFirstKoi, indexOfLastKoi);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="home-page">
      <Header />

      <main>
        <Banner />

        <h1>Farms List</h1>
        <ProductList />
        <div>
          <h1>Koi Varieties</h1>
          <div className="koi-grid">
            {currentKois.map((koi) => (
              <div key={koi.varietyId} className="koi-card">
                <img
                  src={koi.imageUrl}
                  alt={koi.varietyName}
                  className="koi-avatar"
                />
                <div className="koi-info">
                  <p>Type: {koi.varietyName}</p>
                  <p>Average Price: {koi.koiPrice.toLocaleString()} VNĐ</p>
                  <p>Describe: {koi.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(koiVarieties.length / koisPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  style={{
                    fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
                    backgroundColor: currentPage === i + 1 ? '#007bff' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#000',
                  }}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Introduce;
