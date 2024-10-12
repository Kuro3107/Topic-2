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
    fetchKois();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch(
        "https://66fbc1b08583ac93b40d17b4.mockapi.io/Farm"
      );
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
      const response = await fetch(
        "https://66fbc1b08583ac93b40d17b4.mockapi.io/Kois"
      );
      if (!response.ok) {
        throw new Error("Unable to get Koi data");
      }
      const data = await response.json();
      setKois(data);
    } catch (error) {
      console.error("Unable to get Koi data", error);
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
    ? kois.filter((koi) => koi.variety === selectedFarm.variety)
    : [];

  return (
    <div className="farm-list">
      {selectedFarm ? (
        <div className="farm-detail">
          <h2>{selectedFarm.name}</h2>
          <img
            src={selectedFarm.avatar}
            alt={selectedFarm.name}
            className="farm-avatar"
          />
          <p>Loại: {selectedFarm.variety}</p>
          <p>Ngày: {new Date(selectedFarm.date * 1000).toLocaleDateString()}</p>
          <h3>Types of Koi fish:</h3>
          <div className="koi-grid">
            {filteredKois.map((koi) => (
              <div key={koi.id} className="koi-card">
                <img
                  src={koi.avatar}
                  alt={koi.variety}
                  className="koi-avatar"
                />
                <p>Type: {koi.variety}</p>
                <p>Price: {koi.price} USD</p>
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
                key={farm.id}
                className="farm-card"
                onClick={() => handleFarmClick(farm)}
              >
                <img
                  src={farm.avatar}
                  alt={farm.name}
                  className="farm-avatar"
                />
                <h3>{farm.name}</h3>
                <p>Loại: {farm.variety}</p>
                <p>Ngày: {new Date(farm.date * 1000).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <div className="pagination">
            {Array.from(
              { length: Math.ceil(farms.length / farmsPerPage) },
              (_, i) => (
                <button key={i} onClick={() => paginate(i + 1)}>
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
