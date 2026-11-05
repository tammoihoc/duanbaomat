// src/components/CategoryPage/CategoryPage.jsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCardModern from "../ProductCardModern/ProductCardModern";
import { api } from "../../services/api";
import "./CategoryPage.css";

export default function CategoryPage() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Lấy category từ URL pathname
  const getCategoryFromPath = () => {
    const path = location.pathname;
    // /pc-gaming -> pc-gaming
    // /laptop -> laptop
    // /phu-kien -> phu-kien
    // /khuyen-mai -> khuyen-mai
    const parts = path.split('/');
    return parts[1] || null; // Lấy phần tử đầu tiên sau dấu /
  };

  const category = getCategoryFromPath();

  // Map URL -> Backend category
  const categoryMap = {
    'pc-gaming': 'PC_GAMING',
    'laptop': 'LAPTOP',
    'phu-kien': 'ACCESSORY',
    'khuyen-mai': 'SALE'
  };

  const titleMap = {
    'pc-gaming': 'PC Gaming',
    'laptop': 'Laptop Gaming',
    'phu-kien': 'Phụ Kiện',
    'khuyen-mai': '🔥 Khuyến Mãi'
  };

  useEffect(() => {
    console.log('🟢 Pathname:', location.pathname);
    console.log('🟢 Category from URL:', category);
    fetchProducts();
  }, [location.pathname]);

// src/components/CategoryPage/CategoryPage.jsx
// Sửa phần fetchProducts

const fetchProducts = async () => {
  setLoading(true);
  try {
    let data = [];
    
    if (category === 'khuyen-mai') {
      // ✅ Lấy sản phẩm khuyến mãi (có discount > 0)
      console.log('🟢 Fetching sale products...');
      const allProducts = await api.getAllProducts();
      // Lọc sản phẩm có discount > 0
      data = allProducts.filter(p => p.discount > 0);
      console.log('🟢 Sale products found:', data.length);
    } else if (category && categoryMap[category]) {
      const cat = categoryMap[category];
      console.log('🟢 Fetching category:', cat);
      data = await api.getProductsByCategory(cat);
      // Lọc đúng category
      data = data.filter(p => p.category === cat);
    } else {
      console.log('🟢 Fetching all products...');
      data = await api.getAllProducts();
    }
    
    console.log('🟢 Products found:', data.length);
    setProducts(data);
  } catch (error) {
    console.error('🔴 Error fetching products:', error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setIsSearching(false);
      return;
    }
    const results = products.filter(p => 
      p.name?.toLowerCase().includes(term.toLowerCase()) ||
      p.brand?.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  const displayProducts = isSearching ? searchResults : products;

  if (loading) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="loading-products">⏳ Đang tải sản phẩm...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="category-banner">
          <h1>{titleMap[category] || "Tất cả sản phẩm"}</h1>
          <p>{displayProducts.length} sản phẩm</p>
        </div>
        <div className="category-search-bar"></div>
        <div className="category-products">
          {displayProducts.length === 0 ? (
            <div className="no-results-category">
              <span>📭</span>
              <h3>Không có sản phẩm nào</h3>
              <p>Chưa có sản phẩm trong danh mục này</p>
            </div>
          ) : (
            displayProducts.map((product, idx) => {
              const salePrice = product.discount > 0 
                ? product.price - (product.price * product.discount / 100)
                : product.price;
              
              return (
                <ProductCardModern 
                  key={product.id} 
                  product={{
                    ...product,
                    salePrice: salePrice
                  }} 
                  index={idx} 
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
