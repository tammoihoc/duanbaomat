// src/components/ShopPage/ShopPage.jsx
import { useState } from "react";
import FilterSidebar from "../FilterSidebar/FilterSidebar";
import ProductSlider from "../ProductSlider/ProductSlider"; // THÊM DÒNG NÀY
import ProductCardModern from "../ProductCardModern/ProductCardModern";
import "./ShopPage.css";

// Dữ liệu mẫu với ảnh thật
const allProducts = [
  {
    id: 1,
    name: "ROG Strix G16 Gaming Laptop",
    brand: "ASUS ROG",
    category: "laptop",
    price: 42990000,
    oldPrice: 59990000,
    discount: 28,
    rating: 5,
    reviews: 234,
    isNew: true,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
  },
  {
    id: 2,
    name: "Gaming PC RTX 5090 Ultimate",
    brand: "ShopPC",
    category: "pc",
    price: 69990000,
    oldPrice: 89990000,
    discount: 22,
    rating: 5,
    reviews: 128,
    bestseller: true,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400",
  },
  {
    id: 3,
    name: "Odyssey OLED G9 Monitor",
    brand: "Samsung",
    category: "monitor",
    price: 12990000,
    oldPrice: 18990000,
    discount: 31,
    rating: 5,
    reviews: 89,
    isNew: true,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
  },
  {
    id: 4,
    name: "K100 RGB Mechanical Keyboard",
    brand: "Corsair",
    category: "keyboard",
    price: 2890000,
    rating: 4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1585222872942-9e6f5901af3c?w=400",
  },
  {
    id: 5,
    name: "G Pro X Superlight",
    brand: "Logitech",
    category: "mouse",
    price: 1890000,
    oldPrice: 2890000,
    discount: 35,
    rating: 5,
    reviews: 412,
    bestseller: true,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400",
  },
  {
    id: 6,
    name: "Virtuoso RGB Wireless SE",
    brand: "Corsair",
    category: "headset",
    price: 3590000,
    rating: 4,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
  },
];

const favoriteProducts = allProducts.filter(p => p.bestseller || (p.discount && p.discount > 25));
const newProducts = allProducts.filter(p => p.isNew);
const gamingProducts = allProducts.filter(p => p.category === "pc" || p.category === "laptop");

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleFilter = (filters) => {
    let filtered = [...allProducts];
    
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }
    
    if (filters.price) {
      filtered = filtered.filter(p => p.price >= filters.price.min && p.price <= filters.price.max);
    }
    
    setFilteredProducts(filtered);
    setIsSearching(false);
  };

  const handleSearch = (term) => {
    if (!term.trim()) {
      setIsSearching(false);
      return;
    }
    const results = allProducts.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.brand.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(true);
  };

  return (
    <div className="shop-page">
      <div className="container">
        {/* Product Sliders */}
        <ProductSlider title="🔥 Yêu thích nhất" products={favoriteProducts} viewAllLink="#" />
        <ProductSlider title="✨ Mới ra mắt" products={newProducts} viewAllLink="#" />
        <ProductSlider title="🎮 PC Gaming" products={gamingProducts} viewAllLink="#" />

        {/* Shop Header */}
        <div className="shop-header">
          <h2>Tất cả <span className="gradient-text">Sản Phẩm</span></h2>
          <p>Khám phá bộ sưu tập công nghệ đỉnh cao 2026</p>
        </div>

        {/* Filter Bar */}
        <div className="shop-filter-bar">
          <div className="filter-stats">
            <span>{filteredProducts.length} sản phẩm</span>
          </div>
        </div>

        {/* Main Shop Layout with Filter */}
        <div className="shop-layout">
          <aside className="shop-sidebar">
            <FilterSidebar onFilter={handleFilter} onSearch={handleSearch} />
          </aside>

          <main className="shop-content">
            {isSearching && (
              <div className="search-header">
                <h3>Kết quả tìm kiếm: <span>{searchResults.length}</span> sản phẩm</h3>
                <button onClick={() => setIsSearching(false)}>Xem tất cả</button>
              </div>
            )}

            <div className="products-grid-shop">
              {(isSearching ? searchResults : filteredProducts).map((product, idx) => (
                <ProductCardModern key={product.id} product={product} index={idx} />
              ))}
            </div>

            {(isSearching ? searchResults : filteredProducts).length === 0 && (
              <div className="no-results">
                <p>Không tìm thấy sản phẩm nào.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
