// src/components/HomePage/HomePage.jsx
import { useState, useEffect } from "react";
import Hero from "../Hero/Hero";
import ProductSlider from "../ProductSlider/ProductSlider";
import { api } from "../../services/api";
import "./HomePage.css";

export default function HomePage() {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await api.getAllProducts();
      const products = Array.isArray(allProducts) ? allProducts : [];
      
      // Flash Sale: sản phẩm có giảm giá
      const flash = products.filter(p => p.discount && p.discount > 0);
      setFlashSaleProducts(flash);

      // Bán chạy nhất
      const sortedBySold = [...products]
        .filter(p => p.soldCount && p.soldCount > 0)
        .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
        .slice(0, 20);
      setBestSellerProducts(sortedBySold);

      // Mới ra mắt
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newItems = products.filter(p => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        return createdDate >= thirtyDaysAgo;
      });
      setNewProducts(newItems);

    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <Hero />
        <div className="loading-products">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Hero />
      
      {/* Flash Sale - Sản phẩm giảm giá (KHÔNG CÓ BỘ ĐẾM GIỜ) */}
      {flashSaleProducts.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrapper">
                <span className="section-icon">🔥</span>
                <h2>FLASH SALE - GIẢM SỐC</h2>
              </div>
            </div>
            <ProductSlider 
              title=""
              products={flashSaleProducts} 
              viewAllLink="/khuyen-mai" 
            />
          </div>
        </section>
      )}

      {/* Best Sellers - Bán chạy nhất (Top 20) */}
      {bestSellerProducts.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrapper">
                <span className="section-icon">🏆</span>
                <h2>BÁN CHẠY NHẤT</h2>
              </div>
              <span className="section-subtitle">Top 20 sản phẩm được mua nhiều nhất</span>
            </div>
            <ProductSlider 
              title=""
              products={bestSellerProducts} 
              viewAllLink="/best-seller" 
            />
          </div>
        </section>
      )}

      {/* New Arrivals - Mới ra mắt (30 ngày gần nhất) */}
      {newProducts.length > 0 && (
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <div className="section-title-wrapper">
                <span className="section-icon">✨</span>
                <h2>MỚI RA MẮT</h2>
              </div>
              <span className="section-subtitle">Sản phẩm mới trong 30 ngày qua</span>
            </div>
            <ProductSlider 
              title=""
              products={newProducts} 
              viewAllLink="/new-arrivals" 
            />
          </div>
        </section>
      )}
    </div>
  );
}
