// src/components/ProductCardModern/ProductCardModern.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import "./ProductCardModern.css";

export default function ProductCardModern({ product, index }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Lấy giá sale
  const salePrice = product.salePrice || (product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price);

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Ngăn chặn navigate khi click vào nút
    if (!user) {
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      const result = await api.addToCart(user.id, product.id, 1);
      if (result.success) {
        // Cập nhật số lượng giỏ hàng trên Navbar
        window.dispatchEvent(new Event("cartUpdated"));
        // Hiệu ứng feedback (có thể thêm toast)
        console.log("✅ Đã thêm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
    } finally {
      setIsAdding(false);
    }
  };

  // Xử lý click vào sản phẩm (trừ nút Mua ngay)
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`product-card-compact ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
      style={{ cursor: "pointer" }}
    >
      {/* Badges */}
      <div className="compact-badges">
        {product.discount > 0 && (
          <span className="compact-badge discount">-{product.discount}%</span>
        )}
        {product.isNew && (
          <span className="compact-badge new">Mới</span>
        )}
        {product.bestseller && (
          <span className="compact-badge bestseller">⭐ Best</span>
        )}
      </div>

      {/* Image */}
      <div className="compact-image-wrapper">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Info */}
      <div className="compact-info">
        <div className="compact-meta">
          <span className="compact-brand">{product.brand || "ShopPC"}</span>
        </div>
        <h3 className="compact-title">{product.name}</h3>
        
        <div className="compact-rating">
          <div className="compact-stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={i < (product.rating || 0) ? "filled" : ""} size={12} />
            ))}
          </div>
          <span className="compact-reviews">({product.reviews || 0})</span>
        </div>

        <div className="compact-price">
          {product.discount > 0 ? (
            <>
              <span className="compact-current sale-price">
                {salePrice.toLocaleString()}đ
              </span>
              <span className="compact-old">{product.price.toLocaleString()}đ</span>
              <span className="discount-badge">-{product.discount}%</span>
            </>
          ) : (
            <span className="compact-current">{product.price.toLocaleString()}đ</span>
          )}
        </div>
      </div>

      {/* Nút Mua ngay - KHÔNG bị navigate */}
      <button 
        className="compact-cart-btn"
        onClick={handleAddToCart}
        disabled={isAdding}
      >
        <ShoppingCart size={14} /> 
        {isAdding ? "Đang thêm..." : "Mua ngay"}
      </button>
    </motion.div>
  );
}
