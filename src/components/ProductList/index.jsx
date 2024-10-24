import { useState, useEffect } from "react";
import "./styles.css";

function ProductList() {
  const [farms, setFarms] = useState([]);
  const [kois, setKois] = useState([]); // Đảm bảo kois được khởi tạo là mảng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const farmsPerPage = 6;

  useEffect(() => {
    fetchFarms();
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

  const fetchKoiVarieties = async (farmId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/farms/${farmId}/koi-varieties`);
      if (!response.ok) {
        throw new Error("Unable to get Koi varieties data");
      }
      const data = await response.json();
      console.log("Koi Data Received:", data); // Kiểm tra dữ liệu nhận được
      setKois(data); // Lưu trữ toàn bộ dữ liệu trả về
    } catch (error) {
      console.error("Cannot get Koi fish data", error);
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
    fetchKoiVarieties(farm.farmId); // Gọi hàm fetchKoiVarieties với farmId
  };

  // Lọc Koi theo variety của farm được chọn
  const filteredKois = selectedFarm ? kois : []; // Chỉ sử dụng danh sách koiVarieties đã lưu nếu có farm được chọn

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
          <h3>Types of Koi fish:</h3>
          <div className="koi-grid">
            {filteredKois.length > 0 ? (
              filteredKois.map((koi) => (
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
              ))
            ) : (
              <p>No Koi data available for this farm.</p>
            )}
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
