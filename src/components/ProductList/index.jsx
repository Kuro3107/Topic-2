import { useState, useEffect } from "react";
import "./styles.css";

function ProductList() {
  const [farms, setFarms] = useState([]);
  const [kois, setKois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const farmsPerPage = 6;

  useEffect(() => {
    fetchFarms();
    fetchKois(); // Gọi hàm fetchKois để lấy dữ liệu Koi
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/farms");
      if (!response.ok) {
        throw new Error("Unable to get Farm data");
      }
      const data = await response.json();
      setFarms(data);
      setLoading(false);
    } catch (error) {
      setError("Unable to get Farm data");
      setLoading(false);
    }
  };

  const fetchKois = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/koi_variety");
      if (!response.ok) {
        throw new Error("Unable to get Koi data");
      }
      const data = await response.json();
      setKois(data);
    } catch (error) {
      console.error("Không thể lấy dữ liệu Koi", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Tính toán farms cho trang hiện tại
  const indexOfLastFarm = currentPage * farmsPerPage;
  const indexOfFirstFarm = indexOfLastFarm - farmsPerPage;
  const currentFarms = farms.slice(indexOfFirstFarm, indexOfLastFarm);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Xử lý khi nhấp vào farm
  const handleFarmClick = (farm) => {
    setSelectedFarm(farm);
  };

  // Lọc Koi theo variety của farm được chọn
  const filteredKois = selectedFarm
    ? kois.filter((koi) => koi.farmId === selectedFarm.farmId) // Giả sử rằng mỗi Koi có farmId
    : [];

  return (
    <div className="farm-list">
      {selectedFarm ? (
        <div className="farm-detail">
          <h2>{selectedFarm.farmName}</h2>
          <img
            src={selectedFarm.imageUrl}
            alt={selectedFarm.farmName}
            className="farm-avatar"
          />
          <p>Location: {selectedFarm.location}</p>
          <p>Contact Info: {selectedFarm.contactInfo}</p>
          <h3>Các loại cá Koi:</h3>
          <div className="koi-grid">
            {filteredKois.map((koi) => (
              <div key={koi.id} className="koi-card">
                <img
                  src={koi.imageUrl}
                  alt={koi.variety_name}
                  className="koi-avatar"
                />
                <p>Loại: {koi.variety}</p>
                <p>Giá: {koi.price} VNĐ</p>
              </div>
            ))}
          </div>
          <button onClick={() => setSelectedFarm(null)}>
            Back to Farm List
          </button>
        </div>
      ) : (
        <>
          <div className="farm-grid">
            {currentFarms.map((farm) => (
              <div
                key={farm.farmId}
                className="farm-card"
                onClick={() => handleFarmClick(farm)}
              >
                <img
                  src={farm.imageUrl}
                  alt={farm.farmName}
                  className="farm-avatar"
                />
                <h3>{farm.farmName}</h3>
                <p>Địa điểm: {farm.location}</p>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(farms.length / farmsPerPage) },
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
        </>
      )}
    </div>
  );
}

export default ProductList;