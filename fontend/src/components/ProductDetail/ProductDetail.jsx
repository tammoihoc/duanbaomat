// src/components/ProductDetail/ProductDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, Star, ArrowLeft, Truck, Shield, Award, CheckCircle
} from "lucide-react";
import { api } from "../../services/api";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [buttonText, setButtonText] = useState("Mua ngay");
  const buttonRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await api.getProductById(id);
      // Dữ liệu đã được giải mã từ backend
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isAdding) return;

    setIsAdding(true);
    setButtonText("Đang thêm...");

    try {
      const result = await api.addToCart(user.id, product.id, 1);
      if (result.success) {
        // Cập nhật số lượng trên Navbar
        window.dispatchEvent(new Event("cartUpdated"));
        
        // Đổi chữ thành "✅ Đã thêm!"
        setButtonText("✅ Đã thêm!");
        
        // Sau 1.5 giây đổi lại "Mua ngay"
        setTimeout(() => {
          setButtonText("Mua ngay");
          setIsAdding(false);
        }, 1000);
      } else {
        setButtonText("Mua ngay");
        setIsAdding(false);
        alert("Có lỗi xảy ra, vui lòng thử lại");
      }
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      setButtonText("Mua ngay");
      setIsAdding(false);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading-detail">
            <div className="loader"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <span>🔍</span>
            <h2>Không tìm thấy sản phẩm</h2>
            <p>Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
            <button onClick={() => navigate("/")}>Về trang chủ</button>
          </div>
        </div>
      </div>
    );
  }

  const salePrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  let specs = {};
  try {
    specs = typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs;
  } catch (e) {
    specs = {};
  }

  const specEntries = Object.entries(specs);

  // Xác định màu nền cho nút
  const getButtonStyle = () => {
    if (buttonText === "✅ Đã thêm!") {
      return { background: "#10b981" };
    }
    return {};
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>Trang chủ</span>
          <span className="separator">›</span>
          <span onClick={() => navigate(-1)}>{product.category || "Sản phẩm"}</span>
          <span className="separator">›</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Left: Image */}
          <div className="product-detail-image">
            <div className="main-image">
              <img 
                src={product.image || "https://via.placeholder.com/500"} 
                alt={product.name} 
              />
              {product.discount > 0 && (
                <div className="image-badge">-{product.discount}%</div>
              )}
              {product.isNew && (
                <div className="image-badge new">Mới</div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="product-detail-info">
            {/* Brand & Status */}
            <div className="info-top">
              <span className="brand">{product.brand || "ShopPC"}</span>
              <span className={`status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock > 0 ? (
                  <><CheckCircle size={14} /> Còn hàng ({product.stock})</>
                ) : (
                  <>❌ Hết hàng</>
                )}
              </span>
            </div>

            {/* Name */}
            <h1 className="product-title">{product.name}</h1>

            {/* Rating */}
            <div className="rating-section">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={i < (product.rating || 0) ? "filled" : ""} size={16} />
                ))}
              </div>
              <span className="rating-text">({product.reviews || 0} đánh giá)</span>
              <span className="sold-count">| Đã bán {product.soldCount || 0}</span>
            </div>

            {/* Price */}
            <div className="price-section">
              {product.discount > 0 ? (
                <>
                  <span className="sale-price">{salePrice.toLocaleString()}đ</span>
                  <span className="old-price">{product.price.toLocaleString()}đ</span>
                  <span className="discount-badge">-{product.discount}%</span>
                </>
              ) : (
                <span className="sale-price">{product.price.toLocaleString()}đ</span>
              )}
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <Truck size={16} />
                <span>Giao hàng miễn phí</span>
              </div>
              <div className="feature">
                <Shield size={16} />
                <span>Bảo hành 12 tháng</span>
              </div>
              <div className="feature">
                <Award size={16} />
                <span>Chính hãng 100%</span>
              </div>
            </div>

            {/* Nút Mua ngay - CÓ HIỂN THỊ "Đã thêm!" */}
            <button 
              className="buy-now-btn"
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAdding}
              style={getButtonStyle()}
            >
              <ShoppingCart size={20} />
              {buttonText}
            </button>

            {/* Mô tả sản phẩm */}
            {product.description && (
              <div className="description-section">
                <div className="description-header">
                  <span className="desc-icon">📝</span>
                  <h4 className="desc-title">Mô tả sản phẩm</h4>
                </div>
                <div className="description-text">
                  <p>{product.description}</p>
                </div>
              </div>
            )}

            {/* Bảng thông số */}
            {specEntries.length > 0 && (
              <div className="specs-section">
                <h3 className="specs-title">📋 Thông số kỹ thuật</h3>
                <div className="specs-table-wrapper">
                  <table className="specs-table">
                    <tbody>
                      {specEntries.map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-key">{key}</td>
                          <td className="spec-value">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
