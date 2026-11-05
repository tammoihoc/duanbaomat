// src/components/SearchPage/SearchPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import ProductCardModern from "../ProductCardModern/ProductCardModern";
import "./SearchPage.css";

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
    if (q.trim()) {
      performSearch(q);
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [location.search]);

  const performSearch = async (keyword) => {
    setLoading(true);
    try {
      const allProducts = await api.getAllProducts();
      const results = allProducts.filter(p => 
        p.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        p.brand?.toLowerCase().includes(keyword.toLowerCase())
      );
      setProducts(results);
    } catch (error) {
      console.error("Error searching:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="search-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        {/* Title - Kết quả cho "..." */}
        <motion.div 
          className="search-title-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div 
            className="search-title-wrapper"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="search-title">
              Kết quả cho "<span className="highlight">{query}</span>"
            </h1>
          </motion.div>
          <motion.p 
            className="search-count"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {products.length} sản phẩm
          </motion.p>
        </motion.div>

        {/* Results */}
        <div className="search-results">
          {loading ? (
            <motion.div 
              className="search-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="loader"></div>
              <p>Đang tìm kiếm...</p>
            </motion.div>
          ) : (
            <>
              {products.length === 0 && query && (
                <motion.div 
                  className="no-results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="no-results-icon">🔍</div>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>Hãy thử tìm kiếm với từ khóa khác</p>
                  <div className="suggestions">
                    <span>Gợi ý:</span>
                    <button onClick={() => navigate("/pc-gaming")}>PC Gaming</button>
                    <button onClick={() => navigate("/laptop")}>Laptop</button>
                    <button onClick={() => navigate("/phu-kien")}>Phụ kiện</button>
                  </div>
                </motion.div>
              )}

              <motion.div 
                className="products-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                  >
                    <ProductCardModern product={product} index={idx} />
                  </motion.div>
                ))}
              </motion.div>

              {products.length > 0 && (
                <motion.div 
                  className="results-footer"
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
